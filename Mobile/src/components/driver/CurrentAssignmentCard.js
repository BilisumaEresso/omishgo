import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

const MAP_IMAGE =
  "https://images.unsplash.com/vector-1739803880008-09056660fbc7?w=600&auto=format";

export default function CurrentAssignmentCard({ assignmentState, onComplete }) {
  const { theme } = useTheme();
  const isCompleted = assignmentState === "Completed";
  const statusColor = isCompleted ? theme.colors.success : theme.colors.primary;

  return (
    <View style={styles.section}>
      <AppText
        variant="headingSm"
        style={{ color: theme.colors.textPrimary, marginBottom: 12 }}
      >
        Current Assignment
      </AppText>
      <AppCard style={styles.card}>
        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: theme.colors.surface, borderColor: statusColor },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <AppText
            variant="caption"
            style={{ color: statusColor, fontWeight: "bold" }}
          >
            {assignmentState}
          </AppText>
        </View>

        {/* Map Image */}
        <ImageBackground
          source={{ uri: MAP_IMAGE }}
          style={styles.mapImage}
          imageStyle={{ borderRadius: 16 }}
        >
          <View style={styles.mapOverlay} />
        </ImageBackground>

        {/* Order ID */}
        <View style={styles.orderRow}>
          <View
            style={[
              styles.orderIcon,
              { backgroundColor: theme.colors.primaryLight },
            ]}
          >
            <Ionicons
              name="navigate-outline"
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View>
            <AppText
              variant="caption"
              style={{ color: theme.colors.textSecondary }}
            >
              Order ID
            </AppText>
            <AppText
              variant="bodyMd"
              style={{ fontWeight: "bold", color: theme.colors.textPrimary }}
            >
              #TR-8492
            </AppText>
          </View>
        </View>

        {/* Cargo Details */}
        <View>
          <AppText
            variant="caption"
            style={{ color: theme.colors.textSecondary }}
          >
            Cargo Details
          </AppText>
          <AppText
            variant="headingSm"
            style={{ color: theme.colors.textPrimary }}
          >
            15 Quintals Premium Teff
          </AppText>
        </View>

        {/* Route Timeline */}
        <View style={styles.timeline}>
          <View style={styles.timelineLine} />
          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDot,
                { backgroundColor: theme.colors.primary },
              ]}
            />
            <View>
              <AppText
                variant="bodyMd"
                style={{ fontWeight: "bold", color: theme.colors.textPrimary }}
              >
                Bishoftu
              </AppText>
              <AppText
                variant="caption"
                style={{ color: theme.colors.textSecondary }}
              >
                Warehouse A Regional loading doc
              </AppText>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDotOutline,
                { borderColor: theme.colors.primary },
              ]}
            />
            <View>
              <AppText
                variant="bodyMd"
                style={{ fontWeight: "bold", color: theme.colors.textPrimary }}
              >
                Addis Ababa
              </AppText>
              <AppText
                variant="caption"
                style={{ color: theme.colors.textSecondary }}
              >
                Mercato Wholesale Hub gate 4
              </AppText>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Ionicons
              name="map-outline"
              size={16}
              color={theme.colors.primary}
            />
            <AppText
              variant="caption"
              style={{ color: theme.colors.textPrimary, marginLeft: 6 }}
            >
              View Route
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Ionicons
              name="call-outline"
              size={16}
              color={theme.colors.primary}
            />
            <AppText
              variant="caption"
              style={{ color: theme.colors.textPrimary, marginLeft: 6 }}
            >
              Contact
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            {
              backgroundColor: isCompleted
                ? theme.colors.success
                : theme.colors.primary,
            },
          ]}
          onPress={onComplete}
        >
          <Ionicons
            name={isCompleted ? "checkmark-circle" : "checkmark-done-outline"}
            size={18}
            color="#FFF"
          />
          <AppText
            variant="bodyMd"
            style={{ color: "#FFF", fontWeight: "bold", marginLeft: 8 }}
          >
            {isCompleted
              ? "Trip Completed • Reactivate Demo"
              : "Complete Shipment Deliveries"}
          </AppText>
        </TouchableOpacity>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  card: { padding: 16, position: "relative" },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 10,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  mapImage: {
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  timeline: { marginVertical: 16, position: "relative", paddingLeft: 24 },
  timelineLine: {
    position: "absolute",
    left: 8,
    top: 16,
    bottom: 16,
    width: 2,
    backgroundColor: "#C9C4D8",
    borderStyle: "dashed",
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: "absolute",
    left: -24,
    top: 0,
  },
  timelineDotOutline: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    position: "absolute",
    left: -22,
    top: 2,
  },
  actionRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
  },
});
