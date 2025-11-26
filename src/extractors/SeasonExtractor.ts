import { Episode, ExtractedSeason } from '../types/Season';
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

                return {
                    episodeNumber,
                    title,
                    originalTitle,
                };
            })
            .get();

        return episodes;
    }
}
