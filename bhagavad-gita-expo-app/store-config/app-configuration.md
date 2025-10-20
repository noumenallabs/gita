# App Configuration Guide

## App Metadata

### Basic Information

- **App Name**: Bhagavad Gita
- **Bundle ID (iOS)**: com.bhagavadgita.app
- **Package Name (Android)**: com.bhagavadgita.app
- **Version**: 1.0.0
- **Build Number (iOS)**: 1.0.0
- **Version Code (Android)**: 1

### App Store Categories

- **Primary Category**: Books & Reference
- **Secondary Category**: Education
- **Content Rating**: 4+ (iOS) / Everyone (Android)

### App Icons & Assets

#### Required iOS Icons

- App Icon (1024x1024): `assets/icon.png`
- Various sizes generated automatically by Expo

#### Required Android Icons

- Adaptive Icon Foreground (432x432): `assets/adaptive-icon.png`
- Background Color: #f97316 (Orange)

#### Splash Screen

- Image: `assets/splash-icon.png`
- Background Color: #f97316
- Resize Mode: contain

### Build Configuration

#### iOS Configuration

```json
{
  "supportsTablet": true,
  "bundleIdentifier": "com.bhagavadgita.app",
  "buildNumber": "1.0.0",
  "config": {
    "usesNonExemptEncryption": false
  }
}
```

#### Android Configuration

```json
{
  "package": "com.bhagavadgita.app",
  "versionCode": 1,
  "permissions": [],
  "proguardEnabled": true,
  "edgeToEdgeEnabled": true
}
```

### Privacy & Permissions

#### iOS Permissions

- No special permissions required
- Background processing for app state management

#### Android Permissions

- No permissions required (empty array)
- Fully offline functionality

### App Store Optimization (ASO)

#### Keywords

- Primary: bhagavad gita, sanskrit, spiritual
- Secondary: hinduism, meditation, yoga, philosophy
- Long-tail: daily quotes, sacred texts, verses, shlokas

#### Localization

- Primary Language: English (US)
- Future: Hindi, Sanskrit transliteration support

### Build Profiles (EAS)

#### Development

- Internal distribution
- Development client enabled
- Debug builds for testing

#### Preview

- Internal distribution
- Release builds for testing
- Simulator support (iOS)

#### Production

- App Store/Play Store distribution
- Auto-increment version numbers
- Optimized release builds

### Signing & Certificates

#### iOS

- Apple Developer Account required
- App Store Connect configuration
- Automatic code signing via EAS

#### Android

- Google Play Console setup
- Service account for automated uploads
- App signing by Google Play (recommended)

### Analytics & Monitoring

#### Crash Reporting

- Built-in Expo error reporting
- No third-party analytics (privacy-focused)

#### Performance Monitoring

- React Native performance monitoring
- Bundle size optimization

### Compliance & Legal

#### Privacy Policy

- No data collection
- Local storage only
- GDPR compliant by design

#### Content Rating

- Religious/Spiritual content
- No objectionable material
- Educational content

#### Accessibility

- WCAG 2.1 AA compliance
- Screen reader support
- High contrast mode
- Scalable fonts

### Pre-Launch Checklist

#### Technical

- [ ] All assets properly sized and optimized
- [ ] App icons display correctly on all devices
- [ ] Splash screen loads properly
- [ ] All navigation flows work correctly
- [ ] Offline functionality verified
- [ ] Performance tested on low-end devices

#### Store Preparation

- [ ] App Store/Play Store descriptions finalized
- [ ] Screenshots captured for all device sizes
- [ ] Privacy policy created and linked
- [ ] Age rating questionnaire completed
- [ ] Keywords and categories selected

#### Testing

- [ ] Tested on physical iOS devices (iPhone 12+)
- [ ] Tested on physical Android devices (API 21+)
- [ ] Accessibility features verified
- [ ] Different screen sizes tested
- [ ] Dark/light theme switching verified

### Post-Launch

#### Monitoring

- App Store/Play Store reviews and ratings
- Crash reports and performance metrics
- User feedback and feature requests

#### Updates

- Version increment strategy
- Feature rollout plan
- Bug fix prioritization

### Contact Information

- Developer: [Your Name/Company]
- Support Email: support@bhagavadgita.app
- Website: https://bhagavadgita.app
- Privacy Policy: https://bhagavadgita.app/privacy
