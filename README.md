# Vyapar SaaS Electron

This project is an Electron based desktop application that bundles a React front-end built with Vite. It provides billing and inventory features similar to the Vyapar SaaS requirements.

## Development

1. Install Node.js (v18 or later recommended).
2. Run `npm install` in the project root to install both Electron and front-end dependencies.
3. Start the app in development mode:
   ```bash
   npm run dev
   ```
   This starts the Vite dev server for the React code and launches Electron pointing to it.

## Building

To create a distributable desktop package run:

```bash
npm run build
```

The build will output installers or executables for your platform inside the `dist` folder (configured via `electron-builder`).

## Running a Production Build

After running `npm run build`, execute the generated file from the `dist` directory. On Windows this is typically an `.exe` installer, on Linux an `AppImage`, and on macOS a `.dmg` or `.app`.
