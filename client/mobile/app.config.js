module.exports = {
  expo: {
    name: "TrueSnap",
    slug: "TrueSnap",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#8b4e85",
    },
    assetBundlePatterns: ["**/*"],
    scheme: "truesnap",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.truesnapp.app",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.truesnapp.app",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "react-native-vision-camera",
        {
          cameraPermissionText: "$(PRODUCT_NAME) needs access to your Camera.",
        },
      ],
    ],
  },
};
