import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export const TabsSection = ({ competition }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [expanded, setExpanded] = useState(false);

  if (!competition) return null;

  const {
    description = '',
    rules = [],
    eligibility = [],
    judgingParameters = []
  } = competition;

  return (
    <View style={styles.container}>
      {/* Tab Header Row */}
      <View style={styles.tabHeaderRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'about' && styles.tabButtonActive]}
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
            About Competition
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'judging' && styles.tabButtonActive]}
          onPress={() => setActiveTab('judging')}
        >
          <Text style={[styles.tabText, activeTab === 'judging' && styles.tabTextActive]}>
            Judging Parameters
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'rules' && styles.tabButtonActive]}
          onPress={() => setActiveTab('rules')}
        >
          <Text style={[styles.tabText, activeTab === 'rules' && styles.tabTextActive]}>
            Rules & Eligibility
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content Box */}
      <View style={styles.tabContentBox}>
        {activeTab === 'about' && (
          <View>
            <Text style={styles.descriptionText} numberOfLines={expanded ? undefined : 3}>
              {description}
            </Text>
            <TouchableOpacity
              style={styles.viewMoreRow}
              onPress={() => setExpanded(!expanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewMoreText}>{expanded ? 'View less' : 'View more'}</Text>
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'judging' && (
          <View>
            {judgingParameters && judgingParameters.length > 0 ? (
              judgingParameters.map((item, idx) => (
                <View key={idx} style={styles.parameterItem}>
                  <Text style={styles.paramTitle}>• {item.title}</Text>
                  <Text style={styles.paramDesc}>{item.description}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.descriptionText}>
                Entries will be judged based on technique, rhythm, and overall performance.
              </Text>
            )}
          </View>
        )}

        {activeTab === 'rules' && (
          <View>
            <Text style={styles.subHeader}>Rules:</Text>
            {rules.map((rule, idx) => (
              <Text key={idx} style={styles.bulletItem}>
                • {rule}
              </Text>
            ))}

            <Text style={[styles.subHeader, { marginTop: SPACING.md }]}>Eligibility:</Text>
            {eligibility.map((item, idx) => (
              <Text key={idx} style={styles.bulletItem}>
                • {item}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg
  },
  tabHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  tabButton: {
    paddingVertical: SPACING.sm + 2,
    marginRight: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabButtonActive: {
    borderBottomColor: COLORS.primary
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '800'
  },
  tabContentBox: {
    paddingVertical: SPACING.md
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary
  },
  viewMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: SPACING.xs
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 2
  },
  parameterItem: {
    marginBottom: SPACING.sm
  },
  paramTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  paramDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 12,
    marginTop: 2
  },
  subHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  bulletItem: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    marginBottom: 4
  }
});
