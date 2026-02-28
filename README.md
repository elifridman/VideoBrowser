# VideoBrowser

Video browser application that allows users to browse and filter videos by title, artist, release year, and genre.

## Features

- Search videos by title or artist (debounced)
- Filter by release year and genre
- Dynamic filter options based on current search results
- Data loaded from configurable API (e.g. XiteTV dataset)

## Tech stack

- **React 19** + **TypeScript**
- **Vite** (dev & build)
- **Tailwind CSS**
- **TanStack Query** (data fetching)

## Prerequisites

- Node.js 18+

## Setup

1. Clone the repo and go to the project folder:
   ```bash
   cd video-browser
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure the API URL. By default the app uses the XiteTV dataset. To override, create `.env.local`:
   ```
   VITE_API_URL=https://your-api-url/dataset.json
   ```

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint               |

## Development

This project uses [Vite](https://vite.dev/) with [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react). For stricter ESLint rules (type-aware or React-specific), see the [Vite + React + TypeScript](https://vite.dev/guide/) and [ESLint](https://eslint.org/) docs.
