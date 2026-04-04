#!/usr/bin/env bash
#
# feature.sh — create a feature branch with proper naming and auto-bump patch version.
#
# Usage:
#   npm run feature <short-description>
#   npm run feature <short-description> minor
#   npm run feature <short-description> major
#
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

die()  { echo -e "${RED}ERROR: $*${NC}" >&2; exit 1; }
info() { echo -e "${GREEN}$*${NC}"; }
warn() { echo -e "${YELLOW}$*${NC}"; }

# --- parse args --------------------------------------------------------------

NAME="${1:-}"
BUMP="${2:-patch}"

[ -n "$NAME" ] || die "Usage: npm run feature <short-description> [patch|minor|major]"
[[ "$BUMP" =~ ^(patch|minor|major)$ ]] || die "Bump type must be patch, minor, or major (got '$BUMP')."

# Sanitize branch name: lowercase, replace spaces/underscores with hyphens
BRANCH="feature/$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr ' _' '-' | sed 's/[^a-z0-9-]//g')"

# --- preflight ---------------------------------------------------------------

# Must be on main
CURRENT=$(git rev-parse --abbrev-ref HEAD)
[ "$CURRENT" = "main" ] || die "Must be on 'main' to start a feature (currently on '$CURRENT').\n  Run: git checkout main"

# Clean working tree
if ! git diff --quiet || ! git diff --cached --quiet; then
  die "Working tree is dirty. Commit or stash changes first."
fi

# Pull latest from origin — this prevents starting from a stale main
info "Pulling latest main from origin..."
if ! git pull origin main; then
  die "Failed to pull from origin. Check your network connection and remote config.\n  Run: git remote -v"
fi

# Verify local main matches origin/main
LOCAL_SHA=$(git rev-parse HEAD)
REMOTE_SHA=$(git rev-parse origin/main 2>/dev/null || echo "unknown")
if [ "$LOCAL_SHA" != "$REMOTE_SHA" ] && [ "$REMOTE_SHA" != "unknown" ]; then
  warn "WARNING: Local main ($LOCAL_SHA) differs from origin/main ($REMOTE_SHA)"
  warn "Your feature branch may not be based on the latest release."
  read -r -p "Continue anyway? [y/N] " CONFIRM
  [[ "$CONFIRM" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }
fi

# --- read current version ----------------------------------------------------

SRC="src/quikchat.js"
CURRENT_VERSION=$(node -p "
  const fs = require('fs');
  const src = fs.readFileSync('$SRC', 'utf8');
  const m = src.match(/\"version\":\\s*\"([^\"]+)\"/);
  m ? m[1] : ''
")
[ -n "$CURRENT_VERSION" ] || die "Could not read version from $SRC"

# --- compute new version -----------------------------------------------------

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

case "$BUMP" in
  patch) PATCH=$((PATCH + 1)) ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

# --- create branch and bump --------------------------------------------------

git checkout -b "$BRANCH"

# Update version in src/quikchat.js
sed -i "s/\"version\": \"${CURRENT_VERSION}\"/\"version\": \"${NEW_VERSION}\"/" "$SRC"

# Sync to package.json
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.version = '${NEW_VERSION}';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

git add "$SRC" package.json
git commit -m "bump version to ${NEW_VERSION}"

info "\nCreated branch: $BRANCH"
info "Version bumped: $CURRENT_VERSION -> $NEW_VERSION"
info "\nReady to work. When done, run:"
echo "  npm run release"
