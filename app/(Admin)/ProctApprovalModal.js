import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  FlatList,
  Image,
  Button,
} from "react-native";
import { Text, Modal } from "react-native";
import { useEvent } from "expo";
import { useVideoPlayer, Video } from "expo-video";

const ProductApprovalModal = ({
  product,
  isVisible,
  onClose,
  onApprove,
  onReject,
  onNext,
  onPrev,
  currentIndex,
  totalProducts,
}) => {
  return (
    <Modal visible={isVisible} animationType="slide">
      <View className="flex-1 bg-white p-4 rounded-lg">
        <Pressable
          onPress={onClose}
          className="absolute top-4 right-4 z-50 bg-gray-400 h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
        >
          <Text className="text-2xl font-bold text-red">✕</Text>
        </Pressable>

        <ScrollView className="flex-1 p-4">
          {product && (
            <>
              <View className="bg-white p-4 rounded-lg shadow-md">
                <Text className="text-xl font-bold text-gray-900">
                  {product.make} - {product.category}
                </Text>
                <Text className="text-base text-gray-700 mt-2">
                  Condition: {product.condition}
                </Text>
                <Text className="text-base text-gray-700">
                  Industry: {product.industry}
                </Text>
                <Text className="text-base text-gray-700">
                  {/* Location: {product.location.state, product.location.district} */}
                </Text>
                <Text className="text-base text-gray-700">
                  Contact: {product.contact}
                </Text>
                <Text className="text-base text-gray-700 mt-2">
                  Description: {product.description}
                </Text>
                <Text className="text-xl font-bold text-teal-600 mt-4">
                  ₹ {product.price} ({product.priceType || "negotiable"})
                </Text>
              </View>

              {product.machineImages.length > 0 && (
                <>
                  <Text className="text-lg font-bold mt-6">Images</Text>
                  <FlatList
                    data={product.machineImages}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <Image
                        source={{ uri: `data:image/jpeg;base64,${item}` }}
                        className="w-72 h-48 rounded-lg m-2"
                      />
                    )}
                  />
                </>
              )}

              {/* {product.machineVideos?.length > 0 && (
                <>
                  <Text className="text-lg font-bold mt-6">Videos</Text>
                  {product.machineVideos.map((vid, index) => {
                    const player = useVideoPlayer(vid.uri, (player) => {
                      player.loop = true;
                      player.play();
                    });
                    const { isPlaying } = useEvent(player, "playingChange", {
                      isPlaying: player.playing,
                    });

                    return (
                      // <View key={index} className="mt-2">
                      //   <Video
                      //     source={{ uri: `data:video/mp4;base64,${vid.uri}` }}
                      //     style={{ width: 300, height: 200 }}
                      //     shouldPlay
                      //     useNativeControls
                      //   />
                      //   <Button
                      //     title={isPlaying ? "Pause" : "Play"}
                      //     onPress={() => {
                      //       if (isPlaying) {
                      //         player.pause();
                      //       } else {
                      //         player.play();
                      //       }
                      //     }}
                      //   />
                      // </View>
                    );
                  })}
                </>
              )} */}
            </>
          )}
        </ScrollView>

        <View className="flex-row justify-between mt-4">
          <Pressable
            onPress={() => {
              onApprove(currentIndex, "approved");
              currentIndex < totalProducts - 1 ? onNext() : onClose();
            }}
            className="bg-green-600 px-6 py-3 rounded-lg w-5/12 items-center"
          >
            <Text className="text-white font-bold">Approve</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              onApprove(currentIndex, "rejected");
              currentIndex < totalProducts - 1 ? onNext() : onClose();
            }}
            className="bg-red-600 px-6 py-3 rounded-lg w-5/12 items-center"
          >
            <Text className="text-white font-bold">Reject</Text>
          </Pressable>
        </View>

        <View className="flex-row justify-between mt-4">
          <Pressable
            onPress={onPrev}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-lg w-5/12 items-center ${
              currentIndex === 0 ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            <Text className="text-white font-bold">Previous</Text>
          </Pressable>
          <Pressable
            onPress={onNext}
            disabled={currentIndex === totalProducts - 1}
            className={`px-6 py-3 rounded-lg w-5/12 items-center ${
              currentIndex === totalProducts - 1 ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            <Text className="text-white font-bold">Next</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ProductApprovalModal;
