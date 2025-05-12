import {
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  View,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import profile from "../assests/machine/profile.jpg";
import { BlurView } from "expo-blur";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { useRef, useEffect, useState } from "react";
import CommentModal from "./CommentModal";
import { useSocketContext } from "../context/SocketContext";

const PostViewerModal = ({
  posts,
  activeIndex,
  onClose,
  userProfile,
  width,
  handleLike,
  setPosts,
  handlePostComment,
  comments,
  setComments,
  comment,
  setComment,
  fetchComments,
}) => {
  if (activeIndex === null) return null;

  const scrollRef = useRef(null);
  const postOffsets = useRef([]);
  const [isLayoutDone, setIsLayoutDone] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { socket } = useSocketContext();

  useEffect(() => {
    const handleLikeUpdate = async (data) => {
      try {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id.toString() === data.postId.toString()) {
              return {
                ...post,
                likes: data.likes,
              };
            }
            return post;
          })
        );
      } catch (error) {
        console.log("Error playing notification sound:", error);
      }
    };

    if (socket) {
      socket.on("like-updated", handleLikeUpdate);
    }

    return () => {
      if (socket) {
        socket.off("like-updated", handleLikeUpdate);
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current && isLayoutDone && activeIndex !== null) {
      const targetY = postOffsets.current[activeIndex] || 0;
      // Delay scroll to allow for layout update
      setTimeout(() => {
        scrollRef.current.scrollTo({ y: targetY, animated: false });
      }, 100); // Adjust timeout duration if needed
    }
  }, [activeIndex, isLayoutDone]);

  console.log(posts);

  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <BlurView
        intensity={50}
        tint="light"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        {/* Back Icon */}
        <View
          style={{
            backgroundColor: "#ffffff",
            width: width >= 1024 ? 500 : "100%",
            height: 48,
            padding: 8,
            alignSelf: "center",
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Icon name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          style={{
            backgroundColor: "#ffffff",
            flex: 1,
            width: width >= 1024 ? 500 : "100%",
            alignSelf: "center",
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {posts?.map((post, index) => {
         
            return (
              <View
                key={post._id}
                onLayout={(event) => {
                  const { y } = event.nativeEvent.layout;
                  postOffsets.current[index] = y;

                  if (index === posts.length - 1) {
                    // Set layout done once last post layout is measured
                    setIsLayoutDone(true);
                  }
                }}
                style={{
                  width: "100%",
                  marginBottom: 8,
                }}
              >
                {/* Header */}
                <View
                  className="overflow-hidden py-4"
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    zIndex: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                  }}
                >
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${userProfile?.profileImage}`,
                    }}
                    style={{
                      height: 56,
                      width: 56,
                      borderRadius: 9999,
                      resizeMode: "cover",
                      marginRight: 12,
                    }}
                  />
                  <Text
                    style={{ color: "black", fontWeight: "600", fontSize: 16 }}
                  >
                    {userProfile?.username}
                  </Text>
                </View>

                {/* Content */}
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Media Container */}
                  <View
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      backgroundColor: "#f0f0f0", // Background for the container
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 8,
                    }}
                  >
                    {post.media.length === 24 ? (
                      // <TouchableOpacity
                        // onPress={() => {
                        //   if (isPlaying) {
                        //     player.pause();
                        //   } else {
                        //     player.play();
                        //   }
                        // }}
                      // >
                        <VideoGridItem videoId={post.media} />
                      // </TouchableOpacity>
                    ) : (
                      <Image
                        source={{ uri: `data:image/jpeg;base64,${post.media}` }}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "contain",
                        }}
                      />
                    )}
                  </View>

                  {/* Bio Section */}
                  <View
                    style={{
                      width: "100%",
                      padding: 12,
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", gap: 16 }}
                      className="items-center "
                    >
                      <>
                        {post.likes.includes(post.userId) ? (
                          <FontAwesome
                            name="heart"
                            size={24}
                            color="red"
                            onPress={() => handleLike(post._id)}
                            className="cursor-pointer"
                          />
                        ) : (
                          <Feather
                            name="heart"
                            size={24}
                            color="black"
                            onPress={() => handleLike(post._id)}
                            className="cursor-pointer"
                          />
                        )}
                        <Text>{post?.likes.length}</Text>
                      </>
                      <>
                        <Icon
                          onPress={() => {
                            fetchComments(post._id);
                            setSelectedPost(post._id);
                            setCommentModal(true);
                          }}
                          name="message-circle"
                          size={24}
                          color="TealGreen"
                          className="cursor-pointer"
                        />
                        <Text>{post?.comments.length}</Text>
                      </>

                      <Icon
                        name="send"
                        size={24}
                        color="TealGreen"
                        className="cursor-pointer"
                      />
                    </View>
                    <Text
                      style={{ color: "black", marginTop: 16, marginLeft: 8 }}
                    >
                      {post.bio}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
          {commentModal && (
            <CommentModal
              onClose={() => setCommentModal(false)}
              handlePostComment={handlePostComment}
              comments={comments}
              setComments={setComments}
              comment={comment}
              setComment={setComment}
              selectedPost={selectedPost}
            />
          )}
        </ScrollView>
      </BlurView>
    </Modal>
  );
};


const VideoGridItem = ({ videoId}) => {
  const player = useVideoPlayer(
    `http://192.168.1.9:5000/video/${videoId}`,
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
      <View>
        <VideoView
          player={player}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );
};

export default PostViewerModal;
