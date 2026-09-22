import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { useCountdown } from '../hooks/useCountdown';

export const CountdownBanner = ({ targetDate }) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <View style={[styles.container, styles.expiredContainer]}>
        <Ionicons name="alert-circle-outline" size={18} color="#C62828" />
        <Text style={styles.expiredText}>Registration Closed</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <Ionicons name="hourglass-outline" size={18} color={COLORS.primary} />
        <Text style={styles.label}>Registration closes in</Text>
      </View>

      <Text style={styles.timerText}>
        {days}d : {hours}h : {minutes}m : {seconds}s
      </Text>

      <View style={styles.rightRow}>
        <Ionicons name="timer-outline" size={16} color={COLORS.primary} />
        <Text style={styles.hurryText}>Hurry up!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md
  },
  expiredContainer: {
    backgroundColor: '#FFEBEE',
    justifyContent: 'center'
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 6
  },
  timerText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  hurryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 4
  },
  expiredText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C62828',
    marginLeft: 6
  }
});
