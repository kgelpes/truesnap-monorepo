import React, { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

type Direction = "vertical" | "horizontal";

interface StackProps {
  children: ReactNode[];
  direction?: Direction;
  divider?: boolean;
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

const Stack: React.FC<StackProps> = ({
  children,
  direction = "horizontal",
  divider = false,
  spacing = 4,
  style: styleProp,
}) => {
  const flexDirection = direction === "vertical" ? "column" : "row";
  const marginType = direction === "vertical" ? "marginBottom" : "marginRight";

  const styles = StyleSheet.create({
    child: {
      [marginType]: spacing,
      borderBottomWidth: divider ? 0.5 : 0,
      borderColor: "#ccc",
    },
    lastChild: {
      [marginType]: 0,
    },
  });

  return (
    <View style={[{ flexDirection: flexDirection }, styleProp]}>
      {React.Children.map(children, (child, index) => {
        let style: StyleProp<ViewStyle> =
          index === children.length - 1 ? styles.lastChild : styles.child;
        return <View style={style}>{child}</View>;
      })}
    </View>
  );
};

export default Stack;
