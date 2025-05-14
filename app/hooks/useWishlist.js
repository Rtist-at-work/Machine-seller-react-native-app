import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "./useApi";

const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { pathchApi } = useApi();

  const addToWishlist = async (product) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const data = await pathchApi(
        `wishlist/add`,
        {
          productId: product._id,
        },
        token
      );
      setWishlist(data.data.favourites); // Update the wishlist with the new data
    } catch (err) {
      console.log("Error adding to wishlist:", err);
    }
  };

  return {
    wishlist,
    addToWishlist,
    setWishlist,
  };
};

export default useWishlist;
