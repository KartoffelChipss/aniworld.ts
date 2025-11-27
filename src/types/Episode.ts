import { Hoster } from './Hoster';
import { EpisodeLanguage, KeyedEpisodeLanguage } from './Language';

export interface Media extends EpisodeLanguage {
    hoster: Hoster;
    url: string;
}

export interface ExtractedEpisode {
    title: string | null;
    englishTitle: string | null;
    episodeNumber: number;
    description: string | null;
    languages: KeyedEpisodeLanguage[];
    media: Media[];
}

export interface Episode extends ExtractedEpisode {
    url: string;
}
