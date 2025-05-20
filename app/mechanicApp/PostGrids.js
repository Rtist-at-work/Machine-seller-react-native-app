import React from "react";
import { View, Image, FlatList, Pressable } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

const PostGrid = ({ posts, onPostPress, width }) => {
  const columns = width >= 1024 ? 4 : 3;

  return (
    <FlatList
      data={posts}
      key={`cols-${columns}`} // 👈 key changes when column count changes
      keyExtractor={(item) => item._id}
      className={`p-4 ${width >= 1024 ? "px-8" : ""}`}
      numColumns={columns}
      renderItem={({ item, index }) => {
        const isVideo = item.media.length === 24; // assume 24-character ID = video

        return (
          <Pressable
            onPress={() => {
              onPostPress(index);
            }}
            style={{
              width: width >= 1024 ? "25%" : "33.33%",
              aspectRatio: 1,
              padding: 1,
            }}
          >
            {isVideo ? (
              <VideoGridItem
                videoId={item.media}
                onPostPress={onPostPress}
                index={index}
              />
            ) : (
              <Image
                source={{ uri: `data:image/jpeg;base64,${item.media}` }}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
          </Pressable>
        );
      }}
    />
  );
};

const VideoGridItem = ({ videoId, onPostPress, index }) => {
  const player = useVideoPlayer(
    `http://192.168.200.158:5000/video/${videoId}`,
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  return (
    <Pressable
      onPress={() => onPostPress(index)}
      className="flex justify-center items-center h-full w-full"
    >
      <View className="h-full w-full">
        <VideoView
          player={player}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
};

export default PostGrid;
