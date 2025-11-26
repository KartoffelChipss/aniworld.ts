import { Logger } from '../types/Logger';
import * as cheerio from 'cheerio';

export abstract class Extractor<T> {
    private readonly hostUrl: string;
    private readonly logger?: Logger;
    private readonly getHtmlRoot: () => Promise<cheerio.CheerioAPI>;

    /**
     * Creates an instance of Extractor.
     * @param hostUrl The base URL for the streaming service.
     * @param htmlFetcher A function that fetches and returns the HTML root as a CheerioAPI instance.
     * @param logger An optional logger instance for logging purposes.
     */
    public constructor(
        hostUrl: string,
        htmlFetcher: () => Promise<cheerio.CheerioAPI>,
        logger?: Logger
    ) {
        this.hostUrl = hostUrl;
        this.getHtmlRoot = htmlFetcher;
        this.logger = logger;
    }

    /**
     * Extracts data from the given title's html content.
     */
    public abstract extract(): Promise<T>;

    /**
     * Gets the logger instance.
     * @returns The logger instance, or undefined if not provided.
     */
    protected getLogger(): Logger | undefined {
        return this.logger;
    }

    protected async fetchHtmlRoot(): Promise<cheerio.CheerioAPI> {
        return this.getHtmlRoot();
    }

    protected getHostUrl(): string {
        return this.hostUrl;
    }
}
