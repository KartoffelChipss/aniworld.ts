import { HomeMedia, HomeData } from '../types/HomeData';
import { Extractor } from './Extractor';
import * as cheerio from 'cheerio';

const popularHereTitles: Record<string, string> = {
    'https://s.to': 'Beliebt bei S.to',
    'https://aniworld.to': 'Beliebt bei AniWorld',
};

const newMediaTitles: Record<string, string> = {
    'https://s.to': 'Neue Fernsehserien',
    'https://aniworld.to': 'Neue Animes',
};

const popularTitles: Record<string, string> = {
    'https://s.to': 'Derzeit beliebt',
    'https://aniworld.to': 'Derzeit beliebt',
};

export class HomeDataExtractor extends Extractor<HomeData | null> {
    public async extract(): Promise<HomeData | null> {
        const $ = await this.fetchHtmlRoot();

        const root = $('html');

        if (root.find('div.messageAlert.danger').length > 0) return null;

        const popularHere =
            this.extractCarouselByTitle(
                root,
                popularHereTitles[this.getHostUrl()] || '',
                $
            ) || [];

        const newMedia =
            this.extractCarouselByTitle(
                root,
                newMediaTitles[this.getHostUrl()] || '',
                $
            ) || [];

        const popular =
            this.extractCarouselByTitle(
                root,
                popularTitles[this.getHostUrl()] || '',
                $
            ) || [];

        return {
            popularHere,
            newMedia,
            popular,
        };
    }

    private extractCarouselByTitle(
        root: cheerio.Cheerio<any>,
        titleText: string,
        $: cheerio.CheerioAPI
    ): HomeMedia[] | null {
        const heading = root
            .find('h2')
            .filter((_, el) => $(el).text().trim() === titleText)
            .first();
        if (!heading.length) return null;

        const carousel = heading.closest('.carousel');
        if (!carousel.length) return null;

        const items: HomeMedia[] = [];

        carousel.find('.coverListItem a').each((_, a) => {
            const listA = $(a);

            const href = listA.attr('href') || '';
            const title = (
                listA.find('h3').text() ||
                listA.attr('title') ||
                ''
            ).trim();

            const imgElement = listA.find('img').first();
            const imgSrc =
                imgElement.attr('data-src') || imgElement.attr('src') || null;
            const fullImgSrc = new URL(
                imgSrc || '',
                this.getHostUrl()
            ).toString();

            const genre = listA.find('small').first().text().trim() || null;
            const slug = href.split('/').filter(Boolean).pop() || '';

            items.push({ slug, title, coverImage: fullImgSrc, genre });
        });

        return items;
    }
}
