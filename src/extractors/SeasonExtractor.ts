import { Hoster, isHoster, normalizeHoster } from '../types/Hoster';
import { EpisodeLanguage, isLanguage } from '../types/Language';
import { SeasonEpisode, ExtractedSeason } from '../types/Season';
import { parseFlagSrcToLanguages } from '../utils/flagLanguageParser';
import { Extractor } from './Extractor';

export class SeasonExtractor extends Extractor<ExtractedSeason | null> {
    public async extract(): Promise<ExtractedSeason | null> {
        const $ = await this.fetchHtmlRoot();

        const root = $('html');

        if (root.find('div.messageAlert.danger').length > 0) {
            return null;
        }

        const episodes: SeasonEpisode[] = $('table.seasonEpisodesList tbody tr')
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

                const languages: EpisodeLanguage[] = node
                    .find('td:nth-child(4) img')
                    .map((_, langEl) => $(langEl).attr('src') || null)
                    .map((_, src) => {
                        if (src === null) return null;
                        const { audio, subtitle } =
                            parseFlagSrcToLanguages(src);

                        if (
                            !isLanguage(audio) ||
                            (subtitle !== null && !isLanguage(subtitle))
                        ) {
                            return null;
                        }

                        return {
                            audio,
                            subtitle,
                        };
                    })
                    .get();

                const hosters: Hoster[] = node
                    .find('td:nth-child(3) i')
                    .map((_, hosterEl) =>
                        normalizeHoster($(hosterEl).attr('title') || '')
                    )
                    .get()
                    .filter((h) => h !== null && isHoster(h));

                return {
                    episodeNumber,
                    title,
                    originalTitle,
                    languages,
                    hosters,
                };
            })
            .get();

        return episodes;
    }
}
