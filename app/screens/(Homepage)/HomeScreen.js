import { Platform, ScrollView, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/app/context/LoadingContext";
import useApi from "@/app/hooks/useApi";
import All from "@/app/component/(subMenu)/All";
import Banner from "./Banner";
import Recommeded from "./Recommeded";
import Explore from "./Explore";
import GuidePage from "./GuidePage";
import LocationBased from "./LocationBased";
import Contact from "./Contact";
import Footer from "@/app/component/(footer)/Footer";
import Loading from "@/app/component/Loading";
import ImageSlider from "@/app/component/(mobileHeader)/ImageSlider";
import useGeoLocation from "@/app/hooks/GeoLocation";

export default function HomeScreen() {
  const [pageDetails, setPageDetails] = useState(null);
  const { geoCoords } = useGeoLocation();

  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);
  const { getJsonApi } = useApi();
  console.log("location in hoepage :", geoCoords);

  useEffect(() => {
    const isValidNumber = (val) => typeof val === "number" && !isNaN(val);

    if (
      geoCoords &&
      isValidNumber(geoCoords.latitude) &&
      isValidNumber(geoCoords.longitude)
    ) {
      fetchDetails();
    }
  }, [geoCoords]);

  const fetchDetails = async () => {
    startLoading();
    try {
      const queraystring = new URLSearchParams(geoCoords).toString();
      const data = await getJsonApi(`homepage/?${queraystring}`);
      console.log("data : ", data);
      setPageDetails(data.data);
      console.log(data, "data in home page");
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  if (isLoading || pageDetails === null) {
    return <Loading />;
  }

  return (
    <ScrollView>
      {/* {Platform.OS === "web" && <Header />} */}
      {Platform.OS !== "web" && <ImageSlider />}
      {Platform.OS === "web" && <All />}
      {Platform.OS === "web" && <Banner />}
      {pageDetails && (
        <>
          <Recommeded
            recommendedProducts={
              pageDetails.recommentedProducts[0].productsWithFiles
            }
          />
          <Explore categoriesData={[pageDetails.category]} />
        </>
      )}
      {Platform.OS === "web" && <GuidePage />}
      <LocationBased locationProducts={pageDetails.locationProducts} />
      {Platform.OS === "web" && <Contact />}
      {Platform.OS === "web" && <Footer />}
    </ScrollView>
  );
}
