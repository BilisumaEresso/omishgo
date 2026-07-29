import React, { useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
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

export default function OrderProgressMap({ order }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const mapRef = useRef(null);
  const fittedRef = useRef(false);

  const isCancelled = order?.status === 'cancelled';

  // Origin: Product location
  const originLocation = order?.productId?.location;
  const rawOriginCoords = useMemo(() => getCoordinatesForLocation(originLocation), [originLocation?.region, originLocation?.zone, originLocation?.wereda]);

  // Destination: Buyer location
  const buyerLocation = order?.buyerId?.location;
  const rawDestCoords = useMemo(() => getCoordinatesForLocation(buyerLocation), [buyerLocation?.region, buyerLocation?.zone, buyerLocation?.wereda]);

  // Prevent zero-distance overlap if both locations resolve identically
  const { originCoords, destinationCoords } = useMemo(() => {
    let orig = { ...rawOriginCoords };
    let dest = { ...rawDestCoords };
    const latDiff = Math.abs(orig.latitude - dest.latitude);
    const lngDiff = Math.abs(orig.longitude - dest.longitude);

    if (latDiff < 0.002 && lngDiff < 0.002) {
      dest = {
        latitude: dest.latitude + 0.015,
        longitude: dest.longitude + 0.015,
      };
    }
    return { originCoords: orig, destinationCoords: dest };
  }, [rawOriginCoords, rawDestCoords]);

  const progressFraction = getProgressFraction(order?.status);

  // Position along polyline
  const progressCoords = useMemo(() => {
    if (isCancelled) return null;
    return {
      latitude: originCoords.latitude + progressFraction * (destinationCoords.latitude - originCoords.latitude),
      longitude: originCoords.longitude + progressFraction * (destinationCoords.longitude - originCoords.longitude),
    };
  }, [isCancelled, originCoords, destinationCoords, progressFraction]);

  const fitMap = () => {
    if (mapRef.current && originCoords && destinationCoords) {
      try {
        mapRef.current.fitToCoordinates([originCoords, destinationCoords], {
          edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
          animated: false,
        });
        fittedRef.current = true;
      } catch (_) {}
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fitMap();
    }, 200);
    return () => clearTimeout(timer);
  }, [order?._id, order?.status, originCoords.latitude, originCoords.longitude, destinationCoords.latitude, destinationCoords.longitude]);

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

  const initialRegion = useMemo(() => {
    const centerLat = (originCoords.latitude + destinationCoords.latitude) / 2;
    const centerLng = (originCoords.longitude + destinationCoords.longitude) / 2;
    const latDelta = Math.max(Math.abs(originCoords.latitude - destinationCoords.latitude) * 1.6, 0.08);
    const lngDelta = Math.max(Math.abs(originCoords.longitude - destinationCoords.longitude) * 1.6, 0.08);
    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  }, [originCoords, destinationCoords]);

  return (
    <View style={[styles.cardContainer, { backgroundColor: surfaceColor }]}>
      {/* Map View */}
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          onMapReady={fitMap}
        >
          {/* Origin Marker (Farmer / Product location) */}
          <Marker coordinate={originCoords} title={originName} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.markerBadge, { backgroundColor: '#2E7D32' }]}>
              <Ionicons name="leaf" size={14} color="#FFFFFF" />
            </View>
          </Marker>

          {/* Destination Marker (Buyer location) */}
          <Marker coordinate={destinationCoords} title={destName} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.markerBadge, { backgroundColor: '#1565C0' }]}>
              <Ionicons name="location" size={14} color="#FFFFFF" />
            </View>
          </Marker>

          {/* Connecting Polyline */}
          <Polyline
            coordinates={[originCoords, destinationCoords]}
            strokeColor={isCancelled ? '#94A3B8' : primaryColor}
            strokeWidth={3}
            lineDashPattern={isCancelled ? [6, 4] : undefined}
          />

          {/* Progress Marker along polyline */}
          {!isCancelled && progressCoords && (
            <Marker coordinate={progressCoords} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.progressDotOuter}>
                <View style={[styles.progressDotInner, { backgroundColor: primaryColor }]} />
              </View>
            </Marker>
          )}
        </MapView>

        {isCancelled && (
          <View style={styles.cancelledOverlay}>
            <Ionicons name="close-circle" size={18} color="#DC2626" />
            <AppText style={styles.cancelledOverlayText}>
              {t('orderDetail.orderCancelledMap', { defaultValue: 'Order Cancelled' })}
            </AppText>
          </View>
        )}
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
  mapWrapper: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  progressDotOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(21, 101, 192, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cancelledOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 4,
  },
  cancelledOverlayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
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
});
