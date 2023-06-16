import * as React from "react";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import CameraScreen from "./screens/Camera";
import SplashScreen from "./screens/SplashScreen";
import GalleryScreen from "./screens/Gallery";
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import WalletScreen from "./screens/Wallet";
import AuthScreen from "./screens/Auth";
import { useAddress } from "@thirdweb-dev/react-native";
import PhotoModal from "./screens/PhotoModal";

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Auth: undefined;
  Camera: undefined;
  Wallet: undefined;
  Gallery: undefined;
  PhotoModal: { uri: string };
};

export type AuthScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Auth"
>;
export type CameraScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Camera"
>;
export type WalletScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Wallet"
>;
export type GalleryScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Gallery"
>;
export type PhotoModalScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "PhotoModal"
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
    <NavigationContainer theme={DarkTheme}>
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
            <Stack.Group
              screenOptions={{
                presentation: "modal",
                headerShown: true,
                headerTitle: "Your TrueSnaps",
                headerShadowVisible: true,
              }}
            >
              <Stack.Screen name="Gallery" component={GalleryScreen} />
              <Stack.Screen
                name="PhotoModal"
                component={PhotoModal}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
