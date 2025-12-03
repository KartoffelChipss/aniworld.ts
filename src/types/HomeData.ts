export interface HomeMedia {
    slug: string;
    title: string;
    /** @deprecated Use `cover` instead */
    coverImage: string | null;
    cover: string | null;
    genre: string | null;
}

export interface HomeData {
    popularHere: HomeMedia[];
    newMedia: HomeMedia[];
    popular: HomeMedia[];
}
