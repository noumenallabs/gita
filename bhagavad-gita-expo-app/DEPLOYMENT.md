# 🚀 Deployment Guide

## Quick Deployment Commands

### 🔧 Setup
```bash
# First time setup
npm run ci:setup
npm run ci:test
```

### 🏗️ Build Commands
```bash
# Development build (for testing)
npm run ci:build:dev

# Preview build (for staging)
npm run ci:build:preview  

# Production build (for app stores)
npm run ci:build:prod

# Samsung Galaxy Store build
npm run ci:build:samsung
```

### 📱 Release Commands
```bash
# Patch release (1.0.0 → 1.0.1)
npm run release:patch

# Minor release (1.0.0 → 1.1.0)
npm run release:minor

# Major release (1.0.0 → 2.0.0)
npm run release:major
```

### 🔄 Update Deployment
```bash
# Deploy over-the-air update
npm run ci:update

# Build APK for Samsung Galaxy Store (manual upload required)
npm run ci:build:samsung
```

## 📋 Pre-Deployment Checklist

- [ ] All tests passing (`npm run ci:test`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] App tested on both iOS and Android
- [ ] Version number updated in `package.json`
- [ ] Changelog updated
- [ ] Environment variables configured

## 🔑 Required Secrets

Add these to GitHub repository secrets:

```
EXPO_TOKEN=your_expo_access_token
APPLE_ID=your_apple_id@example.com (optional, for iOS)
APPLE_APP_SPECIFIC_PASSWORD=your_password (optional, for iOS)
```

**Note**: Samsung Galaxy Store requires manual APK upload.

## 🌍 Environments

| Environment | Branch | Trigger | Purpose |
|-------------|--------|---------|---------|
| Development | `develop` | Push | Testing & development |
| Preview | `main` | Pull Request | Staging & QA |
| Production | `main` | Tag push | App store release |

## 📊 Monitoring

- **Build Status**: [GitHub Actions](../../actions)
- **App Builds**: [Expo Dashboard](https://expo.dev/accounts/thalahemanth/projects/bhagavad-gita-expo-app)
- **Performance**: Automated bundle analysis in CI

## 🚨 Emergency Procedures

### Rollback Release
```bash
# Revert to previous version
git revert HEAD
git push origin main

# Or rollback via Expo
eas update --branch production --message "Rollback to stable version"
```

### Hotfix Deployment
```bash
# Create hotfix branch
git checkout -b hotfix/critical-fix

# Make changes and test
npm run ci:test

# Deploy immediately
git tag v1.0.1-hotfix
git push origin v1.0.1-hotfix
```

---

For detailed setup instructions, see [CI-CD-SETUP.md](./CI-CD-SETUP.md)