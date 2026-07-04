// src/screens/auth/SuccessScreen.js

import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

export default function SuccessScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { login } = useAuthStore();

  const [loading, setLoading] = useState(false);

  const { phone, pin } = route.params || {};

  const handleContinue = async () => {
    try {
      setLoading(true);

      // Auto login after registration
      const result = await login(phone, pin);

      if (!result.success) {
        console.log("Auto login failed:", result.message);

        setLoading(false);
        return;
      }

      // Go to role selection modal
      navigation.replace("RoleSelectionModal");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper padding={false}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme?.colors?.background || "#F9FBF9",
          },
        ]}
      >
        {/* Ambient decoration */}
        <View
          style={[
            styles.ambientBlob,
            styles.blobTopRight,
            {
              backgroundColor: theme?.colors?.primary,
            },
          ]}
        />

        <View
          style={[
            styles.ambientBlob,
            styles.blobBottomLeft,
            {
              backgroundColor: theme?.colors?.secondary || "#C9A74D",
            },
          ]}
        />

        <View style={styles.content}>
          <View
            style={[
              styles.bentoCard,
              {
                backgroundColor: theme?.colors?.surface,
                borderColor: theme?.colors?.border,
              },
            ]}
          >
            <Image
              source={require("../../assets/images/onboard_growth.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textDetails}>
            <AppText
              variant="headingLg"
              color={theme?.colors?.primary}
              style={styles.headline}
            >
              Growth Achieved!
            </AppText>

            <AppText
              variant="bodyMd"
              color={theme?.colors?.textSecondary}
              style={styles.subtext}
            >
              Your account is ready. Let's start growing together.
            </AppText>
          </View>

          <AppButton
            title="Continue ➔"
            fullWidth
            loading={loading}
            onPress={handleContinue}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  ambientBlob: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.1,
  },

  blobTopRight: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },

  blobBottomLeft: {
    width: 250,
    height: 250,
    bottom: -80,
    left: -80,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  bentoCard: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 32,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginBottom: 32,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  image: {
    width: "100%",
    height: "100%",
  },

  textDetails: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 16,
  },

  headline: {
    marginBottom: 12,
    textAlign: "center",
  },

  subtext: {
    textAlign: "center",
    maxWidth: 280,
  },
});
