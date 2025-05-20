import React, { useEffect, useState } from "react";
import { Platform, ScrollView, View, Text } from "react-native";
import useApi from "../hooks/useApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QrWeb from "../mechanicApp/QrWeb";
import QrPageMobile from "../mechanicApp/QrPage";

const QrPage = () => {
  const { getJsonApi } = useApi();
  const [qr, setQr] = useState([]);

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await getJsonApi("adminApproval/adminQr", token);
        if (response.status === 200) {
          setQr(response?.data?.qrCodes);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchQr();
  }, []);

  return (
    <ScrollView className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-100 px-4 py-6 ">
      {qr?.map((qrItem, index) => (
        <View
          key={index}
          className="bg-white p-5 rounded-2xl shadow-lg border-l-4 border-purple-400 mt-4"
        >
          <View className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {Platform.OS === "web" ? (
              <QrWeb
                base64={qrItem.qrConfig.backgroundImage}
                link={qrItem.qrConfig.text}
              />
            ) : (
              <QrPageMobile />
            )}
            <View className="flex-1 space-y-1 h-full  justify-center">
              <Text className="text-2xl font-extrabold text-purple-700 tracking-wide">
                {qrItem.address.name}
              </Text>
              <Text className="text-base text-gray-700 font-medium">
                {qrItem.address.street}
              </Text>
              <Text className="text-base text-gray-600 italic">
                {qrItem.address.landmark}
              </Text>
              <Text className="text-lg text-blue-800 font-semibold">
                {qrItem.address.city}, {qrItem.address.state}
              </Text>
              <Text className="text-sm text-gray-500">
                Postal Code:{" "}
                <Text className="font-semibold">
                  {qrItem.address.postalCode}
                </Text>
              </Text>
              <Text className="text-sm text-gray-600">
                📞{" "}
                <Text className="font-medium text-black">
                  {qrItem.address.phone}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default QrPage;
