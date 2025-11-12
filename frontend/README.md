# Katcheri Events Frontend

React + TypeScript frontend for the Katcheri Events e-commerce platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/store/` - Redux store and slices
- `src/lib/` - API client and utilities
- `src/hooks/` - Custom React hooks

## Styling

The project uses Tailwind CSS with a custom purple & white theme. Theme configuration is in `tailwind.config.js`.

## State Management

Redux Toolkit is used for state management with the following slices:
- `authSlice` - Authentication state
- `cartSlice` - Shopping cart state
- `eventsSlice` - Events data
- `newsSlice` - News posts data

