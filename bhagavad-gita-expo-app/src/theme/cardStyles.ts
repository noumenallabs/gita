import { colors, radius } from './colors';
import { StyleSheet } from 'react-native';

export function cardStyle(opts?: { glow?: boolean }) {
  const base: any = {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
  };

  if (opts?.glow) {
    base.shadowColor = colors.accent;
    base.shadowOffset = { width: 0, height: 0 };
    base.shadowOpacity = 0.15;
    base.shadowRadius = 40;
    base.elevation = 0;
  }

  return base;
}

export function badgeStyle() {
  return {
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(92,184,150,0.12)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  };
}

export const darkStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 24,
  },
});
