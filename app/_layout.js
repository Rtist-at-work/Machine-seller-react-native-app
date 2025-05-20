import React from "react";
import { Platform, SafeAreaView } from "react-native";
import "../global.css";
import { Stack, useNavigation } from "expo-router";
import { LoadingProvider } from "./context/LoadingContext";
import { AuthProvider } from "./context/AuthProvider";
import { SocketProvider } from "./context/SocketContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MobileHeader from "./component/(mobileHeader)/MobileHeader";
import Header from "./component/(header)/Header";
import { FileUploadProvider } from "./context/FileUpload";
import { FormatTime, FormatTimeProvider } from "./context/FormatTime";
import { ToastProvider } from "react-native-toast-notifications";
import BottomNavBar from "./navigation/(navigationBar)/BottomNavBar";

const Layout = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <SocketProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <LoadingProvider>
              <FileUploadProvider>
                <FormatTimeProvider>
                  <SafeAreaView
                    style={{ zIndex: 9999, backgroundColor: "#d5d8dc" }}
                  >
                    {/* <Header /> */}
                    {/* {Platform.OS !== "web" && <MobileHeader />}
              {Platform.OS === "web" && <Header />} */}
              {/* <BottomNavBar/> */}
                  </SafeAreaView>
                  <Stack screenOptions={{ headerShown: false }} />
                </FormatTimeProvider>
              </FileUploadProvider>
            </LoadingProvider>
          </GestureHandlerRootView>
        </SocketProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default Layout;
