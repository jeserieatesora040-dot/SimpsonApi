# Springfield Lines ? Simpsons Quotes & Characters

Springfield Lines is a responsive, client-side React application for discovering Simpsons characters and the phrases listed in their API profiles. The app fetches character records and portraits from [The Simpsons API](https://thesimpsonsapi.com), then lets visitors search phrases, browse the character directory, filter quote collections, and save favorites in the browser.

> This is an unofficial educational project and is not affiliated with or endorsed by The Simpsons' rights holders.

The visual design takes inspiration from the provided reference: a cinematic dusk-toned hero, oversized editorial typography, warm gold accents, and layered category cards.

## Features

- Explore a featured character phrase and choose another spotlight phrase at random.
- Search the loaded phrase collection by phrase text or character name.
- Filter phrases by **All phrases**, **Simpson family**, **School life**, **Work & town**, or **Saved lines**.
- Browse the paginated character directory and open profiles with API-provided biography, occupation, status, portrait, and phrases.
- Save or remove favorite phrases, search saved items, and clear the collection. Favorites persist in browser LocalStorage.
- Use client-side routes for Quotes, Characters, Character Details, and Saved Phrases.
- Responsive desktop and mobile layouts, accessible controls, pagination, missing-image fallbacks, and loading, empty, and error states.

## Technology

- React 19 and JavaScript ES modules
- React Router DOM
- Vite
- Fetch API with `async`/`await` and `AbortController`
- The Simpsons API (`https://thesimpsonsapi.com/api`)
- Lucide React
- Browser LocalStorage for saved phrases

## Getting started

### Requirements

- Node.js 20.19+ or 22.12+
- npm
- Internet access for the API and character portraits

### Install and run

```bash
npm install
npm run dev
```

Vite prints the local development URL after the server starts.

### Production build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Project structure

```text
src/
??? components/       # Navigation, quote and character cards, search, pagination, and UI states
??? context/          # Saved phrase state, context, and LocalStorage persistence
??? pages/            # Quote home, character directory, character details, and favorites
??? services/         # Simpsons API requests and response normalization
??? App.jsx           # Client-side routes and shared application shell
??? App.css           # Application layout and responsive styles
??? index.css         # Global styles and design tokens
??? main.jsx          # React entry point
```

## The Simpsons API

The app uses the public API without authentication. Its base URL is:

[`https://thesimpsonsapi.com/api`](https://thesimpsonsapi.com/api)

Endpoints used by this project:

- [`https://thesimpsonsapi.com/api/characters?page=1`](https://thesimpsonsapi.com/api/characters?page=1) ? first page of characters and pagination metadata.
- [`https://thesimpsonsapi.com/api/characters?page=2`](https://thesimpsonsapi.com/api/characters?page=2) ? an example of requesting another character page.
- [`https://thesimpsonsapi.com/api/characters/1`](https://thesimpsonsapi.com/api/characters/1) ? details and available phrases for character ID `1`.
- [`https://cdn.thesimpsonsapi.com/500/character/1.webp`](https://cdn.thesimpsonsapi.com/500/character/1.webp) ? example portrait URL using the API's image CDN.

The API returns character records in pages of 20. The app loads the first page to build the home phrase collection and requests other pages as users browse the character directory. The character search and quote categories are filtered in the browser; they are not server-side API filters. The current API integration does not request episode or film records.

### Quote and category data

The API provides a `phrases` array on character records rather than a separate quote resource with episode or scene attribution. The app shows those values as **character phrases** and does not infer episode names, dates, or scenes.

Home-page filters are based on fields returned for the first page of characters:

- **Simpson family** matches character names containing ?Simpson.?
- **School life** checks the character's occupation for school-related roles.
- **Work & town** includes characters with a listed occupation that does not match the school-role check.
- **Saved lines** shows phrases bookmarked in this browser.

These are client-side groupings, not categories supplied by the API. A phrase may appear in multiple categories. The API's character count, phrase counts, and available profile information can change over time.

### Environment variables

No `.env` file or API key is required. The API is public, and its base URL is configured in `src/services/simpsonsApi.js`. Do not add a private API key to this client-side application; any `VITE_` variable is included in browser code and is visible to users.

## Team member contributions

- **Dominay** ? Researched and selected the public Simpsons API and contributed to API integration and data handling.
- **Roland** ? Designed the application pages and built the saved-phrases feature.
- **Shared work** ? Responsive design, documentation, testing, and GitHub collaboration.

## GitHub collaboration workflow

For a pair project, keep `main` as the stable branch and work on separate feature branches. Do not push project work directly to `main`.

1. Create a focused branch, such as `feature/quote-search` or `feature/character-directory`.
2. Commit with descriptive conventional prefixes such as `feat: add quote categories` or `fix: handle missing portraits`.
3. Push your branch and open a pull request targeting `main`.
4. Ask your partner to review it, address feedback, then merge through GitHub.
5. Pull the updated `main` before starting the next feature branch.

The public repository is [jeserieatesora040-dot/SimpsonApi](https://github.com/jeserieatesora040-dot/SimpsonApi).

## Data and attribution

Character information and phrases are fetched at runtime from [The Simpsons API](https://thesimpsonsapi.com); portraits use the image URLs supplied by the API. The service or image CDN may occasionally be unavailable, and some records may omit profile details or portraits. Saved phrases remain in this browser and are not synchronized between devices. The Simpsons and related characters, names, and artwork belong to their respective rights holders.

## Async data flow

- `src/services/simpsonsApi.js` fetches character pages and individual profiles, validates the responses, and maps each character's `phrases` array to quote cards.
- The home page requests the first character page, then searches and filters its phrase collection on the client.
- The character directory requests the selected API page and cancels outdated requests when the page changes.
- The character details page requests the selected character by ID and presents loading, retryable error, and empty-phrase states.
- Saved phrases are managed by the React context in `src/context/` and persisted in LocalStorage.

## Client-side routing

React Router is configured in `src/App.jsx`:

- `/` ? quote spotlight, phrase search, category filters, and saved-phrase controls
- `/characters` ? paginated character directory and page-level search
- `/characters/:id` ? API-backed character details and phrases
- `/favorites` ? saved phrases
