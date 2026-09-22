import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export const PreviousWinnersSection = ({ winners = [] }) => {
  if (!winners || winners.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Previous Winners</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
        {winners.map((winner, idx) => (
          <TouchableOpacity key={idx} style={styles.winnerCard} activeOpacity={0.85}>
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: winner.image }} style={styles.thumbnail} />
              <View style={styles.playOverlay}>
                <Ionicons name="play" size={14} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.winnerInfo}>
              <Text style={styles.winnerName} numberOfLines={1}>
                {winner.name}
              </Text>
              <Text style={styles.rankBadge}>{winner.rankText}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xs
  },
  scrollList: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs
  },
  winnerCard: {
    width: 120,
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    marginRight: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2
  },
  thumbnailContainer: {
    width: '100%',
    height: 90,
    position: 'relative'
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  playOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF'
  },
  winnerInfo: {
    padding: SPACING.xs + 2
  },
  winnerName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  rankBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 2
  }
});
