import {
    Episode,
    ExtractedSeason,
    isLanguage,
    Language,
    Languages,
} from '../types/Season';
import { Extractor } from './Extractor';

export class SeasonExtractor extends Extractor<ExtractedSeason | null> {
    public async extract(): Promise<ExtractedSeason | null> {
        const $ = await this.fetchHtmlRoot();

        const root = $('html');

        if (root.find('div.messageAlert.danger').length > 0) {
            return null;
        }

        const episodes: Episode[] = $('table.seasonEpisodesList tbody tr')
            .map((_, el) => {
                const node = $(el);

                const episodeNumber = parseInt(
                    node.find('td:first-child a').text().slice(6).trim(),
                    10
                ); // "Folge X"
                const title =
                    node.find('td:nth-child(2) a strong').text().trim() || null;
                const originalTitle =
                    node.find('td:nth-child(2) a span').text().trim() || null;

                const languages = node
                    .find('td:nth-child(4) img')
                    .map((_, langEl) => $(langEl).attr('src') || null)
                    .map((_, src) => {
                        // /public/img/japanese-german.svg -> japanese audio & german subtitles
                        // /public/img/german.svg -> german audio & no subtitles
                        if (src === null) return null;
                        const parts = src.split('/');
                        const filename = parts[parts.length - 1]; // "german.svg" or "japanese-german.svg"
                        const nameWithoutExt = filename.replace(/\.[^.]+$/, ''); // remove .svg enging
                        const [audioPart, subtitlePartRaw] =
                            nameWithoutExt.split('-');
                        const subtitlePart = subtitlePartRaw || null;
                        if (
                            !isLanguage(audioPart) ||
                            (subtitlePart !== null && !isLanguage(subtitlePart))
                        ) {
                            return null;
                        }

                        return {
                            audio: audioPart,
                            subtitle: subtitlePart,
                        };
                    })
                    .get();

                return {
                    episodeNumber,
                    title,
                    originalTitle,
                    languages,
                };
            })
            .get();

        return episodes;
    }
}
