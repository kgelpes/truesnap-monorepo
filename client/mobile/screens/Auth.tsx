import {
  ConnectWallet,
  useAddress,
  useThirdwebAuthContext,
  useUser,
  useLogin,
} from "@thirdweb-dev/react-native";
import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const WalletScreen = () => {
  const { isLoading, login } = useLogin();
  const userAddress = useAddress();

  const handleSignMessage = async () => {
    try {
      await login();
    } catch (error) {
      console.log("login error:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg.jpg")}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <SafeAreaView>
        <View
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
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
                marginBottom: 12,
              }}
            >
              TrueSnap
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
            <Text
              style={{
                color: Colors.white,
                fontSize: 36,
                fontWeight: "bold",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Begin Your Journey
            </Text>
            <Text
              style={{
                color: Colors.white,
                textAlign: "center",
                fontSize: 18,
                marginBottom: 48,
              }}
            >
              Connect your wallet and begin capturing authentic, verified
              moments.
            </Text>

            {userAddress ? (
              <>
                <TouchableOpacity
                  onPress={handleSignMessage}
                  style={{
                    backgroundColor: Colors.white,
                    borderRadius: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    marginBottom: 36,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.darker,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    {isLoading ? "Loading..." : "Verify Wallet Ownership"}
                  </Text>
                </TouchableOpacity>
                <ConnectWallet />
              </>
            ) : (
              <ConnectWallet />
            )}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WalletScreen;
