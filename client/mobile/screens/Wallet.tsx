import {
  ConnectWallet,
  localWallet,
  metamaskWallet,
  rainbowWallet,
  ThirdwebProvider,
  useSDK,
} from "@thirdweb-dev/react-native";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useLogin } from "@thirdweb-dev/react-native";
import { setToken } from "../App";

const WalletScreen = () => {
  const { isLoading, login } = useLogin();

  const isDarkMode = useColorScheme() === "dark";
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const textStyles = {
    color: isDarkMode ? Colors.white : Colors.black,
    ...styles.heading,
  };

  const handleSignMessage = async () => {
    try {
      const token = await login();
      setToken(token);
    } catch (error) {
      console.log("login error:", error);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.view}>
        <Text style={textStyles}>React Native thirdweb starter</Text>
        <ConnectWallet />

        <TouchableOpacity onPress={handleSignMessage}>
          <Text>{isLoading ? "Loading..." : "Sign in with Ethereum"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default WalletScreen;
