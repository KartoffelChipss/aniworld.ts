export type Language = 'german' | 'japanese' | 'english';
export const Languages: Language[] = ['german', 'japanese', 'english'];
export function isLanguage(value: string): value is Language {
    return Languages.includes(value as Language);
}

export interface Episode {
    /** The episode number. */
    episodeNumber: number;
    /** The title of the episode. */
    title: string | null;
    /** The original title of the episode. */
    originalTitle: string | null;
    /** The available languages for the episode. */
    languages: {
        /** The audio language of the episode. */
        audio: Language;
        /** The subtitle language of the episode. */
        subtitle: Language | null;
    }[];
}

export type ExtractedSeason = Episode[];

export interface Season {
    /** The season number. */
    seasonNumber: number;
    /** The list of episodes in the season. */
    episodes: ExtractedSeason;
    /** The URL of the season page. */
    url: string;
}
