import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface CenterViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CenterView: React.FC<CenterViewProps> = ({ children, style }) => (
  <View style={[styles.center, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CenterView;
