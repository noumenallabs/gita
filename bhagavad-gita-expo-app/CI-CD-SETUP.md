# 🚀 CI/CD Setup Guide

This guide will help you set up the complete CI/CD pipeline for the Bhagavad Gita app.

## 📋 Prerequisites

1. **GitHub Repository** - Your code should be in a GitHub repository
2. **Expo Account** - Sign up at [expo.dev](https://expo.dev)
3. **Samsung Galaxy Store Account** - Register at [Samsung Seller Portal](https://seller.samsungapps.com/)
4. **App Store Connect Account** (optional, for iOS deployment)

## 🔧 Setup Steps

### 1. GitHub Secrets Configuration

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

#### Required Secrets:
```
EXPO_TOKEN=your_expo_access_token
```

#### Optional Secrets (for iOS deployment):
```
APPLE_ID=your_apple_id@example.com
APPLE_APP_SPECIFIC_PASSWORD=your_app_specific_password
```

**Note**: Samsung Galaxy Store requires manual APK upload - no API submission available.

### 2. Get Expo Access Token

1. Go to [expo.dev/accounts/settings](https://expo.dev/accounts/settings)
2. Click "Access Tokens"
3. Create a new token with appropriate permissions
4. Copy the token and add it as `EXPO_TOKEN` secret in GitHub

### 3. Configure App Store Credentials (iOS)

```bash
# Configure iOS credentials
eas credentials:configure --platform ios

# Or use existing credentials
eas credentials:configure --platform ios --profile production
```

### 4. Configure Android Credentials

```bash
# Configure Android signing credentials
eas credentials:configure --platform android
```

**Samsung Galaxy Store**: Manual APK upload required - see [Samsung Store Deployment Guide](./SAMSUNG-STORE-DEPLOYMENT.md)

## 🔄 Workflow Overview

### Main Workflows:

1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
   - Runs on push/PR to main/develop
   - Tests, lints, and builds the app
   - Deploys updates and submits to stores

2. **Dependency Updates** (`.github/workflows/dependency-updates.yml`)
   - Runs weekly on Mondays
   - Updates dependencies automatically
   - Creates PR with changes

3. **Performance Monitoring** (`.github/workflows/performance.yml`)
   - Analyzes bundle size
   - Runs accessibility audits

4. **Release** (`.github/workflows/release.yml`)
   - Triggers on version tags
   - Creates GitHub releases
   - Builds and submits to app stores

## 🚀 Deployment Process

### Development Builds
```bash
# Trigger development build
git push origin develop
```

### Preview Builds (Staging)
```bash
# Create PR to main branch
# This triggers preview builds automatically
```

### Production Release
```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0

# This triggers:
# 1. Production builds
# 2. App store submissions
# 3. GitHub release creation
```

## 📱 Build Profiles

### Development
- **Purpose**: Testing and development
- **Distribution**: Internal (Expo Go compatible)
- **Platforms**: Android APK, iOS Simulator

### Preview
- **Purpose**: Staging/QA testing
- **Distribution**: Internal
- **Platforms**: Android APK, iOS TestFlight

### Production
- **Purpose**: App store releases
- **Distribution**: Store
- **Platforms**: Android AAB, iOS IPA

## 🔍 Monitoring & Quality

### Automated Checks:
- ✅ **Linting** - ESLint with React/TypeScript rules
- ✅ **Type Checking** - TypeScript compilation
- ✅ **Testing** - Jest unit tests
- ✅ **Security Audit** - npm audit for vulnerabilities
- ✅ **Bundle Analysis** - Size and performance monitoring
- ✅ **Accessibility** - Automated a11y testing

### Code Quality Gates:
- All tests must pass
- No linting errors
- No TypeScript errors
- Security audit passes
- Bundle size within limits

## 🛠️ Local Development

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run linting
npm run lint

# Type check
npm run type-check
```

### Build Locally
```bash
# Development build
eas build --profile development --platform android

# Preview build
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all
```

## 🔄 Update Deployment

### Over-the-Air Updates
```bash
# Deploy update to production
eas update --branch production --message "Bug fixes and improvements"

# Deploy to specific channel
eas update --branch staging --message "New features for testing"
```

## 📊 Monitoring

### Build Status
- Check build status at: [Expo Dashboard](https://expo.dev/accounts/thalahemanth/projects/bhagavad-gita-expo-app)
- GitHub Actions: Repository > Actions tab

### Performance Metrics
- Bundle size reports in GitHub Actions
- Crash analytics via Expo
- User analytics (if configured)

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check dependency conflicts
   - Verify Expo SDK compatibility
   - Review build logs in Expo dashboard

2. **Credential Issues**
   - Regenerate Expo access token
   - Update app store credentials
   - Check secret configuration

3. **Submission Failures**
   - Verify app store metadata
   - Check certificate validity
   - Review submission requirements

### Debug Commands:
```bash
# Check EAS configuration
eas config

# Validate credentials
eas credentials

# Check project status
eas project:info
```

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 🎯 Next Steps

1. **Set up GitHub secrets** with your Expo token
2. **Push code to GitHub** to trigger first build
3. **Configure app store credentials** for submissions
4. **Test the pipeline** with a small change
5. **Create your first release** with a version tag

Your CI/CD pipeline is now ready! 🚀