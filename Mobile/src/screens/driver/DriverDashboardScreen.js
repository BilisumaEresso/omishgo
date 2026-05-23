import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import AppSidebar from "../../components/layout/AppSidebar";
import DriverOnlineToggle from "../../components/driver/DriverOnlineToggle";
import DriverStatsCards from "../../components/driver/DriverStatsCards";
import CurrentAssignmentCard from "../../components/driver/CurrentAssignmentCard";
import RecentAlertCard from "../../components/driver/RecentAlertCard";
import { useTheme } from "../../hooks/useTheme";

export default function DriverDashboardScreen({ navigation }) {
  const { theme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [earnings, setEarnings] = useState(450);
  const [tasksCount, setTasksCount] = useState(2);
  const [assignmentState, setAssignmentState] = useState("In Transit");

  const handleCompleteTrip = () => {
    if (assignmentState === "In Transit") {
      setAssignmentState("Completed");
      setEarnings((prev) => prev + 240);
      setTasksCount((prev) => Math.max(0, prev - 1));
    } else {
      setAssignmentState("In Transit");
      setTasksCount((prev) => prev + 1);
    }
  };

  const handleSidebarItemPress = (item) => {
    if (item.route === "Logout") {
      navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <>
      <DashboardLayout
        title="Driver Dashboard"
        subtitle="Good morning, Dawit"
        role="driver"
        activeTab="Deliveries"
        onTabPress={(tab) => console.log(tab)}
        scrollable={true}
        showMenu={true}
        onMenuPress={() => setSidebarVisible(true)}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <DriverOnlineToggle isOnline={isOnline} onToggle={setIsOnline} />
          <DriverStatsCards earnings={earnings} tasksCount={tasksCount} />
          <CurrentAssignmentCard
            assignmentState={assignmentState}
            onComplete={handleCompleteTrip}
          />
          <RecentAlertCard />
        </ScrollView>
      </DashboardLayout>

      <AppSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        role="driver"
        onItemPress={handleSidebarItemPress}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
