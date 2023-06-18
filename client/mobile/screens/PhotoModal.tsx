import { Text, TouchableOpacity } from "react-native";
import { PhotoModalScreenNavigationProp } from "../Router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import {
  SignedPayload721WithQuantitySignature,
  useContract,
} from "@thirdweb-dev/react-native";

const serverUrl = process.env.SERVER_URL || "";

function PhotoModal({
  route,
}: {
  route?: PhotoModalScreenNavigationProp["route"];
}) {
  // Put address on env var
  const { contract: nftCollection } = useContract(
    "0xC3f1959443F0470246aA53B7622bddf9D3e4Bb3d",
    "nft-collection"
  );

  const mutateUploadPhoto = useMutation({
    mutationFn: async (uri: string) => {
      console.log("uri", uri);
      try {
        const response = await FileSystem.uploadAsync(
          `${serverUrl}/uploadPhoto`,
          uri,
          {
            fieldName: "file",
            httpMethod: "PATCH",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            // headers: {
            //   Authorization: `Bearer ${token}`,
            // },
          }
        );

        const jsonRes = JSON.parse(response.body);
        const nft = await nftCollection?.signature.mint(
          jsonRes.signedPayload as SignedPayload721WithQuantitySignature
        );

        console.log('nft', nft)

        alert("Minted succesfully!");

        return nft;
      } catch (error) {
        console.log(error);
      }
    },
  });

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
        onPress={() => {
          mutateUploadPhoto.mutate(route?.params.uri || "");
        }}
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
