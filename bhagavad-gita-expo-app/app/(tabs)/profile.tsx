import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, spacing } from '../../src/theme/colors';
import { fonts, fontSize } from '../../src/theme/typography';
import { cardStyle } from '../../src/theme/cardStyles';
import { SacredBackground } from '../../src/components/SacredBackground';

const SETTINGS = [
  { icon: 'moon-waning-crescent', title: 'Appearance', value: 'Dark' },
  { icon: 'bell-outline', title: 'Notifications', value: 'On' },
  { icon: 'earth', title: 'Language', value: 'English' },
  { icon: 'help-circle-outline', title: 'Help & Support', value: '' },
  { icon: 'shield-outline', title: 'Privacy', value: '' },
];

export default function ProfileScreen() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <View style={styles.screen}>
      <SacredBackground />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={styles.screenTitle}>Profile</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View style={cardStyle()}>
              <View style={styles.userCard}>
                <View style={styles.avatar}>
                  <MaterialCommunityIcons name="account" size={28} color={colors.accent} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{isSignedIn ? 'Guest User' : 'Sign In'}</Text>
                  <Text style={styles.userEmail}>{isSignedIn ? 'Reading the Gita daily' : 'Save your progress'}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsList}>
              {SETTINGS.map((s) => (
                <Pressable key={s.title} style={styles.settingRow}>
                  <MaterialCommunityIcons name={s.icon as any} size={20} color={colors.textMuted} />
                  <Text style={styles.settingTitle}>{s.title}</Text>
                  <View style={styles.settingRight}>
                    {s.value ? <Text style={styles.settingValue}>{s.value}</Text> : null}
                    <MaterialCommunityIcons name="chevron-right" size={16} color={colors.textMuted} />
                  </View>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.authSection}>
            {isSignedIn ? (
              <Pressable style={styles.signOutBtn} onPress={() => setIsSignedIn(false)}>
                <MaterialCommunityIcons name="logout" size={18} color={colors.red} />
                <Text style={styles.signOutText}>Sign Out</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.signInBtn} onPress={() => setShowSignIn(true)}>
                <Text style={styles.signInText}>Sign In</Text>
              </Pressable>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={showSignIn} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome</Text>
            <Text style={styles.modalSubtitle}>Sign in to save your progress</Text>
            <Pressable style={styles.primaryBtn} onPress={() => { setIsSignedIn(true); setShowSignIn(false); }}>
              <Text style={styles.primaryBtnText}>Continue as Guest</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={() => setShowSignIn(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: spacing.lg, paddingBottom: 100 },
  screenTitle: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.heading, color: colors.text, paddingHorizontal: spacing.lg, marginBottom: 20 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.xl, gap: 14 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  userInfo: { flex: 1 },
  userName: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.body, color: colors.text },
  userEmail: { fontFamily: fonts.body, fontSize: fontSize.small, color: colors.textMuted, marginTop: 1 },
  sectionTitle: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.body, color: colors.text, paddingHorizontal: spacing.lg, marginTop: 28, marginBottom: 14 },
  settingsList: { paddingHorizontal: spacing.lg, gap: 8 },
  settingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: 14, gap: 12 },
  settingTitle: { flex: 1, fontFamily: fonts.body, fontSize: fontSize.body, color: colors.text },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  settingValue: { fontFamily: fonts.body, fontSize: fontSize.small, color: colors.textMuted },
  authSection: { paddingHorizontal: spacing.lg, marginTop: 32 },
  signInBtn: { backgroundColor: colors.accent, borderRadius: radius.xl, paddingVertical: 16, alignItems: 'center' },
  signInText: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.body, color: '#fff' },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.redSoft, borderRadius: radius.xl, paddingVertical: 16, gap: 8 },
  signOutText: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.body, color: colors.red },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', alignItems: 'center', padding: 32 },
  modalContent: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 24, width: '100%' },
  modalTitle: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.heading, color: colors.text, textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontFamily: fonts.body, fontSize: fontSize.body, color: colors.textMuted, textAlign: 'center', marginBottom: 24 },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: radius.xl, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.body, color: '#fff' },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelText: { fontFamily: fonts.body, fontSize: fontSize.body, color: colors.textMuted },
});
