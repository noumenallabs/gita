# Deployment Guide

## Prerequisites

### Development Environment

- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g @expo/cli`
- EAS CLI installed globally: `npm install -g eas-cli`

### Accounts Required

- Expo account (free tier sufficient for development)
- Apple Developer Account ($99/year for iOS App Store)
- Google Play Console Account ($25 one-time fee for Android)

## Initial Setup

### 1. Install Dependencies

```bash
cd bhagavad-gita-expo-app
npm install
```

### 2. Configure EAS

```bash
# Login to Expo
eas login

# Configure the project
eas build:configure
```

### 3. Update Project ID

Update the `extra.eas.projectId` in `app.json` with your actual project ID from Expo dashboard.

## Development Builds

### Local Development

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Development Builds (Physical Devices)

```bash
# Build development client for iOS
eas build --profile development --platform ios

# Build development client for Android
eas build --profile development --platform android
```

## Testing Builds

### Preview Builds

```bash
# Build preview for both platforms
npm run build:preview

# Build preview for specific platform
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

## Production Builds

### iOS Production Build

```bash
# Build for iOS App Store
npm run build:ios

# Or using EAS directly
eas build --profile production --platform ios
```

### Android Production Build

```bash
# Build for Google Play Store
npm run build:android

# Or using EAS directly
eas build --profile production --platform android
```

## App Store Submission

### iOS App Store

1. **Prepare App Store Connect**
   - Create app in App Store Connect
   - Configure app information, pricing, and availability
   - Upload screenshots and app preview videos
   - Set up App Store description and keywords

2. **Submit Build**

   ```bash
   # Submit to App Store
   npm run submit:ios
   ```

3. **Review Process**
   - Apple review typically takes 24-48 hours
   - Address any review feedback promptly
   - Monitor App Store Connect for status updates

### Google Play Store

1. **Prepare Play Console**
   - Create app in Google Play Console
   - Configure store listing with descriptions and screenshots
   - Set up content rating and target audience
   - Configure pricing and distribution

2. **Submit Build**

   ```bash
   # Submit to Google Play
   npm run submit:android
   ```

3. **Review Process**
   - Google review typically takes 1-3 days
   - Monitor Play Console for review status
   - Address any policy violations promptly

## Over-the-Air Updates

### Publishing Updates

```bash
# Publish OTA update
npm run update

# Publish to specific channel
eas update --channel production --message "Bug fixes and improvements"
```

### Update Channels

- **development**: For internal testing
- **preview**: For beta testing
- **production**: For live app users

## Build Monitoring

### Check Build Status

```bash
# List recent builds
eas build:list

# View specific build
eas build:view [build-id]
```

### Build Logs

- Access detailed build logs in Expo dashboard
- Monitor for build failures and optimization opportunities
- Review bundle size and performance metrics

## Troubleshooting

### Common Issues

#### iOS Build Failures

- **Certificate Issues**: Ensure Apple Developer account is properly configured
- **Provisioning Profiles**: Verify bundle identifier matches App Store Connect
- **Capabilities**: Check if required capabilities are enabled

#### Android Build Failures

- **Keystore Issues**: Ensure Android keystore is properly configured
- **Package Name**: Verify package name is unique and properly formatted
- **Permissions**: Check if required permissions are declared

#### General Build Issues

- **Dependencies**: Ensure all dependencies are compatible with Expo SDK
- **Asset Issues**: Verify all assets are properly referenced and sized
- **Memory Issues**: Monitor build memory usage for large apps

### Getting Help

- Expo Documentation: https://docs.expo.dev/
- Expo Forums: https://forums.expo.dev/
- Discord Community: https://chat.expo.dev/

## Security Considerations

### Code Signing

- iOS: Automatic code signing via EAS
- Android: App signing by Google Play (recommended)

### Secrets Management

- Store sensitive keys in EAS Secrets
- Never commit credentials to version control
- Use environment-specific configurations

### Privacy Compliance

- No data collection in this app
- All data stored locally on device
- Privacy policy reflects actual data practices

## Performance Optimization

### Bundle Size

- Monitor bundle size in build reports
- Use dynamic imports for large dependencies
- Optimize images and assets

### Runtime Performance

- Test on low-end devices
- Monitor memory usage
- Optimize list rendering with FlatList

## Maintenance

### Regular Updates

- Keep Expo SDK updated to latest stable version
- Update dependencies regularly for security patches
- Monitor for deprecated APIs and features

### Monitoring

- Set up crash reporting
- Monitor app store reviews and ratings
- Track key performance metrics

### Backup Strategy

- Regular code backups in version control
- Export app configurations
- Document deployment procedures
