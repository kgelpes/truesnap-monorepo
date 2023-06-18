import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CircleButton from "../components/CircleButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Camera,
  CameraPermissionStatus,
  CameraRuntimeError,
  PhotoFile,
  useCameraDevices,
} from "react-native-vision-camera";
import { TapGestureHandler } from "react-native-gesture-handler";
import Reanimated, {
  withSpring,
  useSharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import { MAX_ZOOM_FACTOR } from "../Constants";
import Stack from "../components/Stack";
import * as FileSystem from "expo-file-system";
import crypto from 'react-native-crypto'

import { CameraScreenNavigationProp } from "../Router";
import { trpc } from "../trpc";

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

export default function CameraScreen({
  navigation,
}: {
  navigation: CameraScreenNavigationProp["navigation"];
}) {
  const userAddImageHash = trpc.userAddImageHash.useMutation();

  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const zoom = useSharedValue(1);
  const isPressingButton = useSharedValue(false);
  const [selectedZoomOption, setSelectedZoomOption] = useState(zoom.value);

  // TODO: check if camera page is active
  const isActive = true;

  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "back"
  );
  const [flash, setFlash] = useState<"off" | "on">("off");

  // camera format settings
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  const [cameraPermission, setCameraPermission] = useState<
    CameraPermissionStatus | undefined
  >();

  //#region Memos

  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front]
  );
  //#endregion

  const zoomOptions = useMemo(() => {
    const options = [] as {
      value: number;
      label: string;
    }[];
    if (device == null) return options;
    if (device.minZoom < device.neutralZoom) {
      options.push({
        value: device.minZoom,
        label: "0.5",
      });
    }
    options.push({
      value: device.neutralZoom,
      label: "1",
    });
    options.push({ value: device.neutralZoom * 1.5, label: "2" });
    options.push({ value: device.neutralZoom * 2.5, label: "3" });

    return options;
  }, [device?.minZoom, device?.neutralZoom, device?.maxZoom]);

  useEffect(() => {
    const updateCurrentStatus = async () => {
      const currentCameraPermissionStatus =
        await Camera.getCameraPermissionStatus();
      setCameraPermission(currentCameraPermissionStatus);
    };
    updateCurrentStatus();
  }, []);

  const onRequestPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    if (newCameraPermission !== "authorized") {
      alert(
        "We need your permission to show the camera. Please go to your settings and enable camera permissions for TrueSnap."
      );
    }
  };

  //#region Animated Zoom
  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);
  //#endregion

  //#region Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton]
  );
  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);
  const onInitialized = useCallback(() => {
    console.log("Camera initialized!");
    setIsCameraInitialized(true);
  }, []);

  const onPhotoCaptured = async () => {
    if (camera.current) {
      const timestamp = new Date().getTime();

      const photo = await camera.current.takePhoto();

      const photoPath = `${FileSystem.documentDirectory}photo-${timestamp}.jpeg`;
      await FileSystem.copyAsync({
        from: `file:/${photo.path}`,
        to: photoPath,
      });

      const photoAsString = await FileSystem.readAsStringAsync(photoPath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const hash = crypto.createHash("sha256");
      hash.update(photoAsString);

      const imageHash = hash.digest("hex");

      userAddImageHash.mutate({
        imageHash,
      });
    } else {
      console.log("camera not initialized");
    }
  };

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === "back" ? "front" : "back"));
  }, []);
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === "off" ? "on" : "off"));
  }, []);
  //#endregion

  //#region Tap Gesture
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);
  //#endregion

  if (device != null) {
    console.log(
      `Re-rendering camera page with ${
        isActive ? "active" : "inactive"
      } camera. ` + `Device: "${device.name}"`
    );
  } else {
    console.log("re-rendering camera page without active camera");
  }

  if (!cameraPermission || !device) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (cameraPermission !== "authorized") {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={onRequestPermission} title="grant permission" />
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <TouchableOpacity onPress={onFlashPressed}>
          <Ionicons
            name={flash === "on" ? "flash" : "flash-off"}
            color="white"
            size={24}
          />
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          TrueSnap
        </Text>
        <TouchableOpacity
          onPress={async () => {
            navigation.navigate("Wallet");
          }}
        >
          <Ionicons name="person-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {device != null && (
        <Reanimated.View
          style={{
            width: "100%",
            aspectRatio: 3 / 4,
            borderRadius: 12,
          }}
        >
          <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
            <ReanimatedCamera
              ref={camera}
              style={{
                width: "100%",
                aspectRatio: 3 / 4,
                borderRadius: 12,
              }}
              device={device}
              preset="photo"
              enableHighQualityPhotos
              isActive={isActive}
              onInitialized={onInitialized}
              onError={onError}
              enableZoomGesture={false}
              animatedProps={cameraAnimatedProps}
              photo
              orientation="portrait"
            />
          </TapGestureHandler>
        </Reanimated.View>
      )}

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <Stack
          spacing={12}
          style={{
            position: "absolute",
            top: -20,
            right: 0,
            left: 0,
            zIndex: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {zoomOptions.map((d, i) => (
            <TouchableOpacity
              key={d.value}
              onPress={() => {
                setSelectedZoomOption(d.value);
                zoom.value = withSpring(d.value, {
                  damping: 20,
                  mass: 0.5,
                });
              }}
              style={{
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: 99,
                height: selectedZoomOption === d.value ? 32 : 24,
                width: selectedZoomOption === d.value ? 32 : 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                {`${d.label}${selectedZoomOption === d.value ? "x" : ""}`}
              </Text>
            </TouchableOpacity>
          ))}
        </Stack>
        <TouchableOpacity
          onPress={async () => {
            navigation.navigate("Gallery");
          }}
        >
          <Ionicons name="images-outline" size={24} color="white" />
        </TouchableOpacity>

        <CircleButton onPress={onPhotoCaptured} />

        <TouchableOpacity
          onPress={onFlipCameraPressed}
          disabled={!supportsCameraFlipping}
        >
          <Ionicons name="camera-reverse" color="white" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  camera: {
    aspectRatio: 3 / 4,
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
