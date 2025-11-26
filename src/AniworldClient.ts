import * as cheerio from 'cheerio';
import { Logger } from './types/Logger';
import { fetchHtml } from './utils/requestHelpers';
import { SeriesDataExtractor } from './extractors/SeriesDataExtractor';
import { Series } from './types/Series';
import { SeasonExtractor } from './extractors/SeasonExtractor';
import { Season } from './types/Season';

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
    constructor(options?: AniworldClientOptions) {
        const mergedOptions = { ...defaultOptions, ...options };

        this.hostUrl = mergedOptions.hostUrl!;
        this.site = mergedOptions.site!;
        this.debugLogger = mergedOptions.debugLogger;
        this.userAgent = mergedOptions.userAgent!;
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
     * Fetches series information based on the provided title or slug.
     * @param title The title or slug of the series to fetch.
     * @returns A Promise that resolves to the Series information or null if not found.
     */
    public async getSeries(title: string): Promise<Series | null> {
        const url = `/${this.site}/stream/${encodeURIComponent(title)}`;
        const cheerioRoot = await this.getHtmlRoot(url);
        if (cheerioRoot === null) return null;

        const extractor = new SeriesDataExtractor(
            this.hostUrl,
            async () => cheerioRoot,
            this.debugLogger
        );

        const extractedSeries = await extractor.extract();
        if (extractedSeries === null) return null;

        return {
            ...extractedSeries,
            url: new URL(url, this.hostUrl).toString(),
        };
    }

    /**
     * Fetches episodes for a specific season of a series.
     * @param title The title or slug of the series.
     * @param seasonNumber The season number to fetch episodes for. 0 indicates movies.
     * @returns A Promise that resolves to the season information or null if not found.
     */
    public async getEpisodes(
        title: string,
        seasonNumber: number
    ): Promise<Season | null> {
        if (seasonNumber < 0) {
            throw new Error('Season number must be greater than 0.');
        }

        const url = `/${this.site}/stream/${encodeURIComponent(
            title
        )}/staffel-${seasonNumber}`;
        const cheerioRoot = await this.getHtmlRoot(url);
        if (cheerioRoot === null) return null;

        const extractor = new SeasonExtractor(
            this.hostUrl,
            async () => cheerioRoot,
            this.debugLogger
        );

        const extractedSeason = await extractor.extract();
        if (extractedSeason === null) return null;

        return {
            seasonNumber,
            episodes: extractedSeason,
            url: new URL(url, this.hostUrl).toString(),
        };
    }

    /**
     * Fetches movies for a specific series.
     * @param title The title or slug of the series.
     * @returns A Promise that resolves to the season information for movies or null if not found.
     */
    public async getMovies(title: string): Promise<Season | null> {
        return this.getEpisodes(title, 0);
    }
}
