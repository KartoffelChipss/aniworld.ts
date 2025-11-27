import { ExtractedEpisode, Media } from '../types/Episode';
import { isHoster, normalizeHoster } from '../types/Hoster';
import {
    EpisodeLanguage,
    isLanguage,
    KeyedEpisodeLanguage,
} from '../types/Language';
import { parseFlagSrcToLanguages } from '../utils/flagLanguageParser';
import { Extractor } from './Extractor';

export class EpisodeExtractor extends Extractor<ExtractedEpisode | null> {
    public async extract(): Promise<ExtractedEpisode | null> {
        const $ = await this.fetchHtmlRoot();

        const root = $('html');

        if (root.find('div.messageAlert.danger').length > 0) {
            return null;
        }

        const title = $('h2 .episodeGermanTitle').text()?.trim() || null;
        const englishTitle =
            $('h2 .episodeEnglishTitle').text()?.trim() || null;
        const episodeNumber = parseInt(
            $('div.hosterSiteDirectNav ul li.active').text().trim(),
            10
        );
        const description = $('p.descriptionSpoiler').text()?.trim() || null;

        const languages: KeyedEpisodeLanguage[] = $(
            'div.hosterSiteVideo div.changeLanguageBox img'
        )
            .map((_, langEl) => {
                const src = $(langEl).attr('src') || null;
                if (src === null) return null;

                const { audio, subtitle } = parseFlagSrcToLanguages(src);
                if (
                    !isLanguage(audio) ||
                    (subtitle !== null && !isLanguage(subtitle))
                ) {
                    return null;
                }

                const langkey = $(langEl).attr('data-lang-key') || null;
                if (langkey === null) return null;

                return {
                    key: langkey,
                    audio,
                    subtitle,
                };
            })
            .get();

        const media: Media[] = $('div.hosterSiteVideo ul.row li')
            .map((_, hosterEl) => {
                const node = $(hosterEl);
                const rawHoster = node.find('a h4').text().trim();
                const url = node.attr('data-link-target') || null;
                const languageKey = node.attr('data-lang-key') || null;

                if (
                    rawHoster === null ||
                    url === null ||
                    languageKey === null
                ) {
                    return null;
                }

                const normalizedHoster = normalizeHoster(rawHoster);
                if (normalizedHoster === null) return null;

                const lang = languages.find((l) => l.key === languageKey);
                if (lang === undefined) return null;

                return {
                    hoster: normalizedHoster,
                    url,
                    ...lang,
                };
            })
            .get()
            .filter((h) => h !== null && isHoster(h.hoster)) as Media[];

        return {
            title,
            englishTitle,
            episodeNumber,
            description,
            languages,
            media,
        };
    }
}
