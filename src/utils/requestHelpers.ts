import { Logger } from '../types/Logger';

/**
 * Fetches HTML content from the specified URL.
 * @param url The URL to fetch HTML content from.
 * @param headers Optional headers to include in the request.
 * @param logger Optional logger for logging request details.
 * @returns A Promise that resolves to the fetched HTML content as a string, or null if the resource is not found (404).
 */
export async function fetchHtml(
    url: string,
    headers?: Record<string, string>,
    logger?: Logger
): Promise<string | null> {
    const urlBuilder = new URL(url);

    const requestHeaders = new Headers({
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        ...headers,
    });

    logger?.log(`Fetching URL: ${urlBuilder.toString()}`);

    const response = await fetch(urlBuilder.toString(), {
        method: 'GET',
        headers: requestHeaders,
    });

    if (!response.ok) {
        if (response.status === 404) {
            logger?.log(`URL not found (404): ${urlBuilder.toString()}`);
            return null;
        }

        logger?.log(
            `Failed to fetch URL: ${urlBuilder.toString()} with status: ${response.status} ${response.statusText}`
        );
        throw new Error(
            `Failed to fetch ${urlBuilder.toString()}: ${response.status} ${response.statusText}`
        );
    }

    const html = await response.text();
    logger?.log(`Successfully fetched URL: ${urlBuilder.toString()}`);
    return html;
}
