# VideoBrowser

Video browser application that allows users to browse and filter videos by title, artist, release year, and genre.

---

## 1. Installing Dependencies

**Prerequisites:** Node.js 18+

1. Clone the repository and go to the project folder:
   ```bash
   cd video-browser
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add the API URL in `.env.local` in the project root (required for the app to load video data). Create the file if it doesn't exist:
   ```
   VITE_API_URL=https://your-api-url/dataset.json
   ```
   If you use the XiteTV dataset, you can use their default URL; otherwise replace with your own API endpoint.

---

## 2. Running the Application

| Command | Description |
|--------|-------------|
| `npm run dev` | Start the development server (e.g. http://localhost:5173) |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Serve and preview the production build locally |
| `npm run lint` | Run ESLint |

**Quick start:** After `npm install`, run `npm run dev` and open the URL shown in the terminal.

---

## 3. Component Architecture

The app is structured around a single main view with shared state and reusable UI:

- **`App.tsx`** – Root component. Holds search/filter state (`search`, `selectedYear`, `selectedGenreIds`, `displayLimit`), wires data hooks to the UI, and decides what to render (loading, error, empty, or video list).

- **`Header`** – Search input (debounced), year and genre filters. Filter options are derived from the current dataset so only relevant years/genres are shown.

- **`VideoList`** – Renders a grid of `VideoCard` components and a "Load more" button when there are more results.

- **`VideoCard`** – Displays a single video (thumbnail, title, artist, year, genres).

- **`Loading`** / **`Error`** / **`Empty`** – Presentational components for loading, error (with retry), and empty-result states.

**Data & logic:**

- **Hooks:** `useFetchVideosData` (TanStack Query) fetches the video dataset; `useFilteredVideos` applies search and filters and exposes `dynamicYears` / `dynamicGenres` for the Header. `useDebounce` is used for the search input.

- **Types:** Shared types (e.g. `Video`, genre/year structures) live in `src/types/index.ts`.

- **UI primitives:** Reusable components under `src/components/ui/` (e.g. Button, Input, Select, Badge) are used for a consistent look and accessibility.

---

## 4. Unit Testing

The project uses **Vitest** and **React Testing Library**. Test setup is in `src/test/setup.ts` (jest-dom matchers and an `IntersectionObserver` mock for jsdom).

### How to run tests

| Command | Description |
|--------|-------------|
| `npx vitest run` | Run all test files once |
| `npx vitest` | Run tests in watch mode (re-runs on file changes) |
| `npx vitest run src/App.test.tsx` | Run a single test file |

To use `npm test`, add this to `package.json` scripts: `"test": "vitest"`. Then:

```bash
npm test             # watch mode
npm test -- --run    # run once
```

### What each test file covers

| File | What is tested |
|------|----------------|
| **`src/App.test.tsx`** | Renders Header with title; shows Loading when `isLoading`; shows ErrorState with "Try Again" when there is an error; shows Empty when filtered list is empty; shows VideoList with video titles/artists when data is loaded. Hooks `useFetchVideosData` and `useFilteredVideos` are mocked. |
| **`src/components/Empty/Empty.test.tsx`** | Renders the default message "No videos found" when no `message` prop is provided. |
| **`src/components/Error/Error.test.tsx`** | Calls the `retry` callback when the "Try Again" button is clicked. |
| **`src/components/Header/Header.test.tsx`** | Typing in search calls `setSearchTerm`; selecting a year calls `setSelectedYear`; selecting "All Years" calls `setSelectedYear(null)`; genre trigger shows "Genre" when none selected and "N Selected" when genres are selected. |
| **`src/components/Loading/Loading.test.tsx`** | Renders the default message "Loading videos..." when no `message` prop is provided. |
| **`src/components/VideoCard/VideoCard.test.tsx`** | Renders title, artist, and release year; image has correct `src` (local `/poster.svg`) and `alt` from title. |
| **`src/components/VideoList/VideoList.test.tsx`** | Renders all videos (titles/artists); when `IntersectionObserver` fires with the sentinel visible and `hasMore` true, `onLoadMore` is called. |
| **`src/hooks/useFilteredVideos.test.ts`** | Returns empty arrays when `data` is undefined; normalizes raw API videos to client shape; filters by search (title and artist); filters by `selectedYear` and `selectedGenreIds`; applies year + genre together (AND); `dynamicYears` unique and sorted descending; `dynamicGenres` with names from data, sorted by name; effect clears `selectedYear` when not in `dynamicYears`; effect clears invalid genre ids from `selectedGenreIds`. `useDebounce` is mocked to return the value immediately. |

---

## 5. Technical Architecture & Decisions

### 1. Data Management Layer

- **TanStack Query (React Query)**  
  Implemented as the "Server State" manager. It handles caching, loading/error states, and prevents unnecessary network requests through `staleTime` configurations.

- **Custom Fetching Hook (`useFetchVideosData`)**  
  Abstracts the API logic away from the UI. This promotes reusability and keeps `App.tsx` clean.

- **State strategy**
  - **Prop drilling:** Data is passed from `App.tsx` down two levels. Context API was intentionally avoided to keep the architecture lean and performant at this scale.
  - **Direct access:** Components can also consume the fetching hook directly if global access is needed, leveraging the TanStack cache.

### 2. Business Logic Layer (`useFilteredVideos`)

- All complex logic is encapsulated in a dedicated custom hook to keep the main entry point linear and readable.

- **Separation of concerns:** Filtering logic is decoupled from the UI components.

- **Computational efficiency**
  - **`useMemo`:** Applied to heavy filtering/mapping operations to avoid expensive re-calculations on every render and to prevent infinite re-render loops from referential changes.
  - **Search debouncing:** Reduces UI flickering and CPU load by waiting for the user to stop typing before executing the filter.

- **Filtering pipeline**
  1. **Normalization:** Maps remote API data to a consistent client-side data structure.
  2. **Base search:** Filters the raw data based on the debounced search input.
  3. **Dynamic metadata:** Generates "Available Years" and "Available Genres" from the currently searched results.
  4. **Final intersection:** Filters by Year, Genre, and Text to produce the final viewable list.

- **Auto-reset logic:** Invalid filters (e.g. a year that no longer exists for the current search) are automatically reset to keep the UI state valid.

### 3. View & Component Structure

The UI uses a **modular component architecture** with a focus on accessibility and responsiveness.

| Component   | Role |
|------------|------|
| **`App.tsx`** | Orchestrator; holds the high-level layout. |
| **Header**   | Brand title and filtering navigation bar. |
| **VideoList** | Smart container: grid layout and infinite scroll. |
| **VideoCard** | Presentational component for a single movie. |

**States:** Distinct views for **Loading**, **Error**, and **Empty Results** (no data after filtering).

### 4. Technical Stack

| Category        | Technology        | Reasoning |
|----------------|-------------------|-----------|
| Styling        | Tailwind CSS      | Rapid UI development and utility-first responsive design. |
| UI components  | Shadcn UI         | High-quality, accessible (Radix-based) components that are fully customizable. |
| Networking     | Interceptor pattern | Manages initial load (12 items) and subsequent "Load More" via infinite scroll. |
| Testing        | Vitest / RTL      | Unit tests and component mocks for logic stability. |

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (dev & build)
- **Tailwind CSS**
- **TanStack Query** (data fetching)
