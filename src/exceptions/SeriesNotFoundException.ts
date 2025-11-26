export class SeriesNotFoundException extends Error {
    public readonly title: string;

    constructor(
        title: string,
        message: string = 'Could not find any series with given title.',
        innerException?: Error
    ) {
        super(message);
        this.title = title;
        this.name = 'SeriesNotFoundException';
    }
}
