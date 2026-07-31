import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import { useTheme } from '../../hooks/useTheme';
import { getCoordinatesForLocation } from '../../constants/geocoding';

function getProgressFraction(status) {
  switch (status) {
    case 'confirmed':
      return 0.33;
    case 'in_transit':
      return 0.66;
    case 'delivered':
    case 'completed':
      return 1.0;
    case 'pending':
    default:
      return 0.0;
  }
}

export default function OrderProgressMapWeb({ order }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const isCancelled = order?.status === 'cancelled';

  const originLocation = order?.productId?.location;
  const buyerLocation = order?.buyerId?.location;

  const progressFraction = getProgressFraction(order?.status);

  const originName = originLocation?.wereda
    ? `${originLocation.wereda}, ${originLocation.zone || originLocation.region}`
    : originLocation?.zone
    ? `${originLocation.zone}, ${originLocation.region}`
    : t('orderDetail.originLabel', { defaultValue: 'Harvest Origin' });

  const destName = buyerLocation?.wereda
    ? `${buyerLocation.wereda}, ${buyerLocation.zone || buyerLocation.region}`
    : buyerLocation?.zone
    ? `${buyerLocation.zone}, ${buyerLocation.region}`
    : t('orderDetail.destinationLabel', { defaultValue: 'Buyer Destination' });

  const primaryColor = theme?.colors?.primary || '#1565C0';
  const surfaceColor = theme?.colors?.surface || '#FFFFFF';
  const textPrimary = theme?.colors?.textPrimary || '#0F172A';
  const textSecondary = theme?.colors?.textSecondary || '#64748B';

  return (
    <View style={[styles.cardContainer, { backgroundColor: surfaceColor }]}>
      <View style={styles.fallbackWrapper}>
        <View style={styles.fallbackPointsRow}>
          <View style={styles.fallbackPointItem}>
            <View style={[styles.markerBadge, { backgroundColor: '#2E7D32' }]}>
              <Ionicons name="leaf" size={14} color="#FFFFFF" />
            </View>
            <AppText style={[styles.fallbackPointName, { color: textPrimary }]}>{originName}</AppText>
          </View>
          <Ionicons name="arrow-forward" size={16} color="#94A3B8" />
          <View style={styles.fallbackPointItem}>
            <View style={[styles.markerBadge, { backgroundColor: '#1565C0' }]}>
              <Ionicons name="location" size={14} color="#FFFFFF" />
            </View>
            <AppText style={[styles.fallbackPointName, { color: textPrimary }]}>{destName}</AppText>
          </View>
        </View>

        {/* Visual Stepper Bar */}
        <View style={styles.fallbackTrackContainer}>
          <View style={[styles.fallbackTrackLine, { backgroundColor: isCancelled ? '#FECACA' : '#E2E8F0' }]}>
            {!isCancelled && (
              <View
                style={[
                  styles.fallbackTrackFill,
                  { backgroundColor: primaryColor, width: `${Math.round(progressFraction * 100)}%` },
                ]}
              />
            )}
          </View>
        </View>
      </View>

      {/* Honest Labels */}
      <View style={styles.labelSection}>
        <AppText style={[styles.primaryLabel, { color: textPrimary }]}>
          {t('orderDetail.orderProgress', { defaultValue: 'Order progress — based on delivery status' })}
        </AppText>
        <AppText style={[styles.secondaryLabel, { color: textSecondary }]}>
          {t('orderDetail.liveTrackingComingSoon', { defaultValue: 'Live tracking: coming soon' })}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  markerBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelSection: {
    padding: 14,
    alignItems: 'center',
  },
  primaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  secondaryLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  fallbackWrapper: {
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  fallbackPointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fallbackPointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  fallbackPointName: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  fallbackTrackContainer: {
    height: 6,
    width: '100%',
    justifyContent: 'center',
    marginVertical: 4,
  },
  fallbackTrackLine: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  fallbackTrackFill: {
    height: '100%',
    borderRadius: 2,
  },
});
