aniworld.ts is a TypeScript library for interacting with the Aniworld anime streaming platform or similarly structured services like s.to using web scraping.

## Installation

```bash
npm i aniworld.ts
```

## Usage

### Create a client

```ts
import { AniworldClient } from 'aniworld.ts';

const aniworld = new AniworldClient({
    hostUrl: 'https://aniworld.to',
    site: 'anime',
});
```

You can pass an object of options into the client constructor:

| Option        | Description                                                                             | Examples                                 | Default                                                                                                               |
| ------------- | --------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `hostUrl`     | The base url of the target service                                                      | `https://aniworld.to/`, `https://s.to`   | `https://aniworld.to/`                                                                                                |
| `site`        | The site type to use                                                                    | `anime` for Aniworld or `serie` for s.to | `anime`                                                                                                               |
| `userAgent`   | The user agent to use when making network requests                                      | `MyApp/1.0`                              | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36` |
| `debugLogger` | A logger for debugging                                                                  | `AniworldClient.getDefaultLogger()`      | _N/A_                                                                                                                 |
| `cache`       | A [node-cache](https://www.npmjs.com/package/node-cache) instance for caching responses | `new NodeCache({ stdTTL: 3600 })`        | _N/A_                                                                                                                 |

### Search for a series

```ts
const searchResults = await aniworld.search('hunter');
console.log(`Found ${searchResults.length} results!`);
console.log('Search results: ', searchResults);
```

### Get series information

```ts
const series = await aniworld.getSeries('naruto');
console.log(`Title: ${series.title}`);
console.log(`Description: ${series.description}`);
```

### Get episodes

```ts
// Get the first season (0 would be the movies, if there are any)
const season = await aniworld.getSeason('naruto', 1);
console.log(`Fetched season #${season.seasonNumber}`);
episodes.forEach((episode) => {
    console.log(`[${episode.number}] ${episode.title}`);
});

// If you want to get the movies, you can either use season number 0 or this dedicated method
const movies = await aniworld.getMovies('naruto');
console.log(`Fetched season #${season.seasonNumber}`);
episodes.forEach((movie) => {
    console.log(`[${movie.number}] ${movie.title}`);
});
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## License Notice

Portions of this project are based on code by **culajunge**  
from https://github.com/culajunge/SerienStreamAPI, used under the MIT License.

## Disclaimer

aniworld.ts is a library for interacting with publicly accessible content on streaming platforms for educational and personal use only. By using this library, you agree to comply with all applicable laws and the terms of service of the websites you access.

The author of this library is not responsible for any misuse, copyright infringement, or illegal activity resulting from its use. You should not use this library to bypass paywalls, access copyrighted content without permission, or violate any applicable laws.

This library provides technical functionality only. The content accessed through it is the responsibility of the website owner, and you use it at your own risk.
