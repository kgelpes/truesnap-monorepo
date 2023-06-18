import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
} from "react-native";

const SplashScreen = () => {
  return (
    <ImageBackground
      source={require("../assets/bg.jpg")}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
    </ImageBackground>
  );
};

export default SplashScreen;
