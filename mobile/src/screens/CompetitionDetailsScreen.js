import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  View,
  Alert,
  StatusBar,
  StyleSheet
} from 'react-native';
import { COLORS } from '../constants/theme';
import { useCompetition } from '../hooks/useCompetition';
import { useAuth } from '../context/AuthContext';

import { CompetitionHeader } from '../components/CompetitionHeader';
import { CompetitionMainCard } from '../components/CompetitionMainCard';
import { OrganizerJudgeCard } from '../components/OrganizerJudgeCard';
import { CountdownBanner } from '../components/CountdownBanner';
import { ImportantDatesGrid } from '../components/ImportantDatesGrid';
import { PreviousWinnersSection } from '../components/PreviousWinnersSection';
import { TabsSection } from '../components/TabsSection';
import { RewardsList } from '../components/RewardsList';
import {
  DisclaimerBanner,
  PaymentInfoCard,
  ReferralCard,
  TestimonialsCard,
  AdBanner
} from '../components/InfoBanners';
import { StickyBottomBar } from '../components/StickyBottomBar';
import { BottomNavigationBar } from '../components/BottomNavigationBar';
import { LoadingView } from '../components/LoadingView';
import { ErrorView } from '../components/ErrorView';

export const CompetitionDetailsScreen = ({ competitionId, onBack, onNavigateToList }) => {
  const { competition, loading, refreshing, actionLoading, error, refresh, register, unregister } =
    useCompetition(competitionId);
  const { isAuthenticated } = useAuth();

  const handleRegister = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in or create an account to register for this competition.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await register();
    if (result.success) {
      Alert.alert('Registration Successful 🎉', result.message || 'You have successfully registered!');
    } else {
      Alert.alert('Registration Failed ❌', result.message || 'Unable to register at this time.');
    }
  };

  const handleUnregister = async () => {
    Alert.alert(
      'Cancel Participation',
      'Are you sure you want to cancel your registration for this competition?',
      [
        { text: 'Keep Registration', style: 'cancel' },
        {
          text: 'Cancel Registration',
          style: 'destructive',
          onPress: async () => {
            const result = await unregister();
            if (result.success) {
              Alert.alert('Cancelled', 'Your registration has been cancelled.');
            } else {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  if (loading && !refreshing) {
    return <LoadingView message="Loading Feedants competition details..." />;
  }

  if (error && !competition) {
    return <ErrorView message={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cardBg} />

      {/* Top Header */}
      <CompetitionHeader onBackPress={onBack || onNavigateToList} />

      {/* Scrollable Competition Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[COLORS.primary]} />}
      >
        {/* Main Card (Title, Badges, Fee, Prize Pool, Spots Left) */}
        <CompetitionMainCard competition={competition} />

        {/* Organizer / Judge Card */}
        <OrganizerJudgeCard organizer={competition?.organizer} />

        {/* Live Countdown Banner */}
        <CountdownBanner targetDate={competition?.registrationEndDate} />

        {/* 2x2 Grid for Key Milestone Dates */}
        <ImportantDatesGrid competition={competition} />

        {/* Previous Winners Video Cards */}
        <PreviousWinnersSection winners={competition?.previousWinners} />

        {/* About, Judging Parameters, Rules & Eligibility Tabs */}
        <TabsSection competition={competition} />

        {/* Prize Pool breakdown per position */}
        <RewardsList rewards={competition?.rewards} />

        {/* Disclaimer Banner */}
        <DisclaimerBanner disclaimer={competition?.disclaimer} />

        {/* Payment & Refund Assurance Card */}
        <PaymentInfoCard />

        {/* Referral Incentive Card */}
        <ReferralCard referralLink={competition?.referralLink} />

        {/* User Testimonials Card */}
        <TestimonialsCard />

        {/* Ad Space Placeholder */}
        <AdBanner />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Sticky Bottom Bar for Action */}
      <StickyBottomBar
        competition={competition}
        onRegisterPress={handleRegister}
        onUnregisterPress={handleUnregister}
        loading={actionLoading}
      />

      {/* App Bottom Navigation Bar */}
      <BottomNavigationBar activeTab="competitions" onTabPress={(tab) => tab !== 'competitions' && onNavigateToList && onNavigateToList()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContainer: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 20
  },
  bottomSpacer: {
    height: 24
  }
});
