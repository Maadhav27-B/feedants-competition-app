import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export const CompetitionHeader = ({ onBackPress }) => {
  const [language, setLanguage] = useState('ENG');

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        <Text style={styles.backText}>Go back</Text>
      </TouchableOpacity>

      <View style={styles.langToggleContainer}>
        <TouchableOpacity
          style={[styles.langPill, language === 'ENG' && styles.langPillActive]}
          onPress={() => setLanguage('ENG')}
        >
          <Text style={[styles.langText, language === 'ENG' && styles.langTextActive]}>ENG</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langPill, language === 'HINDI' && styles.langPillActive]}
          onPress={() => setLanguage('HINDI')}
        >
          <Text style={[styles.langText, language === 'HINDI' && styles.langTextActive]}>हिंदी</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardBg
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs
  },
  langToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#004D40',
    borderRadius: 16,
    padding: 2
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14
  },
  langPillActive: {
    backgroundColor: '#00796B'
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B2DFDB'
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  }
});
