# aniworld.ts

aniworld.ts is a TypeScript library for interacting with the Aniworld anime streaming platform or similarly structured services like s.to using web scraping.

## Installation

```
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
