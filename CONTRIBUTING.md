# Contributing

Use Node.js 22 and `npm ci`. Create a feature branch from `main` and keep changes focused.

Before opening a pull request:

```sh
npm run format
npm run check
npx playwright install chromium
npm run test:e2e
```

Include the behavior changed, relevant checks and screenshots for visual changes. Check desktop, narrow mobile, reduced motion, keyboard focus and WebGL fallback.

Keep specifications in `src/configuration/catalog.ts`; add search/specification presentation in `src/showroom/`. The scene receives configuration through props. Do not import showroom components into scene modules or rendering code into configuration modules; ESLint enforces these boundaries. Keep overlay state mutually exclusive and retain the dialog’s original focus-return target when replacing its content.

Keep specifications in the typed preset data. Derive animation from stable reference targets and use bounded delta-aware calculations. Keep per-frame state out of React, reuse repeated geometry and clean up owned resources. Application and test TypeScript must stay strict, without `any` or suppressed errors. Order files as imports, interfaces/types, then constants and implementation. Use shared design tokens and named component prop interfaces.

Do not add remote models, tracking, credentials or copyrighted reference media. Update documentation when controls or deployment behavior change. Original contributions are provided under the repository's MIT license; retain third-party notices.
