import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import {
  useTheme,
  useAccessibility,
  useResponsive,
  ThemeMode,
  ThemeModeValue,
} from '../context/ResponsiveContext';
import { FontSizePreference, FontSizePreferenceValue } from '../utils/accessibility';
import { getAccessibilityProps, announceAction } from '../utils/accessibility';

export interface AccessibilitySettingsProps {
  onClose?: () => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ onClose }) => {
  const theme = useTheme();
  const { state, actions } = useResponsive();
  const {
    fontSizePreference,
    isScreenReaderActive,
    reduceMotion,
    isHighContrast,
    setFontSizePreference,
    setReduceMotion,
    setHighContrast,
  } = useAccessibility();

  const handleThemeChange = (mode: ThemeModeValue) => {
    actions.setThemeMode(mode);
    announceAction(`Theme changed to ${mode}`);
  };

  const handleFontSizeChange = (size: FontSizePreferenceValue) => {
    setFontSizePreference(size);
    announceAction(`Font size changed to ${size}`);
  };

  const handleHighContrastToggle = (enabled: boolean) => {
    setHighContrast(enabled);
    announceAction(enabled ? 'High contrast enabled' : 'High contrast disabled');
  };

  const handleReduceMotionToggle = (enabled: boolean) => {
    setReduceMotion(enabled);
    announceAction(enabled ? 'Reduce motion enabled' : 'Reduce motion disabled');
  };

  const handleResetToDefaults = () => {
    actions.resetToDefaults();
    announceAction('Settings reset to defaults');
  };

  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Accessibility Settings</Text>
        {onClose && (
          <Pressable
            onPress={onClose}
            style={styles.closeButton}
            {...getAccessibilityProps('Close settings', 'Close accessibility settings', 'button')}
          >
            <Ionicons name="close" size={24} color={theme.colors.gray[600]} />
          </Pressable>
        )}
      </View>

      {/* Theme Settings */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <Text style={styles.sectionDescription}>Choose your preferred color scheme</Text>

        <View style={styles.optionGroup}>
          {Object.values(ThemeMode).map(mode => (
            <Pressable
              key={mode}
              onPress={() => handleThemeChange(mode)}
              style={[styles.option, state.themeMode === mode && styles.optionSelected]}
              {...getAccessibilityProps(`${mode} theme`, `Switch to ${mode} theme`, 'button', {
                selected: state.themeMode === mode,
              })}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionTitle,
                    state.themeMode === mode && styles.optionTitleSelected,
                  ]}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    state.themeMode === mode && styles.optionDescriptionSelected,
                  ]}
                >
                  {mode === ThemeMode.LIGHT && 'Light background with dark text'}
                  {mode === ThemeMode.DARK && 'Dark background with light text'}
                  {mode === ThemeMode.SYSTEM && 'Follow system preference'}
                </Text>
              </View>
              {state.themeMode === mode && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary[500]} />
              )}
            </Pressable>
          ))}
        </View>
      </Card>

      {/* Font Size Settings */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Font Size</Text>
        <Text style={styles.sectionDescription}>Adjust text size for better readability</Text>

        <View style={styles.optionGroup}>
          {Object.values(FontSizePreference).map(size => (
            <Pressable
              key={size}
              onPress={() => handleFontSizeChange(size)}
              style={[styles.option, fontSizePreference === size && styles.optionSelected]}
              {...getAccessibilityProps(
                `${size} font size`,
                `Change font size to ${size}`,
                'button',
                { selected: fontSizePreference === size }
              )}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionTitle,
                    fontSizePreference === size && styles.optionTitleSelected,
                  ]}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1).replace('_', ' ')}
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    fontSizePreference === size && styles.optionDescriptionSelected,
                    {
                      fontSize:
                        size === FontSizePreference.SMALL
                          ? 12
                          : size === FontSizePreference.MEDIUM
                            ? 14
                            : size === FontSizePreference.LARGE
                              ? 16
                              : 18,
                    },
                  ]}
                >
                  Sample text at this size
                </Text>
              </View>
              {fontSizePreference === size && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary[500]} />
              )}
            </Pressable>
          ))}
        </View>
      </Card>

      {/* Accessibility Toggles */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Visual Accessibility</Text>

        <View style={styles.toggleGroup}>
          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleTitle}>High Contrast</Text>
              <Text style={styles.toggleDescription}>Increase contrast for better visibility</Text>
            </View>
            <Switch
              value={isHighContrast}
              onValueChange={handleHighContrastToggle}
              trackColor={{
                false: theme.colors.gray[300],
                true: theme.colors.primary[500],
              }}
              thumbColor={isHighContrast ? theme.colors.primary[600] : theme.colors.gray[50]}
              {...getAccessibilityProps(
                'High contrast toggle',
                isHighContrast ? 'Disable high contrast' : 'Enable high contrast',
                'switch',
                { selected: isHighContrast }
              )}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleTitle}>Reduce Motion</Text>
              <Text style={styles.toggleDescription}>Minimize animations and transitions</Text>
            </View>
            <Switch
              value={reduceMotion}
              onValueChange={handleReduceMotionToggle}
              trackColor={{
                false: theme.colors.gray[300],
                true: theme.colors.primary[500],
              }}
              thumbColor={reduceMotion ? theme.colors.primary[600] : theme.colors.gray[50]}
              {...getAccessibilityProps(
                'Reduce motion toggle',
                reduceMotion ? 'Enable animations' : 'Reduce animations',
                'switch',
                { selected: reduceMotion }
              )}
            />
          </View>
        </View>
      </Card>

      {/* Screen Reader Info */}
      {isScreenReaderActive && (
        <Card style={styles.section}>
          <View style={styles.infoHeader}>
            <Ionicons name="accessibility" size={24} color={theme.colors.primary[600]} />
            <Text style={styles.sectionTitle}>Screen Reader Active</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Screen reader detected. The app is optimized for voice navigation with proper labels and
            announcements for Sanskrit content.
          </Text>
        </Card>
      )}

      {/* Reset Button */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Reset Settings</Text>
        <Text style={styles.sectionDescription}>
          Restore all accessibility settings to their default values
        </Text>
        <Button
          title="Reset to Defaults"
          onPress={handleResetToDefaults}
          variant="secondary"
          style={styles.resetButton}
        />
      </Card>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.gray[50],
    },
    content: {
      paddingBottom: theme.spacing.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.gray[800],
    },
    closeButton: {
      padding: theme.spacing.xs,
      minWidth: theme.touchTargets.medium,
      minHeight: theme.touchTargets.medium,
      alignItems: 'center',
      justifyContent: 'center',
    },
    section: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.gray[800],
      marginBottom: theme.spacing.xs,
    },
    sectionDescription: {
      ...theme.typography.body2,
      color: theme.colors.gray[600],
      marginBottom: theme.spacing.md,
    },
    optionGroup: {
      gap: theme.spacing.xs,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.gray[50],
      borderWidth: 2,
      borderColor: 'transparent',
      minHeight: theme.touchTargets.large,
    },
    optionSelected: {
      backgroundColor: theme.colors.primary[50],
      borderColor: theme.colors.primary[200],
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      ...theme.typography.body1,
      color: theme.colors.gray[800],
      marginBottom: 4,
    },
    optionTitleSelected: {
      color: theme.colors.primary[700],
    },
    optionDescription: {
      ...theme.typography.body2,
      color: theme.colors.gray[600],
    },
    optionDescriptionSelected: {
      color: theme.colors.primary[600],
    },
    toggleGroup: {
      gap: theme.spacing.md,
    },
    toggleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
    },
    toggleContent: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    toggleTitle: {
      ...theme.typography.body1,
      color: theme.colors.gray[800],
      marginBottom: 4,
    },
    toggleDescription: {
      ...theme.typography.body2,
      color: theme.colors.gray[600],
    },
    infoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    resetButton: {
      marginTop: theme.spacing.md,
      alignSelf: 'flex-start',
    },
    bottomSpacing: {
      height: theme.spacing.xl,
    },
  });
