import * as cheerio from 'cheerio';
import { Logger } from './types/Logger';
import { fetchHtml } from './utils/requestHelpers';
import { SeriesDataExtractor } from './extractors/SeriesDataExtractor';
import { Series } from './types/Series';

export class AniworldClient {
    private readonly hostUrl: string;
    private readonly site: string;
    private readonly debugLogger?: Logger;

    /**
     * Creates an instance of AniworldClient.
     * @param hostUrl The base URL for the streaming service (e.g., "https://aniworld.to").
     * @param site The specific site or subdomain to target (e.g., "animes").
     * @param debugLogger A logger instance for debugging purposes.
     */
    constructor(hostUrl: string, site: string, debugLogger?: Logger) {
        this.site = site;
        this.debugLogger = debugLogger;
        this.hostUrl = hostUrl;
    }

    private async getHtmlRoot(
        path: string
    ): Promise<cheerio.CheerioAPI | null> {
        const url = new URL(path, this.hostUrl).toString();
        this.debugLogger?.log(`Fetching HTML from URL: ${url}`);

        const webContent = await fetchHtml(url, {}, this.debugLogger);

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
}
