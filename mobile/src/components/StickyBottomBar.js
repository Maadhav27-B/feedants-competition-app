import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { COMPETITION_STATUS } from '../constants/status';

export const StickyBottomBar = ({ competition, onRegisterPress, onUnregisterPress, loading = false }) => {
  if (!competition) return null;

  const { status, isFull, entryFee, userParticipation } = competition;
  const isRegistered = userParticipation?.isRegistered;

  const getButtonConfig = () => {
    if (loading) {
      return {
        text: 'Processing...',
        subtext: '',
        disabled: true,
        backgroundColor: COLORS.primary,
        onPress: null
      };
    }

    if (isRegistered) {
      return {
        text: 'Upload Submission',
        subtext: 'Registered',
        disabled: false,
        backgroundColor: COLORS.primary,
        onPress: onUnregisterPress // Allows toggling / unregistering in demo mode
      };
    }

    switch (status) {
      case COMPETITION_STATUS.REGISTRATION_OPEN:
        if (isFull) {
          return {
            text: 'Competition Full',
            subtext: 'All spots booked',
            disabled: true,
            backgroundColor: '#9E9E9E',
            onPress: null
          };
        }
        return {
          text: `Register Now - ₹${entryFee}`,
          subtext: 'Instant Registration',
          disabled: false,
          backgroundColor: COLORS.primary,
          onPress: onRegisterPress
        };

      case COMPETITION_STATUS.FULL:
        return {
          text: 'Competition Full',
          subtext: 'All spots booked',
          disabled: true,
          backgroundColor: '#9E9E9E',
          onPress: null
        };

      case COMPETITION_STATUS.UPCOMING:
        return {
          text: 'Registration Starts Soon',
          subtext: 'Check dates above',
          disabled: true,
          backgroundColor: '#0288D1',
          onPress: null
        };

      case COMPETITION_STATUS.LIVE:
        return {
          text: 'Registration Closed',
          subtext: 'Competition is currently live',
          disabled: true,
          backgroundColor: '#757575',
          onPress: null
        };

      case COMPETITION_STATUS.COMPLETED:
        return {
          text: 'Competition Completed',
          subtext: 'Results announced',
          disabled: true,
          backgroundColor: '#616161',
          onPress: null
        };

      case COMPETITION_STATUS.CANCELLED:
        return {
          text: 'Competition Cancelled',
          subtext: '',
          disabled: true,
          backgroundColor: '#D32F2F',
          onPress: null
        };

      default:
        return {
          text: 'Register Now',
          subtext: '',
          disabled: false,
          backgroundColor: COLORS.primary,
          onPress: onRegisterPress
        };
    }
  };

  const config = getButtonConfig();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: config.backgroundColor }]}
        disabled={config.disabled}
        onPress={config.onPress}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>{config.text}</Text>
            {config.subtext ? <Text style={styles.subText}>{config.subtext}</Text> : null}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContent: {
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  subText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E0F2F1',
    marginTop: 1
  }
});
