export type Language = 'german' | 'japanese' | 'english';
export const Languages: Language[] = ['german', 'japanese', 'english'];
export function isLanguage(value: string): value is Language {
    return Languages.includes(value as Language);
}

export interface EpisodeLanguage {
    /** The audio language of the episode. */
    audio: Language;
    /** The subtitle language of the episode. */
    subtitle: Language | null;
}

export interface KeyedEpisodeLanguage extends EpisodeLanguage {
    /** An index key for the language combination for this episode */
    key: string;
}
