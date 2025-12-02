export interface HomeMedia {
    slug: string;
    title: string;
    coverImage: string | null;
    genre: string | null;
}

export interface HomeData {
    popularHere: HomeMedia[];
    newMedia: HomeMedia[];
    popular: HomeMedia[];
}
