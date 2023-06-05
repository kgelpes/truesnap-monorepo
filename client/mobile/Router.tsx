import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import CameraScreen from "./screens/Camera";
import SplashScreen from "./screens/SplashScreen";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import WalletScreen from "./screens/Wallet";
import AuthScreen from "./screens/Auth";
import { useAddress } from "@thirdweb-dev/react-native";

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Auth: undefined;
  Camera: undefined;
  Wallet: undefined;
};

export type AuthScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Auth"
>;
export type CameraScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Camera"
>;
export type WalletScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Wallet"
>;

export default function Router() {
  const [isReady, setIsReady] = React.useState(false);
  const userAddress = useAddress();

  React.useEffect(() => {
    // Wait for SDK to be ready
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    sleep(100).then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!userAddress ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
