# QuikChat Release Process

This document outlines the steps to create a new release for the QuikChat project.

### Step 1: Ensure Local `main` is Up-to-Date

```bash
git checkout main
git pull origin main
```

### Step 2: Create and Push a Git Tag

Make sure to update the version number in the commands below. The `-a` flag creates an annotated tag, which is best practice.

```bash
# Example for version 1.1.13
git tag -a v1.1.13 -m "Release 1.1.13: Add message visibility feature"

# Push the new tag to the remote repository
git push origin v1.1.13
```

### Step 3: Create the GitHub Release

This step uses the GitHub CLI (`gh`). The `--generate-notes` flag automatically creates release notes from recent pull requests, which is very convenient.

```bash
# This command will open your default text editor to review the release notes.
# After you save and close the editor, the release will be created.
gh release create v1.1.13 --generate-notes
```

### Step 4: Publish to npm

Once the release is tagged and created on GitHub, you can publish the package to the npm registry.

```bash
# Make sure you are logged in to npm first
# npm login

# Publish the package
npm publish
``` 