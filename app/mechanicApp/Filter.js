import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { Checkbox, Divider } from "react-native-paper"; // Assuming you're using react-native-paper for Checkbox and RadioGroup components
import { useWindowDimensions } from "react-native"; // To detect screen width dynamically
import Icon from "react-native-vector-icons/MaterialIcons";
import RadioGroup from "react-native-radio-buttons-group";

export default function FilterComponent({
  setIsOpen,
  industries,
  categories,
  location,
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  selectedIndustry,
  setSelectedIndustry,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedRating,
  setSelectedRating,
  page,
  radioButtonData,
  setSelectedPriceType,
  selectedPriceType,
  ProductList,
  storePrice,
  selectedDistricts,
  setSelectedDistricts,
}) {
  const { width } = useWindowDimensions(); // Dynamically get the screen width

  const [activeFilter, setActiveFilter] = useState("Location");


  const filters =
    page === "mech"
      ? ["Location", "Ratings", "Industry"]
      : ["Location", "Price Type", "Price", "Brand"];
  const priceSuggestions = ["500", "1000", "5000", "10000"];

  const toggleFilter = (filter) =>
    setActiveFilter(activeFilter === filter ? null : filter);

  const handleStateClick = (state) => {
    // If the state is already selected, deselect it
    if (selectedState === state) {
      setSelectedState("");
      setSelectedDistrict("");
      setSelectedDistricts([]); // Reset districts when state is deselected
    } else {
      setSelectedState(state);
      setSelectedDistricts(location[state] || []);
    }
  };

  const handleDistrictClick = (district) => {
    // If the district is already selected, deselect it
    if (selectedDistrict === district) {
      setSelectedDistrict("");
    } else {
      setSelectedDistrict(district);
    }
  };

  const handleRatingClick = (rating) => {
    // If the rating is already selected, deselect it
    if (selectedRating === rating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
    }
  };

  const [otherThanIndia, setOtherThanIndia] = useState(false);

  // const ProductList = ({ produc, minPrice, maxPrice }) => {
  //   const products = produc.filter(
  //     (product) => product.price >= minPrice && product.price <= maxPrice
  //   );
  // };

  console.log("selectedDistricts :", selectedDistricts);
  console.log("selectedState :", selectedState);
  console.log("selectedDistricts :", selectedRating);
  return (
    <View
      className={`bg-white p-4 rounded-md shadow-md flex ${
        width < 1024
          ? "absolute z-50 h-screen w-full flex-col pb-20"
          : "flex-row"
      }`}
    >
      {/* Left Tabs */}
      <View
        className={`mb-4 ${
          width < 1024 ? "w-full flex-row flex-wrap" : "w-[150px]"
        }`}
      >
        {filters?.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => toggleFilter(filter)}
            className={`p-2 mb-2 rounded-sm mr-2 ${
              activeFilter === filter ? "bg-red-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`font-semibold ${
                activeFilter === filter ? "text-white" : "text-black"
              }`}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Right Filter Details */}
      <View
        className={`pl-4 relative ${
          width < 1024 ? "w-full flex-1 overflow-scroll h-full" : "w-[272px]"
        }`}
      >
        <ScrollView className="h-[90%] mb-4">
          {activeFilter === "Location" && (
            <View className="h-96 ">
              <View
                className={`flex ${
                  width < 1024
                    ? "flex-col"
                    : "flex-row items-center justify-between mt-2"
                }`}
              >
                <Text className="font-semibold text-base mb-2 text-red-500">
                  Select State
                </Text>
                <View className="flex-row items-center mb-3">
                  <Checkbox
                    value={otherThanIndia}
                    onValueChange={() => setOtherThanIndia(!otherThanIndia)}
                    color="#EF4444"
                  />
                  <Text className="ml-2 text-base">Other than India</Text>
                </View>
              </View>
              {!otherThanIndia && (
                <>
                  <ScrollView className="min-h-[150px] max-h-[250px]">
                    {selectedState ? (
                      <Pressable
                        onPress={() =>{
                           setSelectedState("")
                           setSelectedDistricts([])
                          }}
                        className="p-2 rounded-sm mb-1 bg-gray-300"
                      >
                        <Text className="text-base">{selectedState}</Text>
                        <Text className="text-xs text-red-500 underline">
                          ← Change State
                        </Text>
                      </Pressable>
                    ) : (
                      location &&
                      Object.keys(location).map((state) => (
                        <Pressable
                          key={state}
                          onPress={() => handleStateClick(state)}
                          className={`p-2 rounded-sm mb-1 ${
                            selectedState === state
                              ? "bg-gray-300"
                              : "bg-gray-100"
                          } ${width < 1024 ? "w-[200px]" : "w-[300px]"}`}
                        >
                          <Text className="text-base">{state}</Text>
                        </Pressable>
                      ))
                    )}
                  </ScrollView>

                  {selectedDistricts?.length > 0 && (
                    <>
                      <Divider className="my-3" />
                      <Text className="font-semibold text-lg text-red-500">
                        Districts in {selectedState}
                      </Text>
                      <ScrollView className="min-h-[250px] mt-2 ">
                        {selectedDistricts?.map((district) => (
                          <Pressable
                            key={district}
                            onPress={() => handleDistrictClick(district)}
                            className={`p-2 rounded-sm mb-1 ${
                              selectedDistrict === district
                                ? "bg-gray-300"
                                : "bg-gray-100"
                            } ${width < 1024 ? "w-[200px]" : "w-[300px]"}`}
                          >
                            <Text className="text-base">{district}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </>
                  )}
                </>
              )}
            </View>
          )}

          {activeFilter === "Price" && (
            <View>
              <Text className="font-semibold text-lg text-red-500 mb-2">
                Price Range
              </Text>
              <View className="flex flex-col gap-4 mb-3">
                <TextInput
                  placeholder="From"
                  keyboardType="numeric"
                  className="border-2 w-full h-10 rounded-sm px-3 border-gray-300"
                />
                <TextInput
                  placeholder="To"
                  keyboardType="numeric"
                  className="border-2 w-full h-10 rounded-sm px-3 border-gray-300"
                />
                <Pressable onPress={ProductList} className="bg-red-100 p-2">
                  <Text className="text-center">Apply</Text>
                </Pressable>
              </View>
            </View>
          )}

          {activeFilter === "Ratings" && (
            <View>
              <Text className="font-semibold text-lg text-red-500 mb-2">
                Select Rating
              </Text>
              <View className="flex-row flex-wrap gap-2 mt-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Pressable
                    key={rating}
                    onPress={() => handleRatingClick(rating)}
                    className={`flex-row items-center ${
                      selectedRating === rating ? "bg-gray-400" : "bg-gray-200"
                    } px-3 py-1 rounded-md`}
                  >
                    <Icon name="star-rate" size={18} color="#F59E0B" />
                    <Text className="ml-1 text-base">{rating}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {activeFilter === "Price Type" && (
            <View>
              <Text className="font-semibold text-lg text-red-500 mb-2">
                Select Price Type
              </Text>
              <RadioGroup
                radioButtons={radioButtonData}
                onPress={setSelectedPriceType}
                selectedId={selectedPriceType}
                layout="row"
              />
            </View>
          )}

          {activeFilter === "Brand" && (
            <View>
              <Text className="font-semibold text-lg text-red-500 mb-2">
                Brand Name
              </Text>
              <TextInput
                placeholder="Enter brand"
                className="border-2 border-gray-300 h-10 w-full rounded-sm px-3"
              />
            </View>
          )}

          {activeFilter === "Industry" && (
            <View className="h-96">
              <Text className="font-semibold text-base text-red-500 mb-2">
                Select Industry
              </Text>

              {!selectedIndustry &&
                Object.keys(industries).map((ind) => (
                  <Pressable
                    key={ind}
                    onPress={() => setSelectedIndustry(ind)}
                    className="p-2 mb-2 rounded-sm bg-gray-100"
                  >
                    <Text className="text-base">{ind}</Text>
                  </Pressable>
                ))}

              {selectedIndustry && !selectedCategory && (
                <>
                  <Pressable
                    onPress={() => {
                      setSelectedIndustry("");
                      setSelectedCategory("");
                      setSelectedSubCategory("");
                    }}
                    className="mb-2"
                  >
                    <Text className="text-red-400 text-sm underline">
                      ← Back to Industries
                    </Text>
                  </Pressable>
                  <Text className="font-semibold text-base text-red-500 mb-2">
                    Categories in {selectedIndustry}
                  </Text>
                  {industries[selectedIndustry]?.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      className="p-2 mb-2 rounded-sm bg-gray-100"
                    >
                      <Text className="text-base">{cat}</Text>
                    </Pressable>
                  ))}
                </>
              )}

              {selectedIndustry && selectedCategory && (
                <>
                  <Pressable
                    onPress={() => {
                      setSelectedCategory("");
                      setSelectedSubCategory("");
                    }}
                    className="mb-2"
                  >
                    <Text className="text-red-400 text-sm underline">
                      ← Back to Categories
                    </Text>
                  </Pressable>
                  <Text className="font-semibold text-base text-red-500 mb-2">
                    Subcategories in {selectedCategory}
                  </Text>
                  {categories[selectedCategory]?.map((sub) => (
                    <Pressable
                      key={sub}
                      onPress={() =>
                        setSelectedSubCategory((prev) =>
                          prev === sub ? "" : sub
                        )
                      }
                      className={`p-2 mb-2 rounded-sm ${
                        selectedSubCategory === sub
                          ? "bg-gray-300"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text className="text-base">{sub}</Text>
                    </Pressable>
                  ))}
                  <Pressable
                    onPress={() => {
                      setSelectedIndustry("");
                      setSelectedCategory("");
                      setSelectedSubCategory("");
                      setSelectedState("");
                      setSelectedDistricts([]);
                      setSelectedRating("");
                    }}
                    className="mt-2"
                  >
                    <Text className="text-red-600 underline text-sm">
                      Deselect All
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </ScrollView>

        {/* Bottom buttons – common for all filters */}
        <View className=" bottom-0 left-0 right-0 bg-white flex-row justify-between border-t border-gray-200 px-4 py-3">
          <Pressable
            onPress={() => {
              setSelectedState("");
              setSelectedDistricts([]);
              setSelectedIndustry("");
              setSelectedCategory("");
              setSelectedSubCategory("");
              setSelectedRating();
              setSelectedDistrict("");
            }}
          >
            <Text className="text-red-500 font-semibold">Deselect All</Text>
          </Pressable>
          <Pressable onPress={() => setIsOpen(false)}>
            <Text className="text-red-500 font-semibold">Apply</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
