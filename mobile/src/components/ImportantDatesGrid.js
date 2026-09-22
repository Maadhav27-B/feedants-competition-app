import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { format } from 'date-fns';

export const ImportantDatesGrid = ({ competition }) => {
  if (!competition) return null;

  const formatDateString = (dateInput, fallbackString) => {
    if (!dateInput) return fallbackString;
    try {
      const d = new Date(dateInput);
      return {
        date: format(d, 'd MMM yy'),
        time: format(d, 'hh:mm a')
      };
    } catch (e) {
      return fallbackString;
    }
  };

  const regBefore = formatDateString(competition.registrationEndDate, { date: '10 Aug 26', time: '11:50 PM' });
  const subStarts = formatDateString(competition.submissionStartDate, { date: '6 Aug 26', time: '04:00 AM' });
  const subEnds = formatDateString(competition.submissionEndDate, { date: '30 Aug 26', time: '11:55 PM' });
  const resultDate = formatDateString(competition.resultDate, { date: '1 Sept 26', time: '11:50 PM' });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Important Dates</Text>

      <View style={styles.card}>
        <View style={styles.grid}>
          {/* Item 1: Register Before */}
          <View style={[styles.gridItem, styles.borderRight, styles.borderBottom]}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Register Before</Text>
              <Text style={styles.dateValue}>{regBefore.date}</Text>
              <Text style={styles.timeValue}>{regBefore.time}</Text>
            </View>
          </View>

          {/* Item 2: Submission Starts */}
          <View style={[styles.gridItem, styles.borderBottom]}>
            <View style={styles.iconCircle}>
              <Ionicons name="paper-plane-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Submission Starts</Text>
              <Text style={styles.dateValue}>{subStarts.date}</Text>
              <Text style={styles.timeValue}>{subStarts.time}</Text>
            </View>
          </View>

          {/* Item 3: Submission Ends */}
          <View style={[styles.gridItem, styles.borderRight]}>
            <View style={styles.iconCircle}>
              <Ionicons name="cloud-upload-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Submission Ends</Text>
              <Text style={styles.dateValue}>{subEnds.date}</Text>
              <Text style={styles.timeValue}>{subEnds.time}</Text>
            </View>
          </View>

          {/* Item 4: Result Date */}
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="trophy-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Result Date</Text>
              <Text style={styles.dateValue}>{resultDate.date}</Text>
              <Text style={styles.timeValue}>{resultDate.time}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  gridItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: COLORS.borderLight
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    marginLeft: SPACING.sm,
    flex: 1
  },
  label: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2
  },
  timeValue: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 1
  }
});
