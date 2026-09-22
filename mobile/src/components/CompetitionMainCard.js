import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export const CompetitionMainCard = ({ competition }) => {
  if (!competition) return null;

  const {
    title,
    tags = [],
    prizePool,
    entryFee,
    maximumParticipants = 20,
    currentParticipants = 0,
    remainingSpots = 19,
    userParticipation
  } = competition;

  const isRegistered = userParticipation?.isRegistered;
  const progressPercent = Math.min(100, Math.max(0, (currentParticipants / maximumParticipants) * 100));

  return (
    <View style={styles.card}>
      {/* Top Header Row: Title & Registered Badge */}
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {isRegistered ? (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        ) : (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{competition.status}</Text>
          </View>
        )}
      </View>

      {/* Tags Row */}
      <View style={styles.tagsRow}>
        {tags.map((tag, idx) => (
          <View key={idx} style={styles.tagPill}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Stats & Availability Row */}
      <View style={styles.statsRow}>
        {/* Prize Pool */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Prize Pool</Text>
          <Text style={styles.statValue}>₹ {prizePool?.toLocaleString('en-IN')}</Text>
        </View>

        {/* Entry Fee */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Entry Fee</Text>
          <Text style={styles.statValue}>₹ {entryFee}</Text>
        </View>

        {/* Spots Left & Progress Bar */}
        <View style={styles.availabilityBox}>
          <View style={styles.spotsRow}>
            <Ionicons name="people-outline" size={14} color={COLORS.primary} />
            <Text style={styles.spotsText}>
              {remainingSpots > 0 ? `Only ${remainingSpots} spots left` : 'No spots left'}
            </Text>
          </View>

          {/* Progress Bar Container */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>

          <Text style={styles.bookedText}>
            {currentParticipants} / {maximumParticipants} Booked
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  registeredText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 4
  },
  statusBadge: {
    backgroundColor: '#ECEFF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md
  },
  tagPill: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: SPACING.xs,
    marginBottom: 4
  },
  tagText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight
  },
  statBox: {
    marginRight: SPACING.md
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500'
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2
  },
  availabilityBox: {
    flex: 1,
    alignItems: 'flex-end'
  },
  spotsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  spotsText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 3
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0F2F1',
    borderRadius: 3,
    marginTop: 6,
    marginBottom: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3
  },
  bookedText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500'
  }
});
