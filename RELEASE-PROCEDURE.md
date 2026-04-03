# Release Procedure

Step-by-step checklist for contributing to and releasing quikchat.

## Branch Model

- `main` is the production branch. Only the repo maintainer (@deftio) merges to `main`.
- All work happens on feature branches created from `main`.
- Feature branches use the naming convention: `feature/<short-description>` or `fix/<short-description>`.

## Development Workflow

### 1. Create Feature Branch and Bump Version

```bash
npm run feature <short-description>            # patch bump (default)
npm run feature <short-description> minor       # minor bump
npm run feature <short-description> major       # major bump
```

This creates a `feature/<short-description>` branch, bumps the version in `src/quikchat.js` and `package.json`, and commits the bump.

### 2. Implement and Test Locally

- [ ] Write failing tests first that describe the expected behavior.
- [ ] Implement the feature or fix.
- [ ] Run full local QA until everything passes:
  - `npm run lint` — 0 errors and 0 warnings.
  - `npm test` — all tests passing, no skips, coverage not decreased.
  - `npm run build` — succeeds, review the size report output.

Local testing should be more comprehensive than CI. CI is the gate, not the only test environment.

### 3. Open Pull Request

- [ ] Push feature branch: `git push -u origin feature/<short-description>`
- [ ] Open PR targeting `main` on GitHub.
- [ ] PR title is concise (under 70 chars). Description explains the "why".
- [ ] Reference the related issue (e.g., "Closes #42").
- [ ] CI must pass (lint, test, build on Node 20).

### 4. Code Review

- [ ] Maintainer reviews the PR.
- [ ] Address any review feedback with new commits (do not force-push).
- [ ] CI passes on the final state of the PR.

### 5. Merge to Main

Only the repo maintainer (@deftio) performs this step.

- [ ] Squash-merge the PR into `main`.
- [ ] Delete the feature branch after merge.

## Automated Release Pipeline

After a squash-merge to `main`, everything else is automatic:

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

### Post-Release Verification

- [ ] Verify the GitHub Release appears at https://github.com/deftio/quikchat/releases
- [ ] Verify npm has the new version: `npm view quikchat version`
- [ ] Verify CDN availability: https://cdn.jsdelivr.net/npm/quikchat@latest/dist/quikchat.umd.min.js

## Manual Recovery

If the automated publish fails:

1. Re-run the failed publish workflow from the **Actions** tab.

If a tag was created but the release/publish failed:

```bash
# Delete the orphaned tag
git push origin --delete vX.Y.Z
git tag -d vX.Y.Z

# Fix the issue, push to main, and let CI re-tag
```

## Rules

- No direct commits to `main` except by the maintainer.
- No `--force` pushes to `main`.
- No `--no-verify` to skip hooks.
- No skipped tests (`it.skip`, `describe.skip`, `xit`).
- All lint warnings must be resolved, not suppressed.
- Secrets and credentials are never committed.
- quikchat must have zero runtime dependencies.
