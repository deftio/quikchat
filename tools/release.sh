#!/usr/bin/env bash
#
# release.sh — preflight checks, merge feature branch to main, push.
# CI handles tagging and publishing automatically after push.
#
# Usage:
#   npm run release
#
# Run this from your feature branch when you're ready to ship.
#
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

die()  { echo -e "${RED}ERROR: $*${NC}" >&2; exit 1; }
info() { echo -e "${GREEN}$*${NC}"; }
warn() { echo -e "${YELLOW}$*${NC}"; }

# --- preflight ---------------------------------------------------------------

BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Must NOT be on main (you release FROM a feature branch)
[ "$BRANCH" != "main" ] || die "Must be on a feature branch, not main.\n  The release script merges your feature branch into main."

# Clean working tree
if ! git diff --quiet || ! git diff --cached --quiet; then
  die "Working tree is dirty. Commit or stash changes first."
fi

# --- read version ------------------------------------------------------------

VERSION=$(node -p "require('./package.json').version")
[ -n "$VERSION" ] || die "Could not read version from package.json"
TAG="v${VERSION}"

info "Branch:  $BRANCH"
info "Version: $VERSION"
info "Tag:     $TAG"
echo ""

# --- check version is new ----------------------------------------------------

info "=== Checking version ==="
node tools/checkVersion.cjs || die "Version check failed. Bump the version before releasing."
echo ""

# --- run quality gates -------------------------------------------------------

info "=== Running lint ==="
npm run lint || die "Lint failed. Fix errors before releasing."
echo ""

info "=== Running tests ==="
npm test || die "Tests failed. Fix failures before releasing."
echo ""

info "=== Running build ==="
npm run build || die "Build failed. Fix errors before releasing."
echo ""

# Clean up build-manifest.json if dirtied by preflight build
if ! git diff --quiet -- dist/build-manifest.json; then
  git checkout -- dist/build-manifest.json
fi

# --- show summary ------------------------------------------------------------

COMMIT_COUNT=$(git rev-list --count main..HEAD 2>/dev/null || echo "?")
info "=== Preflight passed ==="
info "  Branch:  $BRANCH"
info "  Version: $VERSION ($TAG)"
info "  Commits: $COMMIT_COUNT since main"
echo ""

warn "This will:"
warn "  1. Switch to main"
warn "  2. Pull latest from origin"
warn "  3. Squash-merge $BRANCH into main"
warn "  4. Push main to origin"
warn "  5. CI will auto-tag $TAG and publish to npm"
echo ""

read -r -p "Proceed? [y/N] " CONFIRM
[[ "$CONFIRM" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }

# --- merge to main -----------------------------------------------------------

info "\nSwitching to main..."
git checkout main

info "Pulling latest main from origin..."
git pull origin main || warn "Pull failed — continuing with local main (may need force push)"

info "Squash-merging $BRANCH into main..."
git merge "$BRANCH" --squash || die "Merge failed. Resolve conflicts and try again."

git commit -m "release ${TAG}

Squash-merged from ${BRANCH}.
See feature branch for individual commits."

# --- push --------------------------------------------------------------------

info "\nPushing main to origin..."
if git push origin main; then
  info "\n=== Release $TAG pushed ==="
  info "CI will now:"
  info "  1. Run lint + test + build"
  info "  2. Create tag $TAG"
  info "  3. Publish to npm"
  info "  4. Create GitHub Release"
  echo ""
  info "Verify at:"
  echo "  https://github.com/deftio/quikchat/actions"
  echo "  https://github.com/deftio/quikchat/releases"
  echo "  npm view quikchat version"
else
  warn "\nPush failed. This may happen if local main diverged from origin."
  warn "If you're sure this is correct, force push:"
  echo "  git push origin main --force"
  warn "\nOnly force push if you are the sole maintainer and understand the consequences."
fi
