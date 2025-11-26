export class SeasonNotFoundException extends Error {
    public readonly title: string;
    public readonly season: number;

    constructor(
        title: string,
        season: number,
        message: string = "Could not find any season with given number on the series.",
        innerException?: Error
    ) {
        super(message);
        this.title = title;
        this.season = season;
        this.name = 'SeasonNotFoundException';
    }
}