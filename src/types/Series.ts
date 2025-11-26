export interface ExtractedSeries {
    title: string;
    description: string | null;
    bannerUrl: string;
    startYear: number;
    endYear: number | null;
    directors: string[];
    actors: string[];
    creators: string[];
    countriesOfOrigin: string[];
    genres: string[];
    ageRating: string;
    imdbUrl: string | null;
    trailerUrl: string | null;
    hasMovies: boolean;
    seasonsCount: number;
}

export interface Series extends ExtractedSeries {
    url: string;
}
