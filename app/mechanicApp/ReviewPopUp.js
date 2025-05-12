import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Add icon library for star rating

const ReviewPopup = ({
  visible,
  onClose,
  handleReviewSubmit,
  setRating,
  rating,
  reviewText,
  setReviewText,

}) => {
  const { width, height } = Dimensions.get("window"); // Get device width and height

  // Function to handle star rating
  const handleStarPress = (index) => {
    setRating(index + 1); // Set rating value based on star index
  };

  return (
    <>
      {/* {visible && ( */}
      <View style={styles.overlay} className="z-999 inset-0 h-screen">
        <View
          style={[
            styles.popupContainer,
            { width: width >= 1024 ? 500 : "90%", height: "auto" },
          ]}
        >
          {/* Close Button */}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          {/* Review Title */}
          <Text style={styles.title}>Add Your Review</Text>

          {/* Star Rating */}
          <View style={styles.starContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
              >
                <Ionicons
                  name={index < rating ? "star" : "star-outline"}
                  size={30}
                  color={index < rating ? "#FFD700" : "red"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Review Text Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Write your review..."
            placeholderTextColor="#888"
            multiline
            numberOfLines={4}
            value={reviewText}
            onChangeText={setReviewText}
          />

          {/* Submit Button */}
          <Pressable onPress={handleReviewSubmit} style={styles.submitButton}>
            <Text style={styles.submitText}>Submit Review</Text>
          </Pressable>
        </View>
      </View>
      {/* )} */}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignSelf: "center",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay background
  },
  popupContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    elevation: 10, // Adds shadow
    alignItems: "center",
    width: "90%",
    maxWidth: 500,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    color: "#333",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    height: 100,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    color: "#000",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReviewPopup;
