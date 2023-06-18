import { ConnectWallet } from "@thirdweb-dev/react-native";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const WalletScreen = () => {
  return (
    <SafeAreaView
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: Colors.black,
      }}
    >
      <View
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          marginHorizontal: 32,
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <Text
            style={{
              color: Colors.white,
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 48,
            }}
          >
            Your Profile
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <ConnectWallet />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WalletScreen;
