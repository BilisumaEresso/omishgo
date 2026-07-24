import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { getRoleColors, neutralColors } from "../constants/colors";
import Typography from "./Typography";



const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  label: {
    flex: 1,
  },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});

const RememberMeCheckbox = React.forwardRef(
  (
    {
      checked = false,
      onPress,
      label = "Remember me",
      role = "farmer",
      style,
      testID,
      ...props
    },
    ref,
  ) => {
    const roleColor = getRoleColors(role);

    const checkboxStyle = [
      styles.checkbox,
      {
        borderColor: checked ? roleColor.primary : neutralColors.borderSubtle,
        backgroundColor: checked ? roleColor.primary : "transparent",
      },
    ];

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.container, style]}
        testID={testID}
        {...props}
      >
        <View style={checkboxStyle}>
          {checked && (
            <Ionicons
              name="checkmark"
              size={14}
              color="#FFFFFF"
              testID={`${testID}-check`}
            />
          )}
        </View>
        <Typography
          variant="body"
          style={styles.label}
          color={neutralColors.textMedium}
        >
          {label}
        </Typography>
      </TouchableOpacity>
    );
  },
);

RememberMeCheckbox.displayName = "RememberMeCheckbox";

export default RememberMeCheckbox;
