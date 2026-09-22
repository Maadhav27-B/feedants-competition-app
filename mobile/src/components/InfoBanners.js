import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Clipboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export const DisclaimerBanner = ({ disclaimer }) => {
  return (
    <View style={styles.disclaimerBox}>
      <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
      <Text style={styles.disclaimerText}>
        Disclaimer: {disclaimer || 'Only contributions from paid participants will be considered for judging.'}
      </Text>
    </View>
  );
};

export const PaymentInfoCard = () => {
  return (
    <View style={styles.paymentCard}>
      <View style={styles.paymentLeft}>
        <View style={styles.playCircle}>
          <Ionicons name="play" size={14} color={COLORS.primary} />
        </View>
        <View style={styles.paymentTextCol}>
          <Text style={styles.paymentTitle}>How will you receive prize money?</Text>
          <Text style={styles.paymentSub}>Watch video to know more</Text>
        </View>
      </View>

      <View style={styles.paymentRight}>
        <View style={styles.policyRow}>
          <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textPrimary} />
          <Text style={styles.policyText}>Refund policy</Text>
        </View>

        <View style={[styles.policyRow, { marginTop: 4 }]}>
          <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textPrimary} />
          <Text style={styles.policyText}>Secure payments powered by </Text>
          <Text style={styles.razorpayBrand}>Razorpay</Text>
        </View>
      </View>
    </View>
  );
};

export const ReferralCard = ({ referralLink = 'https://feedants.com/r/referral123' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      Clipboard.setString(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard failed', e);
    }
  };

  return (
    <View style={styles.referralCard}>
      <View style={styles.referralLeft}>
        <Ionicons name="megaphone-outline" size={24} color={COLORS.primary} />
        <View style={styles.referralTextCol}>
          <Text style={styles.referralTitle}>Refer & Earn more discount</Text>

          <View style={styles.linkInputRow}>
            <Text style={styles.linkText} numberOfLines={1}>
              {referralLink}
            </Text>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              <Text style={styles.copyBtnText}>{copied ? 'Copied!' : 'Copy Link'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.referralRight}>
        <TouchableOpacity style={styles.referNowBtn}>
          <Text style={styles.referNowText}>Refer Now</Text>
        </TouchableOpacity>
        <Text style={styles.referSub}>You earn ₹10 for every signup</Text>
      </View>
    </View>
  );
};

export const TestimonialsCard = () => {
  return (
    <TouchableOpacity style={styles.testimonialsCard} activeOpacity={0.8}>
      <Ionicons name="chatbubbles-outline" size={20} color={COLORS.primary} />
      <View style={styles.testimonialsTextCol}>
        <Text style={styles.testimonialsTitle}>Hear From Our Users</Text>
        <Text style={styles.testimonialsSub}>See what participants say about Feedants</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
};

export const AdBanner = () => {
  return (
    <View style={styles.adBanner}>
      <Ionicons name="megaphone" size={16} color={COLORS.textMuted} />
      <Text style={styles.adText}>Ad Here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    borderRadius: 8,
    padding: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md
  },
  disclaimerText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginLeft: 6,
    flex: 1
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  playCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paymentTextCol: {
    marginLeft: SPACING.sm,
    flex: 1
  },
  paymentTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  paymentSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1
  },
  paymentRight: {
    alignItems: 'flex-end',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.borderLight,
    paddingLeft: SPACING.sm
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  policyText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 3
  },
  razorpayBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0C2340',
    fontStyle: 'italic'
  },
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md
  },
  referralLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  referralTextCol: {
    marginLeft: SPACING.sm,
    flex: 1
  },
  referralTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  linkInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#C8E6C9'
  },
  linkText: {
    fontSize: 10,
    color: COLORS.textMuted,
    flex: 1
  },
  copyBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0'
  },
  copyBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary
  },
  referralRight: {
    alignItems: 'flex-end'
  },
  referNowBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8
  },
  referNowText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  referSub: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 4
  },
  testimonialsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  testimonialsTextCol: {
    marginLeft: SPACING.md,
    flex: 1
  },
  testimonialsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  testimonialsSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1
  },
  adBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed'
  },
  adText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginLeft: 6
  }
});
