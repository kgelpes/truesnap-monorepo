import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

interface CircleButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const CircleButton: React.FC<CircleButtonProps> = ({ onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.outerCircle, style]}>
    <View style={styles.innerCircle} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  outerCircle: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 64,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: "#ffffff",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: "#ffffff",
    backgroundColor: "transparent",
  },
});

export default CircleButton;
