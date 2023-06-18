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
import {
  useAddress,
  useThirdwebAuthContext,
  useUser,
} from "@thirdweb-dev/react-native";
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
  const userAddress = useAddress();
  const { isLoading, isLoggedIn } = useUser();
  // const auth = React.useContext(AuthContext);
  // const thirdWebAuth = useThirdwebAuthContext();

  // console.log('auth', auth)
  // console.log('thirdWebAuth', thirdWebAuth?.secureStorage?.getItem('auth_token_storage_key').then(res => console.log('thirdwebtoken', res)))

  // React.useEffect(() => {
  //   // Wait for SDK to be ready
  //   const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  //   sleep(100).then(() => {
  //     setIsReady(true);
  //   });
  // }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!userAddress || !isLoggedIn ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Camera" component={CameraScreen} />

            <Stack.Group
              screenOptions={{
                headerShown: true,
                headerTitle: "TrueSnap",
                headerShadowVisible: true,
                headerBackVisible: true,
              }}
            >
              <Stack.Screen name="Wallet" component={WalletScreen} />
            </Stack.Group>

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
