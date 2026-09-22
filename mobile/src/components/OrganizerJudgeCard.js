import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export const OrganizerJudgeCard = ({ organizer }) => {
  if (!organizer) return null;

  const {
    name = 'Manju Dubey',
    role = 'Judge',
    title = 'Professional Kathak Dancer',
    experience = '12+ Years of Experience',
    image = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  } = organizer;

  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.avatar} />

      <View style={styles.infoContainer}>
        <Text style={styles.roleText}>{role}</Text>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.subText}>{title}</Text>
        <Text style={styles.subText}>{experience}</Text>
      </View>

      <TouchableOpacity style={styles.videoButton} activeOpacity={0.8}>
        <View style={styles.playIconCircle}>
          <Ionicons name="play" size={14} color={COLORS.primary} />
        </View>
        <Text style={styles.videoText}>Intro Video</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.primaryLight
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.md
  },
  roleText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  nameText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 1
  },
  subText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1
  },
  videoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs
  },
  playIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 4
  }
});
