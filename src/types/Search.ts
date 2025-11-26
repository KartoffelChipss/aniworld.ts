export interface SearchResult {
    title: string;
    slug: string;
    description: string;
    cover: string;
    productionYear: string;
}

export type SearchResponse = SearchResult[];
