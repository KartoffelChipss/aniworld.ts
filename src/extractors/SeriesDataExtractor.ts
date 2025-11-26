import { ExtractedSeries, Series } from '../types/Series';
import { Extractor } from './Extractor';

export class SeriesDataExtractor extends Extractor<ExtractedSeries | null> {
    public async extract(): Promise<ExtractedSeries | null> {
        const $ = await this.fetchHtmlRoot();

        const root = $('html');

        if (root.find('div.messageAlert.danger').length > 0) {
            return null;
        }

        const endYearText = root
            .find("span[itemprop='endDate'] a")
            .text()
            .trim();
        const endYear = endYearText ? parseInt(endYearText, 10) : null;

        const hasMovies =
            root.find('div#stream ul:first li:nth-child(2) a').text() ===
            'Filme';

        return {
            title: root.find('div.series-title h1').text().trim(),
            description:
                root.find('p.seri_des').attr('data-full-description') || null,
            bannerUrl: `${this.getHostUrl()}/${(root.find('div.seriesCoverBox img').attr('data-src') || '').trim()}`,
            startYear: parseInt(
                root.find("span[itemprop='startDate'] a").text().trim(),
                10
            ),
            endYear:
                endYearText.toLocaleLowerCase() === 'heute' ? null : endYear,
            directors: root
                .find("li[itemprop='director'] span[itemprop='name']")
                .map((_, el) => $(el).text().trim())
                .get(),
            actors: root
                .find("li[itemprop='actor'] span[itemprop='name']")
                .map((_, el) => $(el).text().trim())
                .get(),
            creators: root
                .find("li[itemprop='creator'] span[itemprop='name']")
                .map((_, el) => $(el).text().trim())
                .get(),
            countriesOfOrigin: root
                .find("li[itemprop='countryOfOrigin'] span[itemprop='name']")
                .map((_, el) => $(el).text().trim())
                .get(),
            genres: root
                .find("div.genres li a[itemprop='genre']")
                .map((_, el) => $(el).text().trim())
                .get(),
            ageRating: parseInt(
                root.find("div[class*='fsk']").attr('data-fsk') || '0',
                10
            ).toString(),
            imdbUrl: root.find('a.imdb-link').attr('href') || null,
            trailerUrl:
                root
                    .find("div[itemprop='trailer'] a[itemprop='url']")
                    .attr('href') || null,
            hasMovies,
            seasonsCount:
                parseInt(
                    root
                        .find("meta[itemprop='numberOfSeasons']")
                        .attr('content') || '0',
                    10
                ) - (hasMovies ? 1 : 0),
        };
    }
}
