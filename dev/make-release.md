# QuikChat Release Process - Automation

This document describes the automated release script for QuikChat. For the complete development and release workflow, see [release-process.md](./release-process.md).

This document outlines the automated steps to create a new release for QuikChat, including creating a git tag, publishing to npm, and creating a GitHub release.

## Automated Release Script

To streamline the release process, you can use the `dev/make-release.sh` script. This script automates all the necessary steps.

### Prerequisites

1.  Ensure the GitHub CLI (`gh`) is installed and authenticated: `gh auth login`.
2.  Ensure you are logged into npm: `npm login`.
3.  Ensure `jq` is installed for parsing `package.json`. (`brew install jq` on macOS).
4.  Make sure your `package.json` version has been updated to the new version number.

### Usage

1.  Create a temporary file containing your release notes (e.g., `release-notes.md`).
2.  Make the script executable: `chmod +x dev/make-release.sh`.
3.  Run the script from the project root with the new version tag and the path to your release notes file.

```bash
./dev/make-release.sh v1.1.14 release-notes.md
```

---

## Suggestions for a More Modern JS Workflow

While the script above provides solid automation, the following suggestions can further modernize your development and release process, making it more robust and less error-prone.

### 1. Automated Versioning and Changelog Generation

Manual versioning is prone to error. Tools like `standard-version` or `release-it` can automate this based on your commit history.

**How it works:**
-   These tools analyze your git commits since the last tag.
-   They automatically determine the next version number (patch, minor, or major) based on conventional commit messages (e.g., `feat:`, `fix:`, `perf:`).
-   They update `package.json`, create a `CHANGELOG.md` file (or update it), commit the changes, and tag the release.

**Example with `standard-version`:**
1.  **Install:** `npm install --save-dev standard-version`
2.  **Add script to `package.json`:**
    ```json
    "scripts": {
      "release": "standard-version"
    }
    ```
3.  **Usage:** Instead of manually editing `package.json` and creating a tag, you just run `npm run release`. It does the work for you.

### 2. Pre-publish Hooks

To prevent accidentally publishing broken code, you can use a `prepublishOnly` script in `package.json`. This script runs automatically before `npm publish` is executed.

**Example `package.json` entry:**
```json
"scripts": {
  "prepublishOnly": "npm test && npm run build"
}
```
This ensures that your tests must pass and your build must succeed before any code is sent to the npm registry.

### 3. Continuous Integration / Continuous Deployment (CI/CD)

You already have a solid CI pipeline in `.github/workflows/ci.yml` that runs tests and builds the project on every push to `main`. This is great for ensuring code quality. For a fully automated release, you can add a *separate* workflow that handles publishing to npm only when you're ready to release.

**How They Work Together:**
-   **`ci.yml` (Your existing workflow):** Runs on every push and pull request to `main`. Its job is to catch errors early and ensure the main branch is always stable.
-   **`release.yml` (New workflow):** Runs *only* when you push a new tag (e.g., `v1.1.14`). Its job is to take the validated code and publish it.

**Benefits:**
-   **Separation of Concerns:** CI and CD are distinct processes. You continuously integrate, but only continuously deploy when you decide to.
-   **Safety:** You never accidentally publish a package just by pushing code to `main`. The release is a deliberate action triggered by a tag.
-   **Security:** You can use an `NPM_TOKEN` stored as a secret in your repository, so you don't have to handle authentication manually on your local machine.

**Example `release.yml` for GitHub Actions:**

This workflow should be created as a new file, for example: `.github/workflows/release.yml`. It will not conflict with your existing `ci.yml`.

By adopting these practices, you can create a highly reliable, automated, and modern release pipeline for QuikChat. 