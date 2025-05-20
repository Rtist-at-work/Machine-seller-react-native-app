import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";

const useGeoLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState({});

  useEffect(() => {
    getLocation();
  }, []);

  // Fetch address whenever location updates
  useEffect(() => {
    if (location) {
      console.log(location);
      fetchAddress(location.latitude, location.longitude);
    }
  }, [location]);

  const getLocation = async () => {
    if (Platform.OS === "web") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({
              latitude: latitude,
              longitude: longitude,
            });

            // Call fetchAddress with the obtained coordinates
            await fetchAddress(latitude, longitude);
          },
          (error) => {
            console.error("Geolocation Error:", error);
          },
          { enableHighAccuracy: true } // Requests the most precise location
        );
      } else {
        setErrorMsg("Geolocation is not supported by this browser");
      }
    } else {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission denied");
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      });

      // Optionally fetch address here as well
      await fetchAddress(
        locationResult.coords.latitude,
        locationResult.coords.longitude
      );
    }
  };
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      console.log('response :', response);

      const data = await response.json();

      console.log('location :', data);


      if (data.address) {
        setAddress({
          district:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          state: data.address.state || "",
          country: data.address.country || "",
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };
  console.log('location in geo :', location)
  return {
    geoCoords: location || {},
    errorMsg,
    address: address || "Fetching address...",
  };
};

export default useGeoLocation;
