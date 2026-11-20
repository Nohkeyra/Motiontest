# Wawasan Remotion: GitHub Actions render test

This is a **technical smoke-test project**, not a recreation of the Wawasan app or the full 30-second promo.

- 6 seconds, 1080x1920, 30fps; coffee-and-cream brand palette; no real app screens.
- Designed for GitHub Actions (which can reach the npm registry), bypassing the current chat container's npm network restrictions.
- Install Remotion and `@remotion/cli` at the **same exact version** during workflow execution.
- No files from the current Wawasan app are replaced. This ZIP can be safely inspected before adding it to a repo.

## GitHub Actions

Copy both `videos/` and `.github/` folders into your repository while preserving their paths. Do not overwrite existing workflow or app files. Commit and push these new files. Then open **GitHub → Actions → Render Remotion smoke test → Run workflow**. After the job succeeds, download its `wawasan-remotion-smoke-test` artifact containing the MP4.

The workflow is manually triggered (`workflow_dispatch`) and won't automatically render on every push.

## Local desktop installation (internet required)

In `videos/remotion-smoke-test`:

```bash
VERSION="$(npm view remotion version)"
npm install --save-exact "remotion@$VERSION" "@remotion/cli@$VERSION" react@19 react-dom@19
npx remotion browser ensure
npm run render
```

If a compatible Chromium browser exists, you can instead pass `--browser-executable=/usr/bin/chromium` to the `remotion render` CLI command (see Remotion docs), but defaulting to Remotion's managed browser is preferred.

## Verification caveat

Source files and workflow were prepared and structurally checked offline. Rendering could not be executed in the current chat container because npm registry DNS resolution failed. An MP4 is only confirmed after the GitHub Actions render completes.
