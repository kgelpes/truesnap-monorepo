import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import { useState } from "react";

const serverUrl = process.env.SERVER_URL || "";

function PhotoModal({
  route,
}: {
  route?: PhotoModalScreenNavigationProp["route"];
}) {
  const [modalVisible, setModalVisible] = useState(true);

  const { contract: nftCollection } = useContract(
    "0xC3f1959443F0470246aA53B7622bddf9D3e4Bb3d",
    "nft-collection"
  );

  const mutateUploadPhoto = useMutation({
    mutationFn: async (uri: string) => {
      setModalVisible(true);

      const response = await FileSystem.uploadAsync(
        `https://${serverUrl}/uploadPhoto`,
        uri,
        {
          fieldName: "file",
          httpMethod: "PATCH",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        }
      );

      console.log("response", response);

      const jsonRes = JSON.parse(response.body);
      const nft = await nftCollection?.signature.mint(
        jsonRes.signedPayload as SignedPayload721WithQuantitySignature
      );

      console.log("nft", nft);

      alert("Minted succesfully!");

      return nft;
    },
  });

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            // height: "100%",
            aspectRatio: 3 / 4,
            backgroundColor: "blue",
          }}
        >
          <Image
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              // aspectRatio: 3 / 4,
            }}
            cachePolicy="memory-disk"
            source={{ uri: route?.params.uri || "" }}
            contentFit="cover"
          />
        </View>

        <View
          style={{
            width: "100%",
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 24,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              marginTop: 24,
            }}
          >
            <Text
              style={{
                color: "#111",
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              Mint your verified photo
            </Text>

            <Text
              style={{
                color: "#555",
                fontSize: 16,
                fontWeight: "400",
              }}
            >
              Create a unique NFT for your photo. This will be minted on the
              Mumbai testnet and can be traded on any NFT marketplace.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              mutateUploadPhoto.mutate(route?.params.uri || "");
            }}
            style={{
              width: "100%",
              shadowColor: "#08beed",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              marginBottom: 36,
            }}
          >
            <LinearGradient
              colors={["#1cd5e7", "#0392ee"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 20,
                width: "100%",
                alignItems: "center",
                borderRadius: 16,
              }}
            >
              {mutateUploadPhoto.isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Mint
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          {mutateUploadPhoto.isLoading && (
            <View
              style={{
                paddingHorizontal: 24,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{ color: "#333", fontSize: 24, fontWeight: "bold" }}
                >
                  Minting
                </Text>

                <ActivityIndicator
                  color="black"
                  style={{ marginLeft: 12, top: 2 }}
                />
              </View>

              <View>
                <Text
                  style={{
                    color: "#555",
                    fontSize: 16,
                    marginBottom: 12,
                  }}
                >
                  This might take a few minutes. Please do not close the app.
                </Text>
                <Text
                  style={{
                    color: "#555",
                    fontSize: 16,
                  }}
                >
                  You will be asked to sign a transaction to mint your NFT.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{
                  padding: 20,
                  alignItems: "center",
                  borderRadius: 16,
                  backgroundColor: "white",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {mutateUploadPhoto.isError && (
            <View
              style={{
                paddingHorizontal: 24,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{ color: "#333", fontSize: 24, fontWeight: "bold" }}
                >
                  Error minting
                </Text>

                <ActivityIndicator
                  color="black"
                  style={{ marginLeft: 12, top: 2 }}
                />
              </View>

              <View>
                <Text
                  style={{
                    color: "#555",
                    fontSize: 16,
                    marginBottom: 12,
                  }}
                >
                  An error occured while minting your NFT. Please try again
                  later.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{
                  padding: 20,
                  alignItems: "center",
                  borderRadius: 16,
                  backgroundColor: "#333",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {mutateUploadPhoto.isSuccess && (
            <View
              style={{
                paddingHorizontal: 24,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{ color: "#333", fontSize: 24, fontWeight: "bold" }}
                >
                  NFT minted
                </Text>

                <ActivityIndicator
                  color="black"
                  style={{ marginLeft: 12, top: 2 }}
                />
              </View>

              <View>
                <Text
                  style={{
                    color: "#555",
                    fontSize: 16,
                    marginBottom: 12,
                  }}
                >
                  Your NFT has been minted. You can view it on the Mumbai
                  testnet.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{
                  padding: 20,
                  alignItems: "center",
                  borderRadius: 16,
                  backgroundColor: "#333",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

export default PhotoModal;
