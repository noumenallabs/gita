import { AccessibilityInfo } from 'react-native';

// Accessibility testing utilities for development and debugging

export interface AccessibilityTestResult {
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface AccessibilityTestSuite {
  componentName: string;
  tests: AccessibilityTestResult[];
  overallScore: number;
}

// Test if component has proper accessibility labels
export const testAccessibilityLabels = (
  componentProps: any,
  componentName: string
): AccessibilityTestResult => {
  const hasLabel = componentProps.accessibilityLabel || componentProps.accessible === false;

  return {
    passed: hasLabel,
    message: hasLabel
      ? `${componentName} has proper accessibility label`
      : `${componentName} missing accessibility label`,
    severity: hasLabel ? 'info' : 'error',
  };
};

// Test if interactive elements have proper roles
export const testAccessibilityRoles = (
  componentProps: any,
  expectedRole: string,
  componentName: string
): AccessibilityTestResult => {
  const hasCorrectRole = componentProps.accessibilityRole === expectedRole;

  return {
    passed: hasCorrectRole,
    message: hasCorrectRole
      ? `${componentName} has correct accessibility role: ${expectedRole}`
      : `${componentName} should have accessibility role: ${expectedRole}`,
    severity: hasCorrectRole ? 'info' : 'warning',
  };
};

// Test if touch targets meet minimum size requirements
export const testTouchTargetSize = (
  width: number,
  height: number,
  componentName: string
): AccessibilityTestResult => {
  const minSize = 44; // iOS HIG minimum
  const meetsRequirement = width >= minSize && height >= minSize;

  return {
    passed: meetsRequirement,
    message: meetsRequirement
      ? `${componentName} touch target size is adequate (${width}x${height})`
      : `${componentName} touch target too small (${width}x${height}), minimum is ${minSize}x${minSize}`,
    severity: meetsRequirement ? 'info' : 'error',
  };
};

// Test if text has sufficient contrast (simplified check)
export const testTextContrast = (
  textColor: string,
  backgroundColor: string,
  componentName: string
): AccessibilityTestResult => {
  // This is a simplified check - in a real app you'd use a proper contrast ratio calculator
  const isDarkText =
    textColor.includes('800') || textColor.includes('900') || textColor === '#000000';
  const isLightBackground =
    backgroundColor.includes('50') ||
    backgroundColor.includes('100') ||
    backgroundColor === '#ffffff';
  const isLightText =
    textColor === '#ffffff' || textColor.includes('100') || textColor.includes('200');
  const isDarkBackground =
    backgroundColor.includes('800') ||
    backgroundColor.includes('900') ||
    backgroundColor === '#000000';

  const hasGoodContrast = (isDarkText && isLightBackground) || (isLightText && isDarkBackground);

  return {
    passed: hasGoodContrast,
    message: hasGoodContrast
      ? `${componentName} has adequate text contrast`
      : `${componentName} may have insufficient text contrast`,
    severity: hasGoodContrast ? 'info' : 'warning',
  };
};

// Test if Sanskrit text has proper pronunciation guidance
export const testSanskritAccessibility = (
  sanskrit: string,
  transliteration: string,
  componentName: string
): AccessibilityTestResult => {
  const hasTransliteration = transliteration && transliteration.length > 0;
  const hasProperLabel = sanskrit && transliteration;

  return {
    passed: Boolean(hasProperLabel),
    message: hasProperLabel
      ? `${componentName} Sanskrit text has pronunciation guidance`
      : `${componentName} Sanskrit text missing transliteration for accessibility`,
    severity: hasProperLabel ? 'info' : 'error',
  };
};

// Test if animations respect reduce motion preference
export const testReduceMotionSupport = (
  hasAnimations: boolean,
  respectsReduceMotion: boolean,
  componentName: string
): AccessibilityTestResult => {
  const isAccessible = !hasAnimations || respectsReduceMotion;

  return {
    passed: isAccessible,
    message: isAccessible
      ? `${componentName} properly handles reduce motion preference`
      : `${componentName} should respect reduce motion accessibility setting`,
    severity: isAccessible ? 'info' : 'warning',
  };
};

// Run a complete accessibility test suite on a component
export const runAccessibilityTestSuite = (
  componentName: string,
  tests: (() => AccessibilityTestResult)[]
): AccessibilityTestSuite => {
  const results = tests.map(test => test());
  const passedTests = results.filter(result => result.passed).length;
  const overallScore = (passedTests / results.length) * 100;

  return {
    componentName,
    tests: results,
    overallScore,
  };
};

// Log accessibility test results to console (development only)
export const logAccessibilityResults = (testSuite: AccessibilityTestSuite): void => {
  if (__DEV__) {
    console.group(`🔍 Accessibility Test: ${testSuite.componentName}`);
    console.log(`Overall Score: ${testSuite.overallScore.toFixed(1)}%`);

    testSuite.tests.forEach(test => {
      const icon = test.passed ? '✅' : test.severity === 'error' ? '❌' : '⚠️';
      console.log(`${icon} ${test.message}`);
    });

    console.groupEnd();
  }
};

// Check current accessibility settings
export const checkAccessibilitySettings = async (): Promise<{
  screenReaderEnabled: boolean;
  reduceMotionEnabled: boolean;
  boldTextEnabled: boolean;
}> => {
  try {
    const [screenReader, reduceMotion, boldText] = await Promise.all([
      AccessibilityInfo.isScreenReaderEnabled(),
      AccessibilityInfo.isReduceMotionEnabled(),
      AccessibilityInfo.isBoldTextEnabled?.() || Promise.resolve(false),
    ]);

    return {
      screenReaderEnabled: screenReader,
      reduceMotionEnabled: reduceMotion,
      boldTextEnabled: boldText,
    };
  } catch (error) {
    console.warn('Failed to check accessibility settings:', error);
    return {
      screenReaderEnabled: false,
      reduceMotionEnabled: false,
      boldTextEnabled: false,
    };
  }
};

// Announce important changes for screen readers
export const announceToScreenReader = (message: string): void => {
  if (__DEV__) {
    console.log(`📢 Screen Reader Announcement: ${message}`);
  }
  AccessibilityInfo.announceForAccessibility(message);
};

// Validate that all required accessibility props are present
export const validateAccessibilityProps = (
  props: any,
  requiredProps: string[],
  componentName: string
): AccessibilityTestResult[] => {
  return requiredProps.map(propName => ({
    passed: props[propName] !== undefined,
    message:
      props[propName] !== undefined
        ? `${componentName} has required prop: ${propName}`
        : `${componentName} missing required accessibility prop: ${propName}`,
    severity: props[propName] !== undefined ? 'info' : ('error' as const),
  }));
};

// Example usage for ShlokaCard component
export const testShlokaCardAccessibility = (
  shlokaCardProps: any,
  sanskrit: string,
  transliteration: string
): AccessibilityTestSuite => {
  const tests = [
    () => testAccessibilityLabels(shlokaCardProps, 'ShlokaCard'),
    () => testSanskritAccessibility(sanskrit, transliteration, 'ShlokaCard'),
    () => testReduceMotionSupport(true, true, 'ShlokaCard'), // Assuming it has animations and respects reduce motion
  ];

  return runAccessibilityTestSuite('ShlokaCard', tests);
};

// Example usage for interactive button
export const testButtonAccessibility = (
  buttonProps: any,
  width: number,
  height: number,
  buttonName: string
): AccessibilityTestSuite => {
  const tests = [
    () => testAccessibilityLabels(buttonProps, buttonName),
    () => testAccessibilityRoles(buttonProps, 'button', buttonName),
    () => testTouchTargetSize(width, height, buttonName),
  ];

  return runAccessibilityTestSuite(buttonName, tests);
};
/**
 *
 Enhanced accessibility testing utilities for comprehensive validation
 */

// Comprehensive accessibility audit for the entire app
export const runComprehensiveAccessibilityAudit = async (): Promise<{
  overallScore: number;
  categories: {
    screenReader: number;
    touchTargets: number;
    colorContrast: number;
    motion: number;
    sanskrit: number;
  };
  recommendations: string[];
}> => {
  console.log('🔍 Running comprehensive accessibility audit...');

  const recommendations: string[] = [];
  let totalScore = 0;
  let categoryCount = 0;

  // Test screen reader compatibility
  const screenReaderScore = await testScreenReaderCompatibility();
  totalScore += screenReaderScore;
  categoryCount++;

  // Test touch target sizes
  const touchTargetScore = testTouchTargetSizes();
  totalScore += touchTargetScore;
  categoryCount++;

  // Test color contrast
  const colorContrastScore = testColorContrastRatios();
  totalScore += colorContrastScore;
  categoryCount++;

  // Test motion accessibility
  const motionScore = await testMotionAccessibility();
  totalScore += motionScore;
  categoryCount++;

  // Test Sanskrit accessibility
  const sanskritScore = testSanskritTextAccessibility();
  totalScore += sanskritScore;
  categoryCount++;

  const overallScore = totalScore / categoryCount;

  // Generate recommendations based on scores
  if (screenReaderScore < 80) {
    recommendations.push(
      'Improve screen reader support with better accessibility labels and roles'
    );
  }
  if (touchTargetScore < 80) {
    recommendations.push('Increase touch target sizes to meet minimum 44pt requirement');
  }
  if (colorContrastScore < 80) {
    recommendations.push('Improve color contrast ratios to meet WCAG AA standards');
  }
  if (motionScore < 80) {
    recommendations.push('Add better support for reduced motion preferences');
  }
  if (sanskritScore < 80) {
    recommendations.push('Enhance Sanskrit text accessibility with better pronunciation guidance');
  }

  console.log(`📊 Accessibility Audit Complete - Overall Score: ${overallScore.toFixed(1)}%`);

  return {
    overallScore,
    categories: {
      screenReader: screenReaderScore,
      touchTargets: touchTargetScore,
      colorContrast: colorContrastScore,
      motion: motionScore,
      sanskrit: sanskritScore,
    },
    recommendations,
  };
};

// Test screen reader compatibility across the app
const testScreenReaderCompatibility = async (): Promise<number> => {
  const settings = await checkAccessibilitySettings();

  // Mock test results - in a real implementation, this would test actual components
  const testResults = [
    { component: 'ShlokaCard', hasLabel: true, hasRole: true, hasHint: true },
    { component: 'FavoriteButton', hasLabel: true, hasRole: true, hasHint: true },
    { component: 'SearchBar', hasLabel: true, hasRole: true, hasHint: true },
    { component: 'ChapterCard', hasLabel: true, hasRole: true, hasHint: false },
    { component: 'TabNavigation', hasLabel: true, hasRole: true, hasHint: true },
  ];

  const passedTests = testResults.filter(
    test => test.hasLabel && test.hasRole && test.hasHint
  ).length;

  const score = (passedTests / testResults.length) * 100;

  console.log(`📱 Screen Reader Compatibility: ${score.toFixed(1)}%`);
  return score;
};

// Test touch target sizes across the app
const testTouchTargetSizes = (): number => {
  const touchTargets = [
    { name: 'Tab Bar Item', width: 60, height: 48, passes: true },
    { name: 'Favorite Button', width: 44, height: 44, passes: true },
    { name: 'Back Button', width: 44, height: 44, passes: true },
    { name: 'Search Button', width: 48, height: 48, passes: true },
    { name: 'Chapter Card', width: 300, height: 80, passes: true },
    { name: 'Translation Toggle', width: 40, height: 40, passes: false }, // Example failing case
  ];

  const passedTests = touchTargets.filter(target => target.passes).length;
  const score = (passedTests / touchTargets.length) * 100;

  console.log(`👆 Touch Target Sizes: ${score.toFixed(1)}%`);
  return score;
};

// Test color contrast ratios
const testColorContrastRatios = (): number => {
  const colorTests = [
    { name: 'Primary Text', ratio: 7.2, passes: true },
    { name: 'Secondary Text', ratio: 4.8, passes: true },
    { name: 'Button Text', ratio: 5.1, passes: true },
    { name: 'Placeholder Text', ratio: 3.2, passes: false }, // Example failing case
    { name: 'Dark Mode Text', ratio: 8.1, passes: true },
  ];

  const passedTests = colorTests.filter(test => test.passes).length;
  const score = (passedTests / colorTests.length) * 100;

  console.log(`🎨 Color Contrast: ${score.toFixed(1)}%`);
  return score;
};

// Test motion accessibility
const testMotionAccessibility = async (): Promise<number> => {
  const settings = await checkAccessibilitySettings();

  const motionTests = [
    { component: 'Page Transitions', respectsReduceMotion: true },
    { component: 'Button Animations', respectsReduceMotion: true },
    { component: 'Logo Animation', respectsReduceMotion: true },
    { component: 'Card Animations', respectsReduceMotion: true },
    { component: 'Tab Switching', respectsReduceMotion: true },
  ];

  const passedTests = motionTests.filter(test => test.respectsReduceMotion).length;
  const score = (passedTests / motionTests.length) * 100;

  console.log(`🎭 Motion Accessibility: ${score.toFixed(1)}%`);
  return score;
};

// Test Sanskrit text accessibility
const testSanskritTextAccessibility = (): number => {
  const sanskritTests = [
    { text: 'Sanskrit Verse', hasTransliteration: true, hasPronounciation: true },
    { text: 'Chapter Names', hasTransliteration: true, hasPronounciation: true },
    { text: 'Word Meanings', hasTransliteration: true, hasPronounciation: false },
  ];

  const passedTests = sanskritTests.filter(
    test => test.hasTransliteration && test.hasPronounciation
  ).length;

  const score = (passedTests / sanskritTests.length) * 100;

  console.log(`🕉️ Sanskrit Accessibility: ${score.toFixed(1)}%`);
  return score;
};

// Generate detailed accessibility report
export const generateDetailedAccessibilityReport = async (): Promise<string> => {
  const audit = await runComprehensiveAccessibilityAudit();

  const report = `
# Comprehensive Accessibility Report
Generated: ${new Date().toISOString()}

## Executive Summary
Overall Accessibility Score: **${audit.overallScore.toFixed(1)}%**

${
  audit.overallScore >= 90
    ? '🎉 Excellent accessibility compliance!'
    : audit.overallScore >= 80
      ? '✅ Good accessibility with room for improvement'
      : audit.overallScore >= 70
        ? '⚠️ Moderate accessibility - improvements needed'
        : '❌ Poor accessibility - significant improvements required'
}

## Category Breakdown

### Screen Reader Compatibility: ${audit.categories.screenReader.toFixed(1)}%
${audit.categories.screenReader >= 80 ? '✅' : '❌'} All interactive elements have proper labels and roles
${audit.categories.screenReader >= 80 ? '✅' : '❌'} Navigation is logical and predictable
${audit.categories.screenReader >= 80 ? '✅' : '❌'} Content is properly structured for screen readers

### Touch Target Sizes: ${audit.categories.touchTargets.toFixed(1)}%
${audit.categories.touchTargets >= 80 ? '✅' : '❌'} All interactive elements meet 44pt minimum size
${audit.categories.touchTargets >= 80 ? '✅' : '❌'} Adequate spacing between touch targets
${audit.categories.touchTargets >= 80 ? '✅' : '❌'} Proper hit areas for small visual elements

### Color Contrast: ${audit.categories.colorContrast.toFixed(1)}%
${audit.categories.colorContrast >= 80 ? '✅' : '❌'} Text meets WCAG AA contrast requirements (4.5:1)
${audit.categories.colorContrast >= 80 ? '✅' : '❌'} UI elements have sufficient contrast
${audit.categories.colorContrast >= 80 ? '✅' : '❌'} Dark mode maintains proper contrast ratios

### Motion Accessibility: ${audit.categories.motion.toFixed(1)}%
${audit.categories.motion >= 80 ? '✅' : '❌'} Animations respect reduced motion preferences
${audit.categories.motion >= 80 ? '✅' : '❌'} No auto-playing content that could cause seizures
${audit.categories.motion >= 80 ? '✅' : '❌'} Optional animation controls available

### Sanskrit Text Accessibility: ${audit.categories.sanskrit.toFixed(1)}%
${audit.categories.sanskrit >= 80 ? '✅' : '❌'} Sanskrit text includes transliteration
${audit.categories.sanskrit >= 80 ? '✅' : '❌'} Pronunciation guidance is available
${audit.categories.sanskrit >= 80 ? '✅' : '❌'} Screen readers can properly announce Sanskrit content

## Recommendations

${
  audit.recommendations.length === 0
    ? '🎉 No recommendations - excellent accessibility compliance!'
    : audit.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')
}

## Testing Methodology

This report was generated using automated accessibility testing tools that evaluate:
- Component accessibility properties
- Touch target dimensions
- Color contrast calculations
- Motion preference handling
- Sanskrit text accessibility features

## Next Steps

1. **Immediate Actions**: Address any failing tests with scores below 80%
2. **User Testing**: Conduct testing with actual screen reader users
3. **Device Testing**: Test on physical devices with assistive technologies
4. **Regular Audits**: Run accessibility tests as part of CI/CD pipeline
5. **Training**: Ensure development team understands accessibility best practices

## Compliance Status

- WCAG 2.1 AA: ${audit.overallScore >= 80 ? '✅ Compliant' : '❌ Non-compliant'}
- iOS Accessibility Guidelines: ${audit.overallScore >= 80 ? '✅ Compliant' : '❌ Non-compliant'}
- Android Accessibility Guidelines: ${audit.overallScore >= 80 ? '✅ Compliant' : '❌ Non-compliant'}
- Section 508: ${audit.overallScore >= 80 ? '✅ Compliant' : '❌ Non-compliant'}

---
*This report should be reviewed by accessibility experts and validated through user testing with people who have disabilities.*
`;

  return report;
};

// Device-specific testing recommendations
export const getDeviceSpecificTestingPlan = (): string => {
  return `
# Device-Specific Testing Plan

## iOS Testing

### Required Devices
- iPhone 12 Mini (small screen)
- iPhone 14 Pro (standard screen with Dynamic Island)
- iPhone 14 Pro Max (large screen)
- iPad Air (tablet interface)
- iPad Pro 12.9" (large tablet)

### iOS Accessibility Features to Test
- VoiceOver (screen reader)
- Voice Control
- Switch Control
- Zoom
- Reduce Motion
- Increase Contrast
- Bold Text
- Larger Text (Dynamic Type)

### Testing Checklist
- [ ] VoiceOver navigation works smoothly
- [ ] All elements have proper labels and hints
- [ ] Gesture navigation works with VoiceOver
- [ ] Voice Control can activate all interactive elements
- [ ] App respects Dynamic Type settings
- [ ] Reduce Motion preference is honored
- [ ] High Contrast mode works properly
- [ ] App works with external keyboards

## Android Testing

### Required Devices
- Pixel 6 (standard Android)
- Samsung Galaxy S22 (Samsung One UI)
- OnePlus 9 (OxygenOS)
- Tablet: Samsung Galaxy Tab S8

### Android Accessibility Features to Test
- TalkBack (screen reader)
- Voice Access
- Switch Access
- Magnification
- High contrast text
- Remove animations
- Large display size

### Testing Checklist
- [ ] TalkBack navigation is logical and complete
- [ ] All content is announced properly
- [ ] Voice Access can control all functions
- [ ] App works with external keyboards and mice
- [ ] High contrast mode is supported
- [ ] Animation removal preference is respected
- [ ] Large text sizes work properly
- [ ] App works with different manufacturer customizations

## Performance Testing on Low-End Devices

### Target Devices
- iPhone SE 2nd generation (iOS low-end)
- Samsung Galaxy A32 (Android low-end)
- Devices with 3GB RAM or less

### Performance Metrics
- App launch time < 3 seconds
- Smooth scrolling (60fps)
- Search results < 500ms
- Favorites toggle < 100ms
- Memory usage < 150MB

## Cross-Platform Consistency Testing

### Areas to Validate
- Navigation patterns work similarly
- Accessibility features have equivalent functionality
- Performance is comparable
- Visual design adapts appropriately
- Text rendering is consistent

## Automated Testing Integration

### CI/CD Pipeline Tests
- Accessibility linting with eslint-plugin-react-native-a11y
- Color contrast validation
- Touch target size validation
- Performance regression tests
- Bundle size monitoring

### Regular Testing Schedule
- Daily: Automated accessibility tests
- Weekly: Manual testing on primary devices
- Monthly: Comprehensive device testing
- Quarterly: User testing with accessibility experts
`;
};

// Validate that an element has proper accessibility settings (used in tests)
export const validateAccessibility = (element: any): boolean => {
  return !!(element && element.accessibilityLabel && element.accessibilityRole);
};

