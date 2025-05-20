import { useState, useEffect } from "react";
import useApi from "./useApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GetMechanic = () => {
  const { getJsonApi } = useApi();
  const [mechanics, setMechanics] = useState([]);
  const [location, setLocation] = useState({});
  const [industries, setIndustries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [otherThanIndiaLocation, setOtherThanIndiaLocation] = useState([]);
  const [qr, setQr] = useState(true);

  useEffect(() => {
    async function fetchMechanics() {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const data = await getJsonApi(
          `mechanicList/?page=${page}&limit=50`,
          token
        );

        setMechanics(data?.data?.mechanics?.data);
        setTotalPages(data?.data?.mechanics?.totalPages);
        setIndustries(data?.data?.industry);
        setCategories(data?.data?.category);
        setLocation(data?.data?.location);
        setOtherThanIndiaLocation(data?.data?.otherThanIndia);
        setQr(data?.data?.mechanics?.qr);
      } catch (err) {
        console.log(err);
      }
    }

    fetchMechanics();
  }, [page]);

  return {
    mechanics,
    setMechanics,
    industries,
    categories,
    location,
    page,
    setPage,
    totalPages,
    setTotalPages,
    setOtherThanIndiaLocation,
    otherThanIndiaLocation,
    setQr,
    qr,
  };
};

export default GetMechanic;
