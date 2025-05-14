import {
  View,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
  TextInput,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Divider } from "react-native-paper";
import { Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import useApi from "@/app/hooks/useApi";
import GuidePage from "../(Homepage)/GuidePage";
import Footer from "@/app/component/(footer)/Footer";
import { Ionicons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";

import { useNavigation } from "@react-navigation/native";
import All from "@/app/component/(subMenu)/All";
import FilterComponent from "@/app/mechanicApp/Filter";

export default function ProductList() {
  const router = useRouter();
  const route = useRoute();
  const navigation = useNavigation();

  const { getJsonApi } = useApi();
  const { width } = useWindowDimensions();
  const screen = width > 1024;
  const [products, setProducts] = useState([]);

  // console.log(products, "productdsd");
  const [originalProducts, setOriginalProducts] = useState([]);

  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedId, setSelectedId] = useState("1");
  const [otherThanIndia, setOtherThanIndia] = useState(false);
  const priceSuggestions = ["500", "1000", "5000", "10000"];
  const [selectedPriceType, setSelectedPriceType] = useState("1");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [statesWithDistricts, setStateWithDistricts] = useState([]);

  // const handleStateClick = (state) => {
  //   setSelectedState(state);
  //   setSelectedDistricts(statesWithDistricts[state] || []);
  // };

  console.log("products :", products);
  const [storePrice, setStorePrice] = useState({
    fromPrice: "",
    toPrice: "",
  });

  const [price, setPrice] = useState({
    fromPrice: "",
    toPrice: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrice(storePrice);
    }, 100);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    priceFilter();
  }, [price]);

  const handleFromPriceChange = (value) => {
    setStorePrice((prev) => ({ ...prev, fromPrice: value }));
  };
  const handleToPriceChange = (value) => {
    setStorePrice((prev) => ({ ...prev, toPrice: value }));
  };

  const priceFilter = () => {
    const from = parseFloat(price.fromPrice);
    const to = parseFloat(price.toPrice);

    const filtered = originalProducts.filter((product) => {
      const priceCondition =
        (!price.fromPrice || product.price >= from) &&
        (!price.toPrice || product.price <= to);

      const brandCondition = selectedBrand
        ? product.brand.toLowerCase().includes(selectedBrand.toLowerCase())
        : true;

      return priceCondition && brandCondition; // Apply both filters
    });

    setProducts(filtered); // Update the filtered products
  };

  // Filter states
  const filters = ["Location", "Price", "Price Type", "Brand"];

  // products.forEach((product) => {
  //   console.log(product?.price, "price");
  // });

  const searchTerm = useMemo(() => {
    if (Platform.OS === "web") {
      const { searchTerms, category, industry } = useLocalSearchParams();
      return [searchTerms, category, industry];
    } else {
      const { searchTerms, category, industry } = route.params;
      return [searchTerms, category, industry];
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedId]);

  const fetchProducts = async () => {
    try {
      const priceType = selectedId === "1" ? "price" : "negotiable";
      // let query = searchTerm || priceType;
      // const searchTerms = ['tractor', 'Farm Equipement', 'agriculture'];

      const query = searchTerm
        .map((term) => `searchTerm=${encodeURIComponent(term)}`)
        .join("&");
      const data = await getJsonApi(`productPage?${query}`);

      console.log("@data :", data);
      setProducts(data.data?.products[0]?.productsWithFiles);
      setStateWithDistricts(data.data?.products[0]?.location);
      setOriginalProducts(data.data.products); // 👈 Save full copy here
    } catch (error) {
      console.error(error);
    }
  };

  let industry;

  if (Platform.OS === "web") {
    industry = useLocalSearchParams().industry;
  } else {
    industry = route?.params?.industry;
  }

  const handleProductPress = (product) => {
    console.log("productlistpage:", product);
    if (Platform.OS === "web") {
      // router.push(`/(screen)/SelectProduct?id=${product}`);
      router.push(`/screens/(productPage)/SelectProduct?id=${product}`);
    } else {
      navigation.navigate("SelectProduct", { id: product });
    }
  };
  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    priceFilter(); // Apply the filter whenever the brand changes
  };

  const radioButtonData = [
    { id: "1", label: "Fixed", value: "fixed" },
    { id: "2", label: "Negotiable", value: "negotiable" },
  ];
  const toggleFilter = (filter) =>
    setActiveFilter(activeFilter === filter ? null : filter);
  // console.log(produ)
  return (
    <ScrollView>
      <SafeAreaView>
        <All />
        <View
          className="flex flex-row pt-2 pl-2 mt-1 bg-zinc-100 shadow items-center "
          style={{ zIndex: -1 }}
        >
          <Text className="text-lg">Home</Text>
          <Ionicons
            name="chevron-forward"
            size={13}
            color="black"
            style={{ marginTop: "5px" }}
          />
          {products && Object.keys(products).length > 0 && (
            <View>
              <Text className="text-gray-500 text-lg">
                {products[Object.keys(products)[0]]?.industry ||
                  "No industry information available"}
              </Text>
            </View>
          )}
        </View>
        {!screen && !isOpen && (
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Octicons
              name="filter"
              size={24}
              color="black"
              className="ml-2 mt-2"
            />
          </Pressable>
        )}

        <View style={{ zIndex: -1 }}>
          <View className="flex flex-row px-3 rounded-sm mt-6 mb-4  ">
            {/* Sidebar Filter */}
            {(width >= 1024 || toggleFilter) && (
              <View
                className={`${width < 1024 ? "absolute z-50 w-[90%]" : ""}`}
              >
                <FilterComponent
                  page="machine"
                  radioButtonData={radioButtonData}
                  setSelectedPriceType={setSelectedPriceType}
                  selectedPriceType={selectedPriceType}
                  // industries={industries}
                  // categories={categories}
                  location={statesWithDistricts}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  selectedDistrict={selectedDistrict}
                  setSelectedDistrict={setSelectedDistrict}
                  ProductList={ProductList}
                  priceSuggestions={priceSuggestions}
                  storePrice={storePrice}
                  // selectedIndustry={selectedIndustry}
                  // setSelectedIndustry={setSelectedIndustry}
                  // selectedCategory={selectedCategory}
                  // setSelectedCategory={setSelectedCategory}
                  // selectedSubCategory={selectedSubCategory}
                  // setSelectedSubCategory={setSelectedSubCategory}
                  // selectedServices={selectedServices}
                  // setSelectedServices={setSelectedServices}
                  // selectedRating={selectedRating}
                  // setSelectedRating={setSelectedRating}
                />
              </View>
            )}

            {/* Main Product List */}
            <ScrollView
              className={`${isOpen ? "w-[80%]" : "w-full"} mb-4 transition-all`}
            >
              <View
                className="grid gap-4 mt-2 px-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                }}
              >
                {products?.length > 0 &&
                  products.map((product) => (
                    <Pressable
                      // key={product._id}
                      onPress={() => handleProductPress(product._id)}
                      className="mb-4"
                      style={{
                        width: Platform.OS !== "web" ? "90%" : "100%",
                        maxWidth: 400,
                        margin: "auto",
                      }}
                    >
                      <View className="rounded-2xl p-3 bg-white border border-gray-300 shadow-sm">
                        <View style={{ position: "relative", zIndex: -1 }}>
                          <Image
                            className="rounded-md"
                            source={{
                              uri: `data:image/jpeg;base64,${product.machineImages[0]}`,
                            }}
                            style={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                            }}
                          />
                          <View className="flex flex-row items-center justify-between mt-4 mb-2">
                            <View className="p-2 w-[100px] bg-TealGreen rounded-md justify-center items-center">
                              <Text className="text-white text-base font-bold">
                                ₹ {product.price}
                              </Text>
                            </View>
                            <Text className="text-TealGreen font-bold text-base">
                              {product.condition}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text className="text-TealGreen font-semibold mt-2 mb-1 truncate">
                            {product.category}
                          </Text>
                          <Text
                            className="text-gray-600 font-semibold mt-1 overflow-hidden"
                            numberOfLines={2}
                          >
                            {product.description}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
              </View>

              {/* Pagination (optional) */}
              <View className="flex items-end justify-center w-full my-4">
                <Pressable
                  className="bg-blue-600 rounded-sm w-[100px] flex items-center justify-center"
                  style={{ height: 30 }}
                >
                  <Text className="text-white font-semibold text-sm">
                    Next Page
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>

          {/* Web only footer sections */}
          {Platform.OS === "web" && <GuidePage />}
          {Platform.OS === "web" && <Footer />}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

// import {
//   View,
//   Text,
//   Pressable,
//   Image,
//   useWindowDimensions,
//   TextInput,
//   ScrollView,
//   Platform,
//   Button,
//   FlatList,
// } from "react-native";
// import React, { useEffect, useMemo, useState } from "react";

// import { Divider } from "react-native-paper";
// import RadioGroup from "react-native-radio-buttons-group";
// import Icon from "react-native-vector-icons/Ionicons";
// import { useLocalSearchParams } from "expo-router";

// import { Link } from "expo-router";
// import { Checkbox } from "react-native-paper";
// import useApi from "@/app/hooks/useApi";
// import Header from "@/app/component/(header)/Header";
// import All from "@/app/component/(subMenu)/All";
// import GuidePage from "../(Homepage)/GuidePage";
// import Footer from "@/app/component/(footer)/Footer";

// export default function ProductList() {
//   // const productPage = () => {
//   //   router.push("/(component)/(screen)/SelectProduct");
//   // };
//   const radioButton = useMemo(() => [
//     {
//       id: 1,
//       label: "Price",
//     },
//     {
//       id: 2,
//       label: "Negotiable",
//     },
//   ]);
//   const { searchTerms, priceType } = useLocalSearchParams() ?? {};

//   const { getJsonApi } = useApi();

//   const [products, setProducts] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const { width } = useWindowDimensions();
//   const screen = width > 1024;

//   const [filterProduct, setFilterProduct] = useState([]);
//   console.log("filterProdyct", filterProduct);
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");

//   const priceFilter = () => {
//     if (!from || !to) return;

//     const filterd = products.filter((product) => {
//       return product.price >= Number(from) && product.price <= Number(to);
//     });
//     setFilterProduct(filterd);
//   };

//   useEffect(() => {
//     if (searchTerms) {
//       fetchProducts();
//     }
//   }, [searchTerms]);

//   const fetchProducts = async () => {
//     try {
//       let data;
//       if (searchTerms) {
//         data = await getJsonApi(`productPage/${searchTerms}`);
//       } else {
//         data = await getJsonApi(`productPage/${priceType}`);
//       }
//       console.log(data);
//       setProducts(data.data.products);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   console.log(products);

//   const [activeFilter, setActiveFilter] = useState(null);
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistricts, setSelectedDistricts] = useState([]);

//   const filters = ["Location", "Price", "Price Type", "Brand"];
//   const priceSuggestions = ["500", "1000", "5000", "10000"];

//   const radioButtonData = [
//     { id: "1", label: "Fixed", value: "fixed" },
//     { id: "2", label: "Negotiable", value: "negotiable" },
//   ];
//   const [selectedPriceType, setSelectedPriceType] = useState("1");

//   const toggleFilter = (filter) =>
//     setActiveFilter(activeFilter === filter ? null : filter);

//   const handleStateClick = (state) => {
//     setSelectedState(state);
//     setSelectedDistricts(statesWithDistricts[state] || []);
//   };
//   const statesWithDistricts = {
//     "Tamil Nadu": [
//       "Chennai",
//       "Coimbatore",
//       "Madurai",
//       "Tiruchirappalli",
//       "Salem",
//       "Erode",
//       "Thanjavur",
//       "Vellore",
//       "Tirunelveli",
//       "Dindigul",
//     ],
//     Karnataka: [
//       "Bengaluru Urban",
//       "Mysuru",
//       "Mangaluru",
//       "Hubballi",
//       "Belagavi",
//       "Davanagere",
//       "Tumakuru",
//       "Shivamogga",
//     ],
//     Kerala: [
//       "Thiruvananthapuram",
//       "Kochi",
//       "Kozhikode",
//       "Thrissur",
//       "Alappuzha",
//       "Kollam",
//       "Kannur",
//       "Palakkad",
//     ],
//     Maharashtra: [
//       "Mumbai",
//       "Pune",
//       "Nagpur",
//       "Nashik",
//       "Thane",
//       "Aurangabad",
//       "Solapur",
//       "Kolhapur",
//     ],
//   };
//   const [otherThanIndia, setOtherThanIndia] = useState(false);

//   return (
//     <ScrollView>
//       <View className={`${Platform.OS !== "web" ? "mt-24" : ""}`}>
//         <All />
//         <View
//           className="flex flex-row px-3 rounded-sm mt-5  "
//           style={{ zIndex: -1 }}
//         >
//           {/* Left Side (Fixed) */}
//           {(width >= 1024 || isOpen) && (
//             <View
//               className={`flex-row bg-white p-4 ${
//                 width < 1024 ? "absolute z-50 h-screen w-[90%]" : ""
//               } rounded-md shadow-md`}
//             >
//               {/* Left Column: Filter Tabs */}
//               <View className={` ${width < 1024 ? "w-[100px]" : "w-[150px]"}`}>
//                 {filters.map((filter) => (
//                   <Pressable
//                     key={filter}
//                     onPress={() => toggleFilter(filter)}
//                     className={`p-2 mb-2 rounded-sm  ${
//                       activeFilter === filter ? "bg-red-500" : "bg-gray-200"
//                     }`}
//                   >
//                     <Text
//                       className={`font-semibold ${
//                         activeFilter === filter ? "text-white" : "text-black"
//                       }`}
//                     >
//                       {filter}
//                     </Text>
//                   </Pressable>
//                 ))}
//               </View>

//               {/* Right Column: Filter Details */}
//               <View className="w-[272px] pl-4">
//                 {activeFilter === "Location" && (
//                   <View className="h-96">
//                     <View
//                       className={`flex ${
//                         width < 1024 ? "flex-col" : "flex-row"
//                       } items-center justify-between mt-2`}
//                     >
//                       <Text className="font-semibold text-base mb-2 text-red-500">
//                         Select State
//                       </Text>
//                       <View className="flex-row items-center mb-3">
//                         <Checkbox
//                           status={otherThanIndia ? "checked" : "unchecked"}
//                           onPress={() => setOtherThanIndia(!otherThanIndia)}
//                           color="#EF4444"
//                         />
//                         <Text className="ml-2 text-base">Other than India</Text>
//                       </View>
//                     </View>
//                     {/* Show state selection only if 'Other than India' is not checked */}
//                     {!otherThanIndia && (
//                       <>
//                         <ScrollView className="h-[150px]">
//                           {Object.keys(statesWithDistricts).map((state) => (
//                             <Pressable
//                               key={state}
//                               onPress={() => handleStateClick(state)}
//                               className={`p-2 rounded-sm mb-1 ${
//                                 selectedState === state
//                                   ? "bg-gray-300"
//                                   : "bg-gray-100"
//                               }
//                                  ${width < 1024 ? "w-[200px]" : "w-[300px]"}
//                                 `}
//                             >
//                               <Text className="text-base">{state}</Text>
//                             </Pressable>
//                           ))}
//                         </ScrollView>

//                         {selectedDistricts.length > 0 && (
//                           <>
//                             <Divider className="my-3" />
//                             <Text className="font-semibold text-lg text-red-500">
//                               Districts in {selectedState}
//                             </Text>
//                             <ScrollView className="max-h-[100px] mt-2">
//                               {selectedDistricts.map((district) => (
//                                 <Text
//                                   key={district}
//                                   className="text-base text-gray-700"
//                                 >
//                                   • {district}
//                                 </Text>
//                               ))}
//                             </ScrollView>
//                           </>
//                         )}
//                       </>
//                     )}
//                   </View>
//                 )}

//                 {activeFilter === "Price" && (
//                   <View>
//                     <Text className="font-semibold text-lg text-red-500 mb-2">
//                       Price Range
//                     </Text>
//                     <View className="flex flex-col gap-4 mb-3">
//                       <TextInput
//                         value={from}
//                         onChangeText={(value) => setFrom(value)}
//                         placeholder="From"
//                         keyboardType="numeric"
//                         className="border-2 w-full h-10 rounded-sm px-3 border-gray-300"
//                       />
//                       <TextInput
//                         value={to}
//                         onChangeText={(value) => setTo(value)}
//                         placeholder="To"
//                         keyboardType="numeric"
//                         className="border-2 w-full h-10 rounded-sm px-3 border-gray-300"
//                       />
//                       <Button title="Apply Filter" onPress={priceFilter} />
//                     </View>

//                     <Text className="text-base font-medium mb-1 mt-4">
//                       Suggestions:
//                     </Text>
//                     <View className="flex-row flex-wrap gap-2 mt-4">
//                       {priceSuggestions.map((p) => (
//                         <Pressable onPress={() => {}}>
//                           <Text
//                             key={p}
//                             className="bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer"
//                           >
//                             ₹ {p}
//                           </Text>
//                         </Pressable>
//                       ))}
//                     </View>
//                   </View>
//                 )}

//                 {activeFilter === "Price Type" && (
//                   <View>
//                     <Text className="font-semibold text-lg text-red-500 mb-2">
//                       Select Price Type
//                     </Text>
//                     <RadioGroup
//                       radioButtons={radioButtonData}
//                       onPress={setSelectedPriceType}
//                       selectedId={selectedPriceType}
//                       layout="row"
//                     />
//                   </View>
//                 )}

//                 {activeFilter === "Brand" && (
//                   <View>
//                     <Text className="font-semibold text-lg text-red-500 mb-2">
//                       Brand Name
//                     </Text>
//                     <TextInput
//                       placeholder="Enter brand"
//                       className="border-2 border-gray-300 h-10 w-full rounded-sm px-3"
//                     />
//                   </View>
//                 )}
//               </View>
//             </View>
//           )}

//           <ScrollView
//             className={`${isOpen ? "w-[80%]" : "w-full"}  mb-4 transition-all `}
//           >
//             {!screen && !isOpen && (
//               <Pressable
//                 onPress={() => setIsOpen(!isOpen)}
//                 className="flex flex-row  "
//               >
//                 <Icon name="filter" size={30} color="black" />
//                 <Text className="mt-2 ms-2">Fliter</Text>
//               </Pressable>
//             )}

//             <FlatList
//               data={filterProduct.length > 0 ? filterProduct : products}
//               keyExtractor={(item, index) =>
//                 item.id ? item.id.toString() : index.toString()
//               }
//             />

//             <View
//               className="grid gap-4 mt-2 px-4"
//               style={{
//                 gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Increased min size for better readability
//               }}
//             >
//               {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map(
//                 (n) =>
//                   products.length > 0 &&
//                   products.map((product, index) => (
//                     <Pressable
//                       key={index}
//                       className="mb-4"
//                       style={{
//                         width: Platform.OS !== "web" ? "90%" : "100%",
//                         maxWidth: 400,
//                         margin: "auto",
//                       }}
//                     >
//                       <View className="rounded-2xl p-3 bg-white border border-gray-300 shadow-sm">
//                         <Link
//                           href={`/screens/(productPage)/SelectProduct?id=${product._id}`}
//                           asChild
//                         >
//                           <Pressable>
//                             <View style={{ position: "relative" }}>
//                               <Image
//                                 className="rounded-md"
//                                 source={{
//                                   uri: `data:image/jpeg;base64,${product.machineImages[0]}`,
//                                 }}
//                                 style={{
//                                   width: "100%",
//                                   height: 200,
//                                   objectFit: "cover",
//                                 }}
//                               />
//                               <View className="flex flex-row items-center justify-between mt-4 mb-2">
//                                 <View className="p-2 w-[100px] bg-TealGreen rounded-md justify-center items-center">
//                                   <Text className="text-white text-base font-bold">
//                                     ₹ {product.price}
//                                   </Text>
//                                 </View>
//                                 <Text className="text-TealGreen font-bold text-base">
//                                   {product.condition}
//                                 </Text>
//                               </View>
//                             </View>
//                             <View>
//                               <Text className="text-TealGreen font-semibold mt-2 mb-1 truncate">
//                                 {product.category}
//                               </Text>
//                               <Text
//                                 className="text-gray-600 font-semibold mt-1 overflow-hidden"
//                                 numberOfLines={2}
//                               >
//                                 {product.description}
//                               </Text>
//                             </View>
//                           </Pressable>
//                         </Link>
//                       </View>
//                     </Pressable>
//                   ))
//               )}
//             </View>

//             <View className="flex items-end justify-center w-full my-4">
//               <Pressable
//                 className="bg-blue-600 rounded-sm w-[100px] flex items-center justify-center"
//                 style={{ height: 30 }}
//               >
//                 <Text className="text-white font-semibold text-sm">
//                   Next Page
//                 </Text>
//               </Pressable>
//             </View>
//           </ScrollView>
//         </View>

//         {Platform.OS === "web" && <GuidePage />}
//         {Platform.OS === "web" && <Footer  />}
//       </View>
//       {/* );
//       })} */}
//     </ScrollView>
//   );
// }
