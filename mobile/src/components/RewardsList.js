import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export const RewardsList = ({ rewards = [] }) => {
  if (!rewards || rewards.length === 0) return null;

  const getRewardIcon = (position) => {
    switch (position) {
      case 1:
        return <Ionicons name="trophy" size={18} color="#FFD700" />;
      case 2:
        return <Ionicons name="ribbon" size={18} color="#C0C0C0" />;
      case 3:
        return <Ionicons name="ribbon" size={18} color="#CD7F32" />;
      default:
        return <Ionicons name="star-outline" size={16} color={COLORS.primary} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Rewards (All Positions)</Text>

      <View style={styles.rewardsBox}>
        {rewards.map((reward, idx) => (
          <View
            key={idx}
            style={[styles.rewardRow, idx < rewards.length - 1 && styles.borderBottom]}
          >
            <View style={styles.leftRow}>
              {getRewardIcon(reward.position)}
              <Text style={styles.rankText}>{reward.rankText}</Text>
            </View>

            <Text style={styles.amountText}>₹ {reward.prizeAmount}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: SPACING.xs
  },
  rewardsBox: {
    backgroundColor: '#F7FAFC',
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 2
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rankText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary
  }
});
