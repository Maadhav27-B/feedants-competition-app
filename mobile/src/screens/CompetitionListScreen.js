import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { competitionService } from '../services/apiService';
import { LoadingView } from '../components/LoadingView';
import { ErrorView } from '../components/ErrorView';
import { BottomNavigationBar } from '../components/BottomNavigationBar';
import { useAuth } from '../context/AuthContext';

export const CompetitionListScreen = ({ onSelectCompetition, onOpenLogin }) => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();

  const fetchCompetitions = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await competitionService.getCompetitions();
      if (response.success) {
        setCompetitions(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Unable to fetch competitions. Make sure the backend server is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const renderItem = ({ item }) => {
    const isRegistered = item.userParticipation?.isRegistered;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onSelectCompetition(item._id)}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.bannerImage }} style={styles.bannerImage} />

        <View style={styles.contentBox}>
          <View style={styles.headerRow}>
            <Text style={styles.categoryBadge}>{item.category.toUpperCase()}</Text>

            {isRegistered ? (
              <View style={styles.registeredBadge}>
                <Ionicons name="checkmark-circle" size={12} color={COLORS.primary} />
                <Text style={styles.registeredText}>Registered</Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.footerRow}>
            <View>
              <Text style={styles.metaLabel}>Prize Pool</Text>
              <Text style={styles.prizeValue}>₹ {item.prizePool?.toLocaleString('en-IN')}</Text>
            </View>

            <View>
              <Text style={styles.metaLabel}>Entry Fee</Text>
              <Text style={styles.feeValue}>₹ {item.entryFee}</Text>
            </View>

            <View style={styles.spotsBox}>
              <Text style={styles.metaLabel}>Remaining Spots</Text>
              <Text style={styles.spotsValue}>
                {item.remainingSpots} / {item.maximumParticipants}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'REGISTRATION_OPEN':
        return { backgroundColor: '#E0F2F1' };
      case 'FULL':
        return { backgroundColor: '#FFEBEE' };
      case 'UPCOMING':
        return { backgroundColor: '#E1F5FE' };
      default:
        return { backgroundColor: '#ECEFF1' };
    }
  };

  if (loading && !refreshing) {
    return <LoadingView message="Loading competitions..." />;
  }

  if (error && competitions.length === 0) {
    return <ErrorView message={error} onRetry={() => fetchCompetitions(true)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header bar */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.brandTitle}>Feedants</Text>
          <Text style={styles.subTitle}>Explore Competitions</Text>
        </View>

        {isAuthenticated ? (
          <TouchableOpacity style={styles.userProfileBtn} onPress={logout}>
            <Text style={styles.userInitial}>{user?.name?.charAt(0) || 'U'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={onOpenLogin}>
            <Text style={styles.loginBtnText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={competitions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchCompetitions(true)} colors={[COLORS.primary]} />
        }
      />

      <BottomNavigationBar activeTab="competitions" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary
  },
  subTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8
  },
  loginBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  userProfileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  userInitial: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  listContainer: {
    padding: SPACING.lg
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  bannerImage: {
    width: '100%',
    height: 130
  },
  contentBox: {
    padding: SPACING.md
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  registeredText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 3
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight
  },
  metaLabel: {
    fontSize: 10,
    color: COLORS.textMuted
  },
  prizeValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 1
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 1
  },
  spotsBox: {
    alignItems: 'flex-end'
  },
  spotsValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 1
  }
});
