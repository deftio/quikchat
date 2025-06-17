#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration & Validation ---

# Check for release tag and release notes file arguments
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Error: Missing arguments."
  echo "Usage: $0 <release-tag> <path-to-release-notes-file>"
  echo "Example: $0 v1.1.14 release-notes.md"
  exit 1
fi

RELEASE_TAG=$1
RELEASE_NOTES_FILE=$2
PACKAGE_VERSION=$(jq -r .version package.json)

# Ensure the release tag matches the package.json version
if [ "v$PACKAGE_VERSION" != "$RELEASE_TAG" ]; then
  echo "Error: Git tag ($RELEASE_TAG) does not match package.json version (v$PACKAGE_VERSION)."
  echo "Please update package.json to match the release tag."
  exit 1
fi

# Check if the release notes file exists
if [ ! -f "$RELEASE_NOTES_FILE" ]; then
    echo "Error: Release notes file not found at '$RELEASE_NOTES_FILE'"
    exit 1
fi

echo "🚀 Starting release process for version $RELEASE_TAG..."

# --- Build and Test ---
echo "📦 Building project..."
npm run build

echo "✅ Running tests..."
npm test

# --- Git Operations ---
echo "📝 Committing changes..."
git add .
git commit -m "chore(release): prepare for $RELEASE_TAG"

echo " stvarring git tag..."
git tag -a "$RELEASE_TAG" -m "Release $RELEASE_TAG"

echo "⬆️ Pushing commit and tag to main..."
git push origin main
git push origin "$RELEASE_TAG"

# --- GitHub Release & NPM Publish ---
echo "🎉 Creating GitHub release..."
gh release create "$RELEASE_TAG" \
    --title "Release $RELEASE_TAG" \
    --notes-file "$RELEASE_NOTES_FILE" \
    --latest

echo "📦 Publishing to npm..."
npm publish

echo "✅ Release $RELEASE_TAG complete!" 