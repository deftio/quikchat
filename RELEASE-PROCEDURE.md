# Release Procedure

Step-by-step checklist for contributing to and releasing quikchat.

## TL;DR

```bash
# Start a feature
npm run feature my-feature-name        # creates branch, bumps patch version

# Do your work, then release
npm run release                        # preflight, merge to main, push — CI does the rest
```

## Branch Model

- `main` is the production branch. Only the repo maintainer (@deftio) merges to `main`.
- All work happens on feature branches created from `main`.
- Feature branches use the naming convention: `feature/<short-description>`.

## Development Workflow

### 1. Start a Feature

```bash
npm run feature <short-description>            # patch bump (default)
npm run feature <short-description> minor       # minor bump
npm run feature <short-description> major       # major bump
```

This script will:
1. Verify you're on `main` with a clean working tree.
2. **Pull latest `main` from origin** (prevents starting from a stale local copy).
3. Verify local main matches origin/main (warns if they differ).
4. Create `feature/<short-description>` branch.
5. Bump version in `src/quikchat.js` and `package.json`.
6. Commit the version bump.

### 2. Implement and Test Locally

- [ ] Write failing tests first that describe the expected behavior.
- [ ] Implement the feature or fix.
- [ ] Run full local QA until everything passes:
  - `npm run lint` — 0 errors and 0 warnings.
  - `npm test` — all tests passing, no skips, coverage not decreased.
  - `npm run build` — succeeds, review the size report output.
- [ ] `npm run dev` — check the docs site and examples in the browser.

Local testing should be more comprehensive than CI. CI is the gate, not the only test environment.

### 3. Release

From your feature branch:

```bash
npm run release
```

This script will:
1. Verify you're on a feature branch (not main) with a clean working tree.
2. Check that the version was bumped (compares against published npm version).
3. Run lint, tests, and build — **fails fast if anything is wrong**.
4. Show a summary (branch, version, commit count) and ask for confirmation.
5. Switch to main, pull latest, squash-merge the feature branch.
6. Push main to origin.

After the push, everything else is automatic (see below).

If the push fails (e.g., local main diverged from origin), the script tells you. In that case, if you're the sole maintainer and confident the local state is correct:

```bash
git push origin main --force
```

### 4. Automated Pipeline

After push to `main`, CI handles everything:

```
push to main
  |
  v
ci.yml: lint + test + build (Node 20)
  |
  v (all pass)
ci.yml: tag-version job reads version from package.json
         creates git tag vX.Y.Z (if tag is new)
  |
  v (tag push triggers)
publish.yml: build + npm publish (with provenance)
publish.yml: create GitHub Release with dist assets
```

- **Auto-tag**: CI reads the version from `package.json` after a successful build on `main`. If the tag doesn't exist yet, it creates and pushes `vX.Y.Z`.
- **GitHub Release**: Created automatically with generated release notes and dist assets (UMD min, ESM min, CSS min).
- **npm Publish**: Published via `NPM_TOKEN` secret with `--provenance`.

### 5. Verify

- [ ] CI passed: https://github.com/deftio/quikchat/actions
- [ ] GitHub Release: https://github.com/deftio/quikchat/releases
- [ ] npm: `npm view quikchat version`
- [ ] CDN: https://cdn.jsdelivr.net/npm/quikchat@latest/dist/quikchat.umd.min.js

## Alternative: Open a Pull Request

For contributions from others or when you want a review step:

1. Push feature branch: `git push -u origin feature/<short-description>`
2. Open PR targeting `main` on GitHub.
3. CI runs on the PR.
4. Squash-merge after review.
5. CI auto-tags and publishes (same as above).

## Manual Recovery

If the automated publish fails:

1. Re-run the failed workflow from the **Actions** tab.

If a tag was created but the release/publish failed:

```bash
# Delete the orphaned tag
git push origin --delete vX.Y.Z
git tag -d vX.Y.Z

# Fix the issue, push to main, and let CI re-tag
```

## npm Scripts Reference

| Script | What it does |
|--------|-------------|
| `npm run feature <name> [patch\|minor\|major]` | Create feature branch, pull latest main, bump version |
| `npm run release` | Preflight (lint/test/build), squash-merge to main, push |
| `npm run dev` | Local dev server on port 6809 |
| `npm run lint` | ESLint on src/ |
| `npm test` | Jest with coverage |
| `npm run build` | Lint + build all bundles + size report |

## Rules

- No direct commits to `main` except by the maintainer.
- No `--force` pushes to `main` (except when resetting from a known-good state).
- No `--no-verify` to skip hooks.
- No skipped tests (`it.skip`, `describe.skip`, `xit`).
- All lint warnings must be resolved, not suppressed.
- Secrets and credentials are never committed.
- quikchat must have zero runtime dependencies.
