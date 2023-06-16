import { Text, TouchableOpacity } from "react-native";
import { PhotoModalScreenNavigationProp } from "../Router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

function PhotoModal({
  route,
}: {
  route?: PhotoModalScreenNavigationProp["route"];
}) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          aspectRatio: 3 / 4,
        }}
        cachePolicy="memory-disk"
        source={{ uri: route?.params.uri || "" }}
        contentFit="cover"
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 36,
          width: "90%",
          shadowColor: "#08beed",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        }}
      >
        <LinearGradient
          colors={["#1cd5e7", "#0392ee"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            padding: 20,
            alignItems: "center",
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Mint
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default PhotoModal;
