export interface Episode {
    /** The episode number. */
    episodeNumber: number;
    /** The title of the episode. */
    title: string;
    /** The original title of the episode. */
    originalTitle: string;
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
