import React, { useEffect, useState } from "react";
import { View, FlatList, Dimensions, Text } from "react-native";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native-gesture-handler";

const numColumns = 3;
const size = Dimensions.get("window").width / numColumns;

const Gallery = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        if (FileSystem.documentDirectory === null) return;
        const documents = await FileSystem.readDirectoryAsync(
          FileSystem.documentDirectory
        );
        const photos = documents
          .filter((doc) => doc.startsWith("photo-"))
          .sort((a, b) => {
            const aNum = parseInt(a.split("-")[1]);
            const bNum = parseInt(b.split("-")[1]);
            return bNum - aNum;
          });

        const numberOfFullRows = Math.floor(photos.length / numColumns);
        let numberOfElementsLastRow =
          photos.length - numberOfFullRows * numColumns;
        while (
          numberOfElementsLastRow !== numColumns &&
          numberOfElementsLastRow !== 0
        ) {
          photos.push("empty");
          numberOfElementsLastRow = numberOfElementsLastRow + 1;
        }

        const imageUris = photos.map((filename) =>
          filename === "empty"
            ? "empty"
            : `${FileSystem.documentDirectory}${filename}`
        );
        setImages(imageUris);
      } catch (error) {
        console.error(error);
      }
    };

    loadImages();
  }, []);

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    if (item === "empty") {
      return (
        <View
          style={[
            {
              flex: 1,
              flexDirection: "column",
            },
            index % numColumns !== 0 && {
              borderLeftWidth: 3,
              borderLeftColor: "rgb(18, 18, 18)",
            },
          ]}
        >
          <View
            style={{
              height: size * (4 / 3),
              width: size,
              backgroundColor: "rgb(18, 18, 18)",
            }}
          />
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={[
          {
            flex: 1,
            flexDirection: "column",
          },
          index % numColumns !== 0 && {
            borderLeftWidth: 3,
            borderLeftColor: "rgb(18, 18, 18)",
          },
        ]}
      >
        <Image
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: size * (4 / 3),
            width: size,
          }}
          cachePolicy="memory-disk"
          source={{ uri: item }}
          contentFit="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(18, 18, 18)" }}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        ItemSeparatorComponent={() => {
          return (
            <View style={{ height: 3, backgroundColor: "rgb(18, 18, 18)" }} />
          );
        }}
      />
    </View>
  );
};

export default Gallery;
