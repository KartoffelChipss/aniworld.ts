/**
 * Parses the flag image source to extract audio and subtitle languages.
 * @param flagSrc The source URL of the flag image.
 * @returns An object containing the audio and subtitle languages.
 */
export function parseFlagSrcToLanguages(flagSrc: string): {
    audio: string;
    subtitle: string | null;
} {
    // /public/img/japanese-german.svg -> japanese audio & german subtitles
    // /public/img/german.svg -> german audio & no subtitles
    const parts = flagSrc.split('/');
    const filename = parts[parts.length - 1]; // "german.svg" or "japanese-german.svg"
    const nameWithoutExt = filename.replace(/\.[^.]+$/, ''); // remove .svg enging
    const [audioPart, subtitlePartRaw] = nameWithoutExt.split('-');
    const subtitlePart = subtitlePartRaw || null;

    return {
        audio: audioPart,
        subtitle: subtitlePart,
    };
}
