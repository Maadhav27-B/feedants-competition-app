import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export const BottomNavigationBar = ({ activeTab = 'competitions', onTabPress }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { id: 'explore', label: 'Explore', icon: 'search-outline', activeIcon: 'search' },
    { id: 'create', label: '', icon: 'add', isCenter: true },
    { id: 'competitions', label: 'Competitions', icon: 'trophy-outline', activeIcon: 'trophy' },
    { id: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' }
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        if (item.isCenter) {
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.centerButton}
              onPress={() => onTabPress && onTabPress(item.id)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          );
        }

        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => onTabPress && onTabPress(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? item.activeIcon : item.icon}
              size={20}
              color={isActive ? COLORS.primary : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.cardBg,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingHorizontal: SPACING.xs
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '700'
  },
  centerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  }
});
