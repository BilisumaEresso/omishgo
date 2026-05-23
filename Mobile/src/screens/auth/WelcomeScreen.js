// src/screens/auth/WelcomeScreen.js
import React from 'react';
import { StyleSheet, View, Image, ImageBackground } from 'react-native';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useTheme } from '../../hooks/useTheme';

export default function WelcomeScreen({ navigation }) {
  const { theme } = useTheme();

  return (
    <ScreenWrapper padding={false} disableKeyboardAvoid={true}>
      <View style={styles.container}>
        {/* Background Image Layer */}
        <ImageBackground
        //   source={require("../../assets/images/background.png")}
          source={{
            uri: "https://images.unsplash.com/photo-1510844355160-2fb07bf9af75?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFybWxhbmR8ZW58MHx8MHx8fDA%3D",
          }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <View
          style={[
            styles.darkOverlay,
            { backgroundColor: theme.colors.background + "B3" },
          ]}
        />

        <View style={styles.safeContainer}>
          {/* Branding & Logo */}
          <View style={styles.brandWrapper}>
            <View
              style={[
                styles.logoCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <AppText
              variant="headingLg"
              color={theme.colors.primary}
              style={styles.welcomeText}
            >
              Welcome to OmishGo
            </AppText>

            <AppText
              variant="bodyLg"
              color={theme.colors.textSecondary}
              style={styles.tagline}
            >
              Your gateway to the Ethiopian agricultural marketplace.
            </AppText>
          </View>

          {/* Buttons Action Group */}
          <View style={styles.actionsContainer}>
            <AppButton
              title="Create Account"
              fullWidth
              onPress={() => navigation.navigate("Register")}
            />

            <AppButton
              title="Login"
              variant="outline"
              fullWidth
              onPress={() => navigation.navigate("Login")}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  safeContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  brandWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoCard: {
    width: 120,
    height: 120,
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  tagline: {
    textAlign: 'center',
    maxWidth: 280,
  },
  actionsContainer: {
    width: '100%',
    gap: 16,
  },
});