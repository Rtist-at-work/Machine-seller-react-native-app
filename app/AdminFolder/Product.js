import React from "react";
import {
  Pressable,
  View,
  Platform,
  Image,
  Text,
  ScrollView,
} from "react-native";

const Product = ({ products, setIsModalVisible, setCurrentIndex, status }) => {
  return (
    <ScrollView showsHorizontalScrollIndicator={true}>
      <View
        className="grid gap-4 mt-2 px-4"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Increased min size for better readability
        }}
      >
        {products?.length > 0 &&
          products.map(
            (product, index) =>
              product?.adminApproval === status ? (
                <Pressable
                  key={index}
                  className="mb-4"
                  style={{
                    width: Platform.OS !== "web" ? "90%" : "100%",
                    maxWidth: 400,
                    margin: "auto",
                  }}
                >
                  <View className="rounded-2xl p-3 bg-white border border-gray-300 shadow-sm">
                    <Pressable
                      onPress={() => {
                        setIsModalVisible(true);
                        setCurrentIndex(index);
                      }}
                    >
                      <View style={{ position: "relative" }}>
                        <Image
                          className="rounded-md"
                          source={{
                            uri: `data:image/jpeg;base64,${product.machineImages[0][0]}`,
                          }}
                          style={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                          }}
                        />
                        <View className="flex flex-row items-center justify-between mt-4 mb-2">
                          <View className="p-2 w-[100px] bg-TealGreen rounded-md justify-center items-center">
                            <Text className="text-white text-base font-bold">
                              ₹ {product.price}
                            </Text>
                          </View>
                          <Text className="text-TealGreen font-bold text-base">
                            {product.condition}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text className="text-TealGreen font-semibold mt-2 mb-1 truncate">
                          {product.category}
                        </Text>
                        <Text
                          className="text-gray-600 font-semibold mt-1 overflow-hidden"
                          numberOfLines={2}
                        >
                          {product.description}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </Pressable>
              ) : null // Using `null` instead of an empty string
          )}
      </View>
    </ScrollView>
  );
};

export default Product;
