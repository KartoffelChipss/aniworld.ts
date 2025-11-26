import { Logger } from '../types/Logger';
import { SearchResponse } from '../types/Search';

export function parseSearchResults(
    json: any,
    baseUrl: string,
    debugLogger?: Logger
): SearchResponse | null {
    debugLogger?.log('Parsing search results JSON: ' + JSON.stringify(json));

    const results: SearchResponse = [];

    if (!Array.isArray(json)) {
        debugLogger?.error(
            'Search results JSON does not contain a valid results array.'
        );
        return null;
    }

    for (const item of json) {
        if (
            typeof item.name === 'string' &&
            typeof item.link === 'string' &&
            typeof item.description === 'string' &&
            typeof item.cover === 'string' &&
            typeof item.productionYear === 'string'
        ) {
            results.push({
                title: item.name,
                slug: item.link,
                description: item.description,
                cover: new URL(item.cover, baseUrl).toString(),
                productionYear: item.productionYear,
            });
        } else {
            debugLogger?.log(
                'Skipping invalid search result item: ' + JSON.stringify(item)
            );
        }
    }

    return results;
}
