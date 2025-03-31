import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useConversation from "../stateManagement/useConversation";
import useApi from "../hooks/useApi";
import axios from "axios";

const useGetMessages = () => {
  const { messages, setMessage, selectedConversation } = useConversation();
  const { getJsonApi } = useApi();
  console.log(selectedConversation, setMessage)

  useEffect(() => {
    const getMessages = async () => {
      if (selectedConversation) {
        try {
          const token = await AsyncStorage.getItem("userToken"); // Retrieve token from AsyncStorage
          const res = await getJsonApi(
            `message/get/${selectedConversation}`,
            token
          );
          console.log(res)
          setMessage(res.data);
        } catch (error) {
          console.log("Error in getting messages:", error);
        } finally {
        }
      }
    };
    getMessages();
  }, [selectedConversation]);

  return {  messages };
};

export default useGetMessages;
