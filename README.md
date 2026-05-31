# COVID-19 Tracker

A real-time global pandemic dashboard built with React, Vite, TanStack Query, and Recharts. Pulls live data from the [disease.sh](https://disease.sh) public API.

## Features

- **Global overview** — live totals for cases, deaths, recovered, and active cases with a donut chart
- **Country table** — all ~230 countries sorted by cases, with flags, today's numbers highlighted, and search/filter
- **Country detail page** — full stats per country including critical cases, tests, population, and a bar chart
- **Dark theme** — mission-control style with color-coded metrics

## Stack

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [TanStack Query](https://tanstack.com/query) for data fetching
- [Recharts](https://recharts.org) for charts
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) components
- [Wouter](https://github.com/molefrog/wouter) for routing
- [disease.sh](https://disease.sh) public API (no key required)

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Pages

| Route | Description |
|---|---|
| `/` | Global dashboard + country table |
| `/country/:name` | Detail view for a single country |

## Data Sources

- `GET https://disease.sh/v3/covid-19/all` — global totals
- `GET https://disease.sh/v3/covid-19/countries?sort=cases` — all countries
- `GET https://disease.sh/v3/covid-19/countries/:name` — single country
