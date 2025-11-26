export class MovieNotFoundException extends Error {
    public readonly title: string;
    public readonly movie: number;

    constructor(
        title: string,
        movie: number,
        message: string = "Could not find any movie with given number on the series.",
        innerException?: Error
    ) {
        super(message);
        this.title = title;
        this.movie = movie;
        this.name = 'MovieNotFoundException';
    }
}