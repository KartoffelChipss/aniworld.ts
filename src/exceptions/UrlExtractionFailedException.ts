export class UrlExtractionFailedException extends Error {
    public readonly sourceUrl: string;

    constructor(
        sourceUrl: string,
        message: string = "Failed to extract url from source.",
        innerException?: Error
    ) {
        super(message);
        this.sourceUrl = sourceUrl;
        this.name = 'UrlExtractionFailedException';
    }
}
