export type Language = 'german' | 'japanese' | 'english';
export const Languages: Language[] = ['german', 'japanese', 'english'];
export function isLanguage(value: string): value is Language {
    return Languages.includes(value as Language);
}
