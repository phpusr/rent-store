# RentStore

RentStore tracks monthly utility readings and costs by flat. It uses Angular 22, Angular Material, RxJS, and SCSS. Electron 44 loads the built Angular app for desktop use.

## Development commands

Run these from the repository root:

- `npm ci` installs dependencies from `package-lock.json`.
- `npm start` serves the app at `http://localhost:4200/` with live reload and the `ru` development locale.
- `npm run build` builds the production app into `dist/rent-store/browser`.
- `npm test -- --watch=false --browsers=ChromeHeadless` runs the Jasmine/Karma suite once. Set `CHROME_BIN` to the Chromium executable if Chrome is unavailable.
- `npm run i18n` refreshes `src/locale/messages.xlf`. Update `src/locale/messages.ru.xlf` when adding or changing translated strings. Templates use Angular `i18n` markers, and TypeScript uses `$localize`.

`make build` sets a relative base URL during compilation and copies the files from `electron-src/` into `dist/rent-store`. Electron opens `browser/index.html` there. `make mk_package` pushes to Git and installs an Arch Linux package, so use the Angular build for routine verification.

## Code map

- `src/main.ts` bootstraps the standalone app, and `src/app/app.routes.ts` defines its routes. Routed features live in `src/app/pages/`, and shared layout and flat selection live in `src/app/components/layout/`.
- Standalone components import their own Angular Material dependencies. Shared styles and Material theming live in `src/styles.scss` and `src/theme.scss`.
- `src/app/interfaces/general.ts` defines the flat, calculation, and export state shapes. `DataStorageService` owns reactive state and writes through `LocalStorageService` to browser `localStorage`. Calculations are keyed by flat ID, year, and month, with months numbered 1 through 12.
- When changing persisted fields, check compatibility with existing `localStorage` data, JSON import in `src/app/pages/import-data/`, and JSON export in `src/app/components/layout/`. `scripts/export_from_gsheets.mjs` is a separate Google Sheets utility that also produces importable data.

Follow `.editorconfig` and the conventions of adjacent files. Application TypeScript generally uses two-space indentation, single quotes, and no trailing semicolons. Jasmine specs live beside their components and services.

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
