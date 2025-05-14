import {
  View,
  Text,
  Platform,
  Image,
  ScrollView,
  useWindowDimensions,
  Pressable,
  SafeAreaView,
  Linking,
} from "react-native";
import React, { useEffect, useCallback, useMemo } from "react";
import { Share as NativeShare } from "react-native";
import ProductDetails from "./ProductDetails";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import useConversation from "@/app/stateManagement/useConversation";
import { useRouter } from "expo-router";
import useWishlist from "@/app/hooks/useWishlist";
import { useRoute } from "@react-navigation/native";
import Recommeded from "../(Homepage)/Recommeded";
import Footer from "@/app/component/(footer)/Footer";
import useApi from "@/app/hooks/useApi";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VideoComponent from "../(sellerForm)/Video";
import { Ionicons } from "@expo/vector-icons";

export default function SelectProduct() {
  const { width } = useWindowDimensions();
  const isScreen = width > 786;
  const route = useRoute();
  const router = useRouter();
  const navigation = useNavigation();

  const { selectedConversation, setSelectedConversation } = useConversation();
  const { wishlist, addToWishlist } = useWishlist();
  const [product, setProduct] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const { getJsonApi } = useApi();

  const slideNavigator = (i) => {
    setCurrentIndex(i);
  };
  let id;

  if (Platform.OS === "web") {
    id = useLocalSearchParams().id;
  } else {
    id = route?.params?.id;
  }

  useEffect(() => {
    const init = async () => {
      const getToken = await AsyncStorage.getItem("userToken");

      if (!getToken) {
        if (Platform.OS === "web") {
          router.replace("/screens/(auth)/(login)/Login");
        } else {
          navigation.replace("LoginPage");
        }
      } else {
        fetchProduct();
      }
    };

    if (id) init(); // ✅ id now has the correct value
  }, [id]);

  const fetchProduct = useCallback(async () => {
    try {
      const data = await getJsonApi(`productDetails/${id}`);

      const productData = data?.data?.mainProduct;

      setProduct(productData);

      // if (productData?.category) {
      //   const recommendedData = await getJsonApi(
      //     `products?category=${productData.category}`
      //   );

      //   const recommended = recommendedData?.data?.filter(
      //     (item) => item._id !== productData._id
      //   );

      //   setRecommendedProducts(recommended || []);
      // }
    } catch (error) {
      console.error(
        "❌ Error fetching product or recommended products:",
        error
      );
    }
  }, [id]);

  if (Platform.OS === "web") {
    id = useLocalSearchParams().id;
  } else {
    id = route?.params?.id;
  }

  const share = useCallback(async () => {
    if (!product) {
      console.log("Product Not Found");
      return;
    }

    const productUrl = `http://localhost:8081/product/${
      product.MachineName || product._id
    }`;
    const message = `🛒 Check out this product: ${
      product.MachineName || "Awesome Product"
    }\n${productUrl}`;

    try {
      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: "Check out this product!",
            text: message,
            url: productUrl,
          });
          console.log("✅ Shared via Web Share API");
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(message);
          alert("🔗 URL copied to clipboard (Web Share not supported)");
        }
      } else {
        const result = await NativeShare.share({ message });
        if (result.action === NativeShare.sharedAction) {
          console.log("✅ Shared on mobile");
        } else if (result.action === NativeShare.dismissedAction) {
          console.log("ℹ️ Share dismissed");
        }
      }
    } catch (error) {
      console.log("❌ Error while sharing:", error);
    }
  }, [product]);

  const openDailer = () => {
    Linking.openURL(`tel:${product.contact}`);
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <View>
          <View
            className="flex flex-row pt-2 pl-2 mt-1 bg-zinc-100 shadow items-center "
            style={{ zIndex: -1 }}
          >
            <Text className="text-lg">Home</Text>
            <Ionicons
              name="chevron-forward"
              size={13}
              color="black"
              style={{ marginTop: "5px" }}
            />

            {/* Conditionally display the product's industry and category */}
            {Object.keys(product)?.length > 0 && (
              <View className="flex flex-row ">
                <Text className="text-gray-500 text-lg">
                  {product.industry}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={13}
                  color="gray"
                  style={[
                    Platform.OS !== "web" ? { marginTop: 3 } : { marginTop: 9 },
                  ]}
                />

                <Text className="text-gray-500 text-lg">
                  {product.category}
                </Text>
              </View>
            )}
          </View>

          {Object.keys(product)?.length > 0 ? (
            <>
              <View>
                {/* Star Icon */}
                <View className="flex flex-row z-50 relative">
                  <Pressable
                    className="absolute top-2 right-10 "
                    onPress={() => addToWishlist(product)}
                  >
                    <FontAwesome
                      name="star"
                      size={30}
                      color={wishlist?.includes(product._id) ? "red" : "white"}
                    />
                  </Pressable>
                </View>

                {/* Name and Share Icon */}
                <View className="flex flex-row mt-3 ">
                  <Text
                    className={`text-xl mt-3 ms-6 mb-3 `}
                    style={{
                      marginLeft:
                        Platform.OS === "web" && width >= 1024 ? "45%" : "",
                    }}
                  >
                    Tamilarasan
                  </Text>
                  <View className="absolute right-10 mt-12  pt-3">
                    <Pressable onPress={share}>
                      <FontAwesome name="share" size={30} color="gray" />
                    </Pressable>
                  </View>
                </View>

                {/* Machine Name */}
                <View>
                  <Text
                    className="text-2xl font-bold  ms-6 pt-3"
                    style={[
                      {
                        marginLeft:
                          Platform.OS === "web" && width >= 1024 ? "45%" : "",
                      },
                      { zIndex: -1 },
                    ]}
                  >
                    Machine Name
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: isScreen ? "row" : "column",
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: isScreen ? "flex-start" : "center",
                  zIndex: -1,
                }}
              >
                {/* Sticky Image Section */}
                <View
                  className="bg-gray-100"
                  style={{
                    width: isScreen ? "35%" : "90%",
                    marginLeft: isScreen ? 100 : 0,
                    position: isScreen ? "sticky" : "relative",
                    top: 0,
                    height: isScreen ? "70vh" : "auto",
                    zIndex: 10,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Image
                    className="rounded-sm"
                    source={
                      {
                        uri: `data:image/jpeg;base64,${product.machineImages[currentIndex]}`,
                      }
                      // Provide a local placeholder image if needed
                    }
                    style={{
                      width: "100%",
                      height: Platform.OS === "web" ? "400px" : 300,
                    }}
                  />

                  <View className=" absolute top-2 left-2 p-2 w-[100px] bg-yellow-500 rounded-sm justify-center items-center">
                    <Text className=" text-base font-bold">
                      {product.priceType || "Negotiable"}
                    </Text>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="mt-4 flex flex-row gap-2 z-1">
                      {product.machineImages.map((image, index) => (
                        <Pressable
                          onPress={() => slideNavigator(index)}
                          key={index}
                        >
                          <Image
                            className="rounded-sm"
                            source={{ uri: `data:image/jpeg;base64,${image}` }}
                            style={{ width: 80, height: 80 }}
                          />
                        </Pressable>
                      ))}
                      <VideoComponent id={id} />
                    </View>
                  </ScrollView>
                </View>

                {/* Product Details Section */}
                <View
                  style={{
                    flex: 1,
                    // marginLeft: isScreen ? 0 : 0,
                    paddingBottom: 20,
                    width: isScreen ? 500 : "100%",
                    marginTop: Platform.OS === "web" ? "-40px" : -20,
                  }}
                >
                  <View className="mt-5 bg-gray-100 rounded-sm p-5">
                    <View className="bg-gray-100">
                      <View className="flex flex-row">
                        <Pressable
                          onPress={() => {
                            setSelectedConversation(product.userId);
                            if (Platform.OS === "web") {
                              router.push("/Chat");
                            } else {
                              router.push("/RightPart/Right");
                            }
                          }}
                        >
                          <View className="mt-12 h-12 ms-5 mr-auto w-[150px] bg-TealGreen rounded-sm justify-center items-center">
                            <Text className="text-white text-lg">Chat</Text>
                          </View>
                        </Pressable>
                        {Platform.OS !== "web" ? (
                          <Pressable
                            className="mt-12 h-12 ms-5 w-[150px] bg-TealGreen rounded-sm justify-center items-center absolute right-6"
                            onPress={openDailer}
                          >
                            <Text className="text-white text-lg">Call</Text>
                          </Pressable>
                        ) : null}
                      </View>

                      <View className="flex flex-row mt-8 ">
                        <View className="mt-2 h-10 ms-5 w-[100px] bg-TealGreen rounded-sm justify-center items-center">
                          <Text className="text-white text-lg">
                            $ {product.price}
                          </Text>
                        </View>
                        <View className=" absolute right-10 mt-2 p-2 w-[100px] bg-yellow-500 rounded-sm justify-center items-center">
                          <Text className=" text-base font-bold">
                            {product.priceType || "Negotiable"}
                          </Text>
                        </View>
                      </View>

                      <ProductDetails product={product} />
                    </View>
                  </View>
                </View>
              </View>
            </>
          ) : (
            ""
          )}

          <Recommeded />
          {Platform.OS === "web" && <Footer />}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
