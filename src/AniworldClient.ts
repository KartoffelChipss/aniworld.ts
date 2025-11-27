import * as cheerio from 'cheerio';
import { Logger } from './types/Logger';
import { fetchHtml, fetchJson } from './utils/requestHelpers';
import { SeriesDataExtractor } from './extractors/SeriesDataExtractor';
import { Series } from './types/Series';
import { SeasonExtractor } from './extractors/SeasonExtractor';
import { Season } from './types/Season';
import { parseSearchResults } from './utils/searchHelpers';
import { EpisodeExtractor } from './extractors/EpisodeExtractor';
import { Episode } from './types/Episode';

interface AniworldClientOptions {
    hostUrl: string;
    site: string;
    debugLogger?: Logger;
    userAgent?: string;
}

const defaultOptions: Partial<AniworldClientOptions> = {
    hostUrl: 'https://aniworld.to',
    site: 'anime',
    userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
};

export class AniworldClient {
    private readonly hostUrl: string;
    private readonly site: string;
    private readonly debugLogger?: Logger;
    private userAgent: string;

    /**
     * Creates an instance of AniworldClient.
     * @param hostUrl The base URL for the streaming service (e.g., "https://aniworld.to").
     * @param site The specific site or subdomain to target (e.g., "animes").
     * @param debugLogger A logger instance for debugging purposes.
     * @param userAgent Optional user agent string to use for requests.
     */
    constructor(options?: Partial<AniworldClientOptions>) {
        const mergedOptions = { ...defaultOptions, ...options };

        this.hostUrl = mergedOptions.hostUrl!;
        this.site = mergedOptions.site!;
        this.debugLogger = mergedOptions.debugLogger;
        this.userAgent = mergedOptions.userAgent!;
    }

    /**
     * Returns a default logger that logs to the console.
     * @returns A Logger instance that logs to the console.
     */
    public static getDefaultLogger(): Logger {
        return {
            log: (message: string) => {
                console.log('[AniworldClient LOG]: ' + message);
            },
            error: (message: string) => {
                console.error('[AniworldClient ERROR]: ' + message);
            },
        };
    }

    /**
     * Gets the current user agent string used for HTTP requests.
     * @returns The user agent string.
     */
    public getUserAgent(): string {
        return this.userAgent;
    }

    /**
     * Sets the user agent string for HTTP requests.
     * @param userAgent The user agent string to set.
     */
    public setUserAgent(userAgent: string) {
        this.userAgent = userAgent;
    }

    /**
     * Searches for series based on the provided query.
     * @param query The search query string.
     * @returns A Promise that resolves to the search results or null if no results found.
     */
    public async search(query: string) {
        const url = `/ajax/seriesSearch?keyword=${encodeURIComponent(query)}`;
        const fullUrl = new URL(url, this.hostUrl).toString();

        this.debugLogger?.log(
            `Searching for query: ${query} at URL: ${fullUrl}`
        );

        const res = await fetchJson(
            fullUrl,
            {
                'User-Agent': this.userAgent,
            },
            this.debugLogger
        );
        if (res === null) {
            this.debugLogger?.log(
                `Invalid search response for query: ${query} at URL: ${fullUrl}`
            );
            return null;
        }

        const parsedResults = parseSearchResults(
            res,
            this.hostUrl,
            this.debugLogger
        );
        if (parsedResults === null) {
            this.debugLogger?.log(
                `Failed to parse search results for query: ${query} at URL: ${fullUrl}`
            );
            return null;
        }

        return parsedResults;
    }

    /**
     * Builds a complete URL from the provided segments.
     * @param segments The URL segments to join.
     * @returns The complete URL as a string.
     */
    private buildUrl(...segments: string[]): string {
        const path = segments.map(encodeURIComponent).join('/');
        return new URL(`/${this.site}/stream/${path}`, this.hostUrl).toString();
    }

    /**
     * Fetches and parses the HTML content from the specified path.
     * @param path The path to fetch HTML from.
     * @returns A Promise that resolves to a CheerioAPI instance or null if fetching fails.
     */
    private async getHtmlRoot(
        path: string
    ): Promise<cheerio.CheerioAPI | null> {
        const url = new URL(path, this.hostUrl).toString();
        this.debugLogger?.log(`Fetching HTML from URL: ${url}`);

        const webContent = await fetchHtml(
            url,
            {
                'User-Agent': this.userAgent,
            },
            this.debugLogger
        );

        if (webContent === null) {
            this.debugLogger?.log(`No content found at URL: ${url}`);
            return null;
        }

        return cheerio.load(webContent);
    }

    /**
     * Generic helper that fetches a page and runs an extractor.
     * @param path Relative path, e.g. `/anime/stream/some-title/staffel-1`
     * @param extractorFactory Factory that receives a getRoot function and returns an Extractor<T>
     */
    private async fetchAndExtract<T>(
        path: string,
        extractorFactory: (getRoot: () => Promise<cheerio.CheerioAPI>) => {
            extract: () => Promise<T | null>;
        }
    ): Promise<T | null> {
        const cheerioRoot = await this.getHtmlRoot(path);
        if (cheerioRoot === null) {
            this.debugLogger?.log(`No HTML at path: ${path}`);
            return null;
        }

        const extractor = extractorFactory(async () => cheerioRoot);
        const extracted = await extractor.extract();
        if (extracted === null) {
            this.debugLogger?.log(`Extractor returned null for path: ${path}`);
            return null;
        }
        return extracted;
    }

    /**
     * Fetches series information based on the provided title or slug.
     * @param title The title or slug of the series to fetch.
     * @returns A Promise that resolves to the Series information or null if not found.
     */
    public async getSeries(title: string): Promise<Series | null> {
        const path = this.buildUrl(title);
        const extracted = await this.fetchAndExtract(
            path,
            (getRoot) =>
                new SeriesDataExtractor(this.hostUrl, getRoot, this.debugLogger)
        );
        if (extracted === null) return null;

        return {
            ...extracted,
            url: new URL(path, this.hostUrl).toString(),
        };
    }

    /**
     * Fetches episodes for a specific season of a series.
     * @param title The title or slug of the series.
     * @param seasonNumber The season number to fetch episodes for. 0 indicates movies.
     * @returns A Promise that resolves to the season information or null if not found.
     */
    public async getSeason(
        title: string,
        seasonNumber: number
    ): Promise<Season | null> {
        const path = this.buildUrl(
            title,
            seasonNumber === 0 ? 'filme' : `staffel-${seasonNumber}`
        );
        const extractedEpisodes = await this.fetchAndExtract(
            path,
            (getRoot) =>
                new SeasonExtractor(this.hostUrl, getRoot, this.debugLogger)
        );
        if (extractedEpisodes === null) return null;

        return {
            seasonNumber,
            episodes: extractedEpisodes,
            url: new URL(path, this.hostUrl).toString(),
        };
    }

    /**
     * Fetches movies for a specific series.
     * @param title The title or slug of the series.
     * @returns A Promise that resolves to the season information for movies or null if not found.
     */
    public async getMovies(title: string): Promise<Season | null> {
        return this.getSeason(title, 0);
    }

    /**
     * Fetches a specific episode from a series and season.
     * @param title The title or slug of the series.
     * @param seasonNumber The season number of the episode.
     * @param episodeNumber The episode number to fetch. (Typically starts from 1)
     * @returns A Promise that resolves to the episode information or null if not found.
     */
    public async getEpisode(
        title: string,
        seasonNumber: number,
        episodeNumber: number
    ): Promise<Episode | null> {
        const path = this.buildUrl(
            title,
            seasonNumber === 0 ? 'filme' : `staffel-${seasonNumber}`,
            `episode-${episodeNumber}`
        );
        const extractedEpisode = await this.fetchAndExtract(
            path,
            (getRoot) =>
                new EpisodeExtractor(this.hostUrl, getRoot, this.debugLogger)
        );
        if (extractedEpisode === null) return null;

        return {
            ...extractedEpisode,
            url: new URL(path, this.hostUrl).toString(),
        };
    }

    /**
     * Fetches a specific movie from a series.
     * @param title The title or slug of the series.
     * @param movieNumber The movie number to fetch. (Typically starts from 1)
     * @returns A Promise that resolves to the movie information or null if not found.
     */
    public async getMovie(
        title: string,
        movieNumber: number
    ): Promise<Episode | null> {
        return this.getEpisode(title, 0, movieNumber);
    }
}
