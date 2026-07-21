import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { getRoleColors, neutralColors } from "../constants/colors";
import { spacing } from "../constants/layout";
import IllustrationContainer from "./IllustrationContainer";
import OnboardingCard from "./OnboardingCard";
import OnboardingFooter from "./OnboardingFooter";
import OnboardingLayout from "./OnboardingLayout";
import ProgressIndicator from "./ProgressIndicator";
import Typography from "./Typography";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutralColors.backgroundLight
  },
  selectorContainer: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: neutralColors.borderLight,
    backgroundColor: neutralColors.cardBg
  },
  screenButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: neutralColors.borderLight,
    borderRadius: 8,
    marginBottom: spacing.md
  },
  screenButtonText: {
    textAlign: "center"
  },
  sectionDivider: {
    height: 1,
    backgroundColor: neutralColors.borderLight,
    marginVertical: spacing.xl
  },
  highlightText: {
    fontWeight: "600"
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg
  },
  featureIcon: {
    marginRight: spacing.md,
    marginTop: 2
  },
  featureText: {
    flex: 1
  },
  roleGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg
  },
  roleCard: {
    flex: 0.48,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: neutralColors.borderLight
  },
  roleCardSelected: {
    borderWidth: 2
  },
  roleCardText: {
    marginTop: spacing.md,
    textAlign: "center"
  },
  termsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl
  },
  termsText: {
    lineHeight: 22
  }
});

// ==============================================================
// Example 1: Welcome Screen
// ==============================================================
export const WelcomeOnboardingScreen = () => {
  const role = "farmer";
  const [currentStep, setCurrentStep] = useState(1);
  return <OnboardingLayout testID="onboarding-welcome" header={<View style={{
    alignItems: "center"
  }}>
          <ProgressIndicator currentStep={1} totalSteps={5} role={role} />
        </View>} illustration={<IllustrationContainer size="large" role={role} accentColor="bright" showOverlay={false}>
          <View style={{
      width: 200,
      height: 200,
      backgroundColor: getRoleColors(role).light,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center"
    }}>
            <Typography variant="title" bold color={getRoleColors(role).primary}>
              🌾
            </Typography>
          </View>
        </IllustrationContainer>} content={<View>
          <Typography variant="title" bold color={neutralColors.textDark} style={{
      marginBottom: spacing.md,
      textAlign: "center"
    }}>
            Welcome to OmishGo
          </Typography>
          <Typography variant="body" color={neutralColors.textMedium} style={{
      textAlign: "center",
      marginBottom: spacing.lg
    }}>
            The farmer-first marketplace connecting farmers with buyers and
            suppliers.
          </Typography>

          <View style={styles.sectionDivider} />

          <Typography variant="subtitle" bold color={neutralColors.textDark} style={{
      marginBottom: spacing.md
    }}>
            What you'll do:
          </Typography>

          <View style={styles.featureRow}>
            <Typography variant="body" color={getRoleColors(role).primary}>
              ✓
            </Typography>
            <View style={styles.featureText}>
              <Typography variant="body" color={neutralColors.textDark}>
                Manage your farm and sell products
              </Typography>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Typography variant="body" color={getRoleColors(role).primary}>
              ✓
            </Typography>
            <View style={styles.featureText}>
              <Typography variant="body" color={neutralColors.textDark}>
                Buy farm supplies at fair prices
              </Typography>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Typography variant="body" color={getRoleColors(role).primary}>
              ✓
            </Typography>
            <View style={styles.featureText}>
              <Typography variant="body" color={neutralColors.textDark}>
                Connect with buyers and suppliers
              </Typography>
            </View>
          </View>
        </View>} footer={<OnboardingFooter currentStep={1} totalSteps={5} role={role} onNext={() => setCurrentStep(2)} showSkip={true} testID="welcome-footer" />} />;
};

// ==============================================================
// Example 2: Features Highlight Screen
// ==============================================================
export const FeaturesOnboardingScreen = () => {
  const role = "farmer";
  const [currentStep, setCurrentStep] = useState(2);
  return <OnboardingLayout testID="onboarding-features" header={<View style={{
    alignItems: "center"
  }}>
          <ProgressIndicator currentStep={2} totalSteps={5} role={role} size="small" />
        </View>} illustration={<IllustrationContainer size="medium" role={role} showOverlay={true}>
          <View style={{
      width: 150,
      height: 150,
      backgroundColor: getRoleColors(role).lighter,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center"
    }}>
            <Typography variant="subtitle" bold>
              📱
            </Typography>
          </View>
        </IllustrationContainer>} content={<OnboardingCard title="Easy to Use" description="Designed for farmers with any experience level. Simple taps, clear instructions." role={role} points={["Works offline on slow networks", "Simple Amharic support", "No confusing tech jargon"]} accentColor="bright" />} footer={<OnboardingFooter currentStep={2} totalSteps={5} role={role} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} showSkip={true} testID="features-footer" />} />;
};

// ==============================================================
// Example 3: Role Selection Screen
// ==============================================================
export const RoleSelectionOnboardingScreen = () => {
  const role = "farmer";
  const [currentStep, setCurrentStep] = useState(3);
  const [selectedRoles, setSelectedRoles] = useState(["farmer"]);
  const roles = ["farmer", "buyer", "supplier", "driver"];
  const roleLabels = {
    farmer: "Farmer",
    buyer: "Buyer",
    supplier: "Supplier",
    driver: "Driver"
  };
  const roleDescriptions = {
    farmer: "Manage farm & sell products",
    buyer: "Buy farm products",
    supplier: "Sell farm supplies",
    driver: "Handle deliveries"
  };
  return <OnboardingLayout testID="onboarding-roles" header={<View style={{
    alignItems: "center"
  }}>
          <ProgressIndicator currentStep={3} totalSteps={5} role={role} size="small" />
        </View>} content={<View>
          <Typography variant="title" bold color={neutralColors.textDark} style={{
      marginBottom: spacing.md
    }}>
            What's your role?
          </Typography>
          <Typography variant="body" color={neutralColors.textMedium} style={{
      marginBottom: spacing.lg
    }}>
            You can switch roles anytime.
          </Typography>

          <View style={styles.roleGrid}>
            {roles.slice(0, 2).map(r => <View key={r} style={[styles.roleCard, {
        backgroundColor: getRoleColors(r).lighter,
        borderColor: selectedRoles.includes(r) ? getRoleColors(r).primary : neutralColors.borderLight
      }]}>
                <Typography variant="subtitle" bold color={getRoleColors(r).primary}>
                  {r === "farmer" && "🌾"}
                  {r === "buyer" && "🛒"}
                  {r === "supplier" && "📦"}
                  {r === "driver" && "🚗"}
                </Typography>
                <Typography variant="body" bold color={neutralColors.textDark} style={styles.roleCardText}>
                  {roleLabels[r]}
                </Typography>
                <Typography variant="caption" color={neutralColors.textMedium} style={styles.roleCardText}>
                  {roleDescriptions[r]}
                </Typography>
              </View>)}
          </View>

          <View style={styles.roleGrid}>
            {roles.slice(2).map(r => <View key={r} style={[styles.roleCard, {
        backgroundColor: getRoleColors(r).lighter,
        borderColor: selectedRoles.includes(r) ? getRoleColors(r).primary : neutralColors.borderLight
      }]}>
                <Typography variant="subtitle" bold color={getRoleColors(r).primary}>
                  {r === "driver" && "🚗"}
                  {r === "supplier" && "📦"}
                </Typography>
                <Typography variant="body" bold color={neutralColors.textDark} style={styles.roleCardText}>
                  {roleLabels[r]}
                </Typography>
                <Typography variant="caption" color={neutralColors.textMedium} style={styles.roleCardText}>
                  {roleDescriptions[r]}
                </Typography>
              </View>)}
          </View>
        </View>} footer={<OnboardingFooter currentStep={3} totalSteps={5} role={role} onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} showSkip={true} testID="roles-footer" />} />;
};

// ==============================================================
// Example 4: Terms & Conditions Screen
// ==============================================================
export const TermsOnboardingScreen = () => {
  const role = "farmer";
  const [currentStep, setCurrentStep] = useState(4);
  const [agreed, setAgreed] = useState(false);
  return <OnboardingLayout testID="onboarding-terms" header={<View style={{
    alignItems: "center"
  }}>
          <ProgressIndicator currentStep={4} totalSteps={5} role={role} size="small" />
        </View>} content={<View>
          <Typography variant="title" bold color={neutralColors.textDark} style={{
      marginBottom: spacing.md
    }}>
            Terms & Conditions
          </Typography>

          <ScrollView style={{
      height: 200,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: neutralColors.borderLight,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginBottom: spacing.lg
    }} showsVerticalScrollIndicator={true}>
            <Typography variant="caption" color={neutralColors.textMedium} style={styles.termsText}>
              {`By using OmishGo, you agree to these terms:

1. You provide accurate information
2. You respect all users
3. You pay for purchases
4. You follow local laws

OmishGo connects farmers with buyers. We take no responsibility for product quality disputes. Users are responsible for their own transactions.

For full terms, visit omishgo.com/terms`}
            </Typography>
          </ScrollView>

          <View style={{
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg
    }}>
            <View style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: agreed ? getRoleColors(role).primary : neutralColors.borderLight,
        backgroundColor: agreed ? getRoleColors(role).lighter : "transparent",
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.md
      }}>
              {agreed && <Typography variant="body" bold color={getRoleColors(role).primary}>
                  ✓
                </Typography>}
            </View>
            <Typography variant="body" color={neutralColors.textDark} onPress={() => setAgreed(!agreed)}>
              I agree to terms & conditions
            </Typography>
          </View>
        </View>} footer={<OnboardingFooter currentStep={4} totalSteps={5} role={role} onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} nextDisabled={!agreed} showSkip={false} testID="terms-footer" />} />;
};

// ==============================================================
// Example 5: Complete Screen (Final step)
// ==============================================================
export const CompleteOnboardingScreen = () => {
  const role = "farmer";
  const [currentStep, setCurrentStep] = useState(5);
  return <OnboardingLayout testID="onboarding-complete" header={<View style={{
    alignItems: "center"
  }}>
          <ProgressIndicator currentStep={5} totalSteps={5} role={role} size="small" />
        </View>} illustration={<IllustrationContainer size="large" role={role} accentColor="success" showOverlay={false}>
          <View style={{
      width: 120,
      height: 120,
      backgroundColor: "#10b981",
      borderRadius: 60,
      alignItems: "center",
      justifyContent: "center"
    }}>
            <Typography variant="title" bold color="white" style={{
        fontSize: 48
      }}>
              ✓
            </Typography>
          </View>
        </IllustrationContainer>} content={<View>
          <Typography variant="title" bold color={neutralColors.textDark} style={{
      marginBottom: spacing.md,
      textAlign: "center"
    }}>
            You're all set!
          </Typography>
          <Typography variant="body" color={neutralColors.textMedium} style={{
      textAlign: "center",
      marginBottom: spacing.lg
    }}>
            Welcome to OmishGo. Your account is ready. Let's get started.
          </Typography>

          <View style={styles.sectionDivider} />

          <Typography variant="subtitle" bold color={neutralColors.textDark} style={{
      marginBottom: spacing.md
    }}>
            What's next:
          </Typography>

          <View style={styles.featureRow}>
            <Typography variant="body" color={getRoleColors(role).primary}>
              1.
            </Typography>
            <View style={styles.featureText}>
              <Typography variant="body" color={neutralColors.textDark}>
                Complete your profile
              </Typography>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Typography variant="body" color={getRoleColors(role).primary}>
              2.
            </Typography>
            <View style={styles.featureText}>
              <Typography variant="body" color={neutralColors.textDark}>
                Verify your phone number
              </Typography>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Typography variant="body" color={getRoleColors(role).primary}>
              3.
            </Typography>
            <View style={styles.featureText}>
              <Typography variant="body" color={neutralColors.textDark}>
                Start trading in the marketplace
              </Typography>
            </View>
          </View>
        </View>} footer={<OnboardingFooter currentStep={5} totalSteps={5} isLastStep={true} role={role} onNext={() => {}} nextLabel="Get Started" showBack={false} showSkip={false} testID="complete-footer" />} />;
};

// ==============================================================
// Example Selector Component (for testing/development)
// ==============================================================
export const OnboardingExamplesSelector = () => {
  const [selectedScreen, setSelectedScreen] = useState("welcome");
  const screens = {
    welcome: {
      label: "Welcome",
      component: WelcomeOnboardingScreen
    },
    features: {
      label: "Features",
      component: FeaturesOnboardingScreen
    },
    roles: {
      label: "Role Selection",
      component: RoleSelectionOnboardingScreen
    },
    terms: {
      label: "Terms & Conditions",
      component: TermsOnboardingScreen
    },
    complete: {
      label: "Complete",
      component: CompleteOnboardingScreen
    }
  };
  const CurrentScreen = screens[selectedScreen]?.component;
  return <SafeAreaView style={styles.container}>
      <View style={styles.selectorContainer}>
        <Typography variant="subtitle" bold style={{
        marginBottom: spacing.md
      }}>
          Onboarding Examples
        </Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.entries(screens).map(([key, {
          label
        }]) => <View key={key} style={{
          marginRight: spacing.md
        }}>
              <View style={[styles.screenButton, {
            backgroundColor: selectedScreen === key ? getRoleColors("farmer").primary : neutralColors.borderLight
          }]}>
                <Typography variant="body" bold color={selectedScreen === key ? "white" : neutralColors.textMedium} onPress={() => setSelectedScreen(key)}>
                  {label}
                </Typography>
              </View>
            </View>)}
        </ScrollView>
      </View>

      {CurrentScreen && <CurrentScreen />}
    </SafeAreaView>;
};
export default OnboardingExamplesSelector;