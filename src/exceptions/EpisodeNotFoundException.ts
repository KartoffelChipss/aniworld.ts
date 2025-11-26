export class EpisodeNotFoundException extends Error {
    public readonly title: string;
    public readonly season: number;
    public readonly episode: number;

    constructor(
        title: string,
        season: number,
        episode: number,
        message: string = "Could not find any episode with given number of the season on the series.",
        innerException?: Error
    ) {
        super(message);
        this.title = title;
        this.season = season;
        this.episode = episode;
        this.name = 'EpisodeNotFoundException';
    }
}