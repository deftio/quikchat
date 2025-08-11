# QuikChat Release Process

This document outlines the standard process for developing features and creating releases for QuikChat.

## 📝 Development Process

### 1. Starting a New Feature

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Update version in package.json**
   - For bug fixes/incremental: Increment patch version (1.1.16 → 1.1.17)
   - For new features: Increment minor version (1.1.16 → 1.2.0)
   - For breaking changes: Increment major version (1.1.16 → 2.0.0)
   - **Add dev suffix**: Append `-dev1` to version (e.g., `1.1.17-dev1`)

3. **Update version in source**
   ```bash
   npm run updateVersion
   ```

### 2. During Development

1. **Increment dev version for each build**
   - Update package.json: `1.1.17-dev1` → `1.1.17-dev2` → etc.
   - Run `npm run updateVersion` after each version change

2. **Maintain test coverage**
   - Run tests frequently: `npm test`
   - Coverage MUST NOT drop below 80%
   - Target: Increase coverage to 90%

3. **Build and test regularly**
   ```bash
   npm run build
   npm test
   ```

## 🚀 Release Preparation

### 1. Feature Completion Checklist

- [ ] All new features have test coverage
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Linting passes (if configured)
- [ ] Test coverage ≥ 80% (target 90%)

### 2. Documentation Updates

1. **Update documentation with plain facts only**
   - No marketing language ("400% faster", "revolutionary", etc.)
   - Use concrete metrics and numbers
   - Be technical and factual

2. **Files to update:**
   - `docs/release-notes.md` - Add new version section with completed features
   - `README.md` - Update "What's New" section if needed
   - `docs/API-REFERENCE.md` - Document new APIs
   - `dev/todo.md` - Remove completed items (do NOT add completed features here)

### 3. Version Finalization

1. **Remove dev suffix from version**
   ```bash
   # In package.json: Change "1.1.17-dev3" to "1.1.17"
   ```

2. **Verify version uniqueness**
   - Check npm: `npm view quikchat versions`
   - Check GitHub releases: `gh release list`
   - Ensure no conflict with existing versions

3. **Update version everywhere**
   ```bash
   npm run updateVersion
   ```

### 4. Final Build and Test

1. **Clean build**
   ```bash
   rm -rf dist/
   npm run build
   ```

2. **Run all tests**
   ```bash
   npm test
   ```

3. **Test examples manually**
   - Open test files in browser
   - Verify all examples work
   - Check console for errors

4. **Rebuild documentation**
   ```bash
   npm run buildDocs
   ```

### 5. Merge to Main

1. **Create pull request**
   ```bash
   git push origin feature/your-feature-name
   gh pr create --title "Feature: Your feature name" --body "Description..."
   ```

2. **Merge after approval**
   ```bash
   git checkout main
   git merge feature/your-feature-name
   ```

## 📦 Release Publication

### Automated Release (Recommended)

Use the automated release script for consistency:
```bash
./dev/make-release.sh v1.1.17 release-notes.md
```

See [make-release.md](./make-release.md) for details on the automated script.

### Manual Release Steps

If doing manually:

1. **Tag the Release**
   ```bash
   git tag v1.1.17
   git push origin v1.1.17
   ```

2. **Create GitHub Release**
   ```bash
   gh release create v1.1.17 \
     --title "v1.1.17" \
     --notes "See release-notes.md for details"
   ```

3. **Publish to NPM**
   ```bash
   npm publish
   ```

### 4. Verify Release

- Check npm: `npm view quikchat@latest`
- Check GitHub: View releases page
- Test CDN: `https://unpkg.com/quikchat@latest`

## 🔄 Post-Release

1. **Update main branch version**
   - Increment to next dev version (e.g., `1.1.18-dev1`)
   - Commit: `git commit -m "chore: begin v1.1.18 development"`

2. **Update project boards/issues**
   - Close completed issues
   - Update milestones

## 📋 Quick Checklist

```bash
# Development
[ ] Create feature branch
[ ] Update version with -dev suffix
[ ] Write tests (coverage ≥ 80%)
[ ] Update documentation (plain facts only)

# Pre-release
[ ] Remove -dev suffix
[ ] Verify version uniqueness
[ ] All tests pass
[ ] Build succeeds
[ ] Documentation updated

# Release
[ ] Merge to main
[ ] Tag release
[ ] Create GitHub release
[ ] Publish to npm
[ ] Verify CDN availability

# Post-release
[ ] Start next dev version
[ ] Update project tracking
```

## 🚨 Important Notes

- **NEVER** skip tests before release
- **ALWAYS** use plain, factual language in docs
- **ENSURE** version numbers don't conflict
- **TEST** examples manually before release
- **MAINTAIN** test coverage above 80%
- **COMPLETED FEATURES** go in `docs/release-notes.md`, NOT in `dev/todo.md`
- **TODO.MD** is for tracking future work only - remove items as they're completed

---
*Last updated: 2025-08-11*