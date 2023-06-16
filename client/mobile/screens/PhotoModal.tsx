import { View, ActivityIndicator, Text } from "react-native";
import { PhotoModalScreenNavigationProp } from "../Router";
import { Image } from "expo-image";

function PhotoModal({
  route,
}: {
  route?: PhotoModalScreenNavigationProp["route"];
}) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
    </View>
  );
}

export default PhotoModal;
