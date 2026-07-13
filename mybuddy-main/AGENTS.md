# MyBuddy project guidance

- Treat this directory as the canonical local project: `C:\Users\nompe\Downloads\mybuddy-main\mybuddy-main`.
- This is a Vite + React application managed with pnpm.
- Preserve the GitHub Pages base path in `vite.config.js` as `/mybuddy/`.
- The target repository is `nompeawex-maker/mybuddy` on branch `main`.
- The public site URL is `https://nompeawex-maker.github.io/mybuddy/`.
- The deployment workflow is `.github/workflows/static.yml`.
- Before publishing changes, run `pnpm build` and `pnpm lint`.
- Do not commit or upload `node_modules`, local credentials, or temporary files.
