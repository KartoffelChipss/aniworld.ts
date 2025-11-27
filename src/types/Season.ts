import { Hoster } from './Hoster';
import { EpisodeLanguage, Language } from './Language';

export interface SeasonEpisode {
    /** The episode number. */
    episodeNumber: number;
    /** The title of the episode. */
    title: string | null;
    /** The original title of the episode. */
    originalTitle: string | null;
    /** The available languages for the episode. */
    languages: EpisodeLanguage[];
    /** The available hosters for the episode. */
    hosters: Hoster[];
}

export type ExtractedSeason = SeasonEpisode[];

export interface Season {
    /** The season number. */
    seasonNumber: number;
    /** The list of episodes in the season. */
    episodes: ExtractedSeason;
    /** The URL of the season page. */
    url: string;
}
