import { useState, useEffect } from "react";
import useApi from "./useApi";

const GetMechanic = () => {
  const { getJsonApi } = useApi();
  const [mechanics, setMechanics] = useState([]);
  const [location,setLocation] = useState({})
  const [industries,setIndustries] = useState([])
  const [categories,setCategories] = useState([])
  const [page,setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  // const [userId, setUserId] = useState(null);
  // const [userProfile, setUserProfile] = useState(null);
console.log("page :",page)
  useEffect(() => {
    async function fetchMechanics() {
      try {
        const data = await getJsonApi(`mechanicList/?page=${page}&limit=50`);
        setMechanics(data.data.mechanics.data);
        setTotalPages(data.data.mechanics.totalPages)
        setIndustries(data.data.industry)
        setCategories(data.data.category)
        setLocation(data.data.location)
      } catch (err) {
        console.log(err);
      }
    }

    fetchMechanics();
  }, [page]);

  // useEffect(() => {
  //   if (userId && mechanics.length > 0) {
  //     const found = mechanics.find((mech) => mech._id === userId);
  //     setUserProfile(found || null);
  //   }
  // }, [userId, mechanics]);

  return { mechanics,setMechanics, industries, categories, location,page,setPage,totalPages,setTotalPages };
};

export default GetMechanic;
