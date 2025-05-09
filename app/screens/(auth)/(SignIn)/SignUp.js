import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import { allCountries } from "country-telephone-data";
import UsernameScreen from "./UsernameScreen";
import { View, Text } from "react-native";
// import OtpScreen from "./OtpScreen";
// import Password from "./Password";
import { router } from "expo-router";
// import useApi from "./hooks/useApi";
import Toast from "react-native-toast-message";

import { useWindowDimensions } from "react-native";
import RoleSelection from "@/app/mechanicApp/RoleSelection";
import useApi from "@/app/hooks/useApi";
import Password from "./Password";
import OtpScreen from "./OtpScreen";

const SignUp = () => {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [mailOrphone, setMailOrphone] = useState("");
  const [mobile, setMobile] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const { postJsonApi } = useApi();
  const { width } = useWindowDimensions();
  const isScreenLarge = width > 768;
  const [subCategories, setSubCategories] = useState([
    { name: "", services: [""] },
  ]);

  useEffect(() => {
    if (subCategories.length > 0) {
      setMechanicDetails((prev) => ({
        ...prev,
        subcategory: subCategories,
      }));
    }
  }, [subCategories]);

  const [mechanicDetails, setMechanicDetails] = useState({
    organization: "",
    industry: "",
    services: [],
    subcategory: subCategories,
    contact: {
      number: "",
      countryCode: "+91",
    },
  });

  let api_Data;

  console.log("step:", step);

  const toast = useToast();

  const getSignupUrl = (step) => {
    if (step === 2) {
      return "signup/otpcheck";
    } else if (step === 3) {
      return "signup/register";
    } else if (step === 4) {
      return "signup/resendotp";
    }
    return "signup"; // Default case when no step matches
  };

  switch (true) {
    case step === 1:
      api_Data = { mailOrphone, username, role, mechanicDetails };
      break;

    case step === 2:
      api_Data = { mailOrphone, otp: otp.join("") };
      break;

    case step === 3:
      api_Data = { mailOrphone, password, confirmpass };
      break;

    case step === 4:
      api_Data = { mailOrphone };
      break;

    default:
      console.log("Invalid step");
  }

  const formSubmit = async () => {
    // Validate form fields based on the step
    if (
      step === 1
        ? !username || !mailOrphone
        : step === 3
        ? !password || !confirmpass
        : step === 2
        ? !otp || !mailOrphone
        : ""
    ) {
      toast.show("Please fill all fields", {
        type: "danger",
        placement: "top",
        animationType: "slide-in",
      });
      return;
    }

    try {
      // Dynamically generate the signup URL

      const response = await postJsonApi(getSignupUrl(step), api_Data);
      console.log("response :", response);

      if (response && response.status === 200) {
        if (step == 2) {
          toast.show("OTP verified successfully!", { type: "success" });
        }
        if (step == 3) {
          setUsername("");
          setMailOrphone("");
          setOtp("");
          setPassword("");
          setConfirmPass("");
          // toast.show("Registration successfully!", { type: "success" });
          console.log("page");
          router.push("/screens/Login");
        }
        if (step !== (3 || 4)) {
          setStep((prevStep) => prevStep + 1);
        }
        if (step === 4) {
          setStep(2);
        }
      }
    } catch (error) {
      console.error(
        "Error during form submission:",
        error.response ? error.response.data : error.message
      );

      // Handle specific error scenarios
      if (error.response?.status === 401) {
        // toast.show("Invalid OTP. Please try again.", { type: "warning" });
      } else if (error.response?.status === 500) {
        // toast.show("Server error. Please try again later.", { type: "danger" });
      } else {
        // toast.show(
        //   error.response?.data?.message || "An unexpected error occurred.",
        //   { type: "danger" }
        // );
        // toast.show(, {
        //   placement: "top",
        //   type: "danger",
        //   duration: 3000,
        // });
      }
    }
  };

  if (step === 4) {
    formSubmit(mailOrphone);
    setStep(2);
  }
  if (step === 0) {
    console.log("object");
    return (
      <RoleSelection
        subCategories={subCategories}
        setSubCategories={setSubCategories}
        role={role}
        setRole={setRole}
        setStep={setStep}
        setMechanicDetails={setMechanicDetails}
        mechanicDetails={mechanicDetails}
      />
    );
  }
  console.log(mechanicDetails);

  return (
    <SafeAreaView className="mt-24  w-screen items-center justify-center ">
      <View className="z-50">
        <Toast />
      </View>
      <View
        className={` rounded-md shadow-md overflow-hidden flex bg-gray-200 ${
          Platform.OS === "web"
            ? isScreenLarge
              ? "w-[52%] flex-row h-[90%]"
              : "w-[90%] flex-col"
            : "w-[90%] flex-col"
        }`}
      >
        {/* Left Info Section */}
        {Platform.OS === "web" && isScreenLarge && (
          <View className="w-[40%] bg-teal-600 text-white p-6 hidden md:flex flex-col justify-between">
            <View>
              <Text className="text-3xl font-bold text-white">SignUp</Text>
              <Text className="text-white mt-4">
                Get access to your <Text className="font-semibold">Orders</Text>
                , <Text className="font-semibold">Wishlist</Text>, and{" "}
                <Text className="font-semibold">Recommendations</Text>.
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/screens/Login")}
              className="mt-10"
            >
              <Text className="text-white font-semibold underline">
                Already have an account? Login
              </Text>
            </Pressable>
          </View>
        )}

        {/* Right Form Section */}
        <View
          className={`bg-white ${
            Platform.OS === "web" && isScreenLarge
              ? "w-[60%] p-6"
              : " w-[100%]p-4 w-full"
          }`}
        >
          {step === 1 && (
            <UsernameScreen
              username={username}
              setUsername={setUsername}
              mailOrphone={mailOrphone}
              setMailOrphone={setMailOrphone}
              mobile={mobile}
              setMobile={setMobile}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              formSubmit={formSubmit}
            />
          )}
          {step === 2 && (
            <OtpScreen
              otp={otp}
              setOtp={setOtp}
              formSubmit={formSubmit}
              setStep={setStep}
            />
          )}
          {step === 3 && (
            <Password
              password={password}
              confirmpass={confirmpass}
              setPassword={setPassword}
              setConfirmPass={setConfirmPass}
              formSubmit={formSubmit}
              buttonLabel="Register"
              mailOrphone={mailOrphone}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Pressable,
//   Platform,
//   SafeAreaView,
//   useWindowDimensions,
// } from "react-native";
// import { router, useRouter } from "expo-router";
// import UsernameScreen from "./UsernameScreen";
// import useApi from "@/app/hooks/useApi";
// import { allCountries } from "country-telephone-data";

// const SignUp = () => {
//   const [step, setStep] = useState(1);
//   const [username, setUsername] = useState("");
//   const [mailOrphone, setMailOrphone] = useState("");
//   const [mobile, setMobile] = useState(false);
//   const [selectedCode, setSelectedCode] = useState("+91");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmpass, setConfirmPass] = useState("");
//   const [otp, setOtp] = useState(["", "", "", ""]);

//   const { postJsonApi } = useApi();

//   let api_Data;
//   const width = useWindowDimensions();
//   const isScreenSmall = width > 1024;
//   // const toast = useToas();

//   const cleanCountryName = (name) => name.replace(/\s*\(.*?\)/g, "").trim();

//   const filteredCountries = allCountries
//     .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     .map((c) => ({
//       name: cleanCountryName(c.name),
//       dialCode: c.dialCode,
//       iso2: c.iso2,
//     }));

//   const getSignupUrl = (step) => {
//     if (step === 2) {
//       return "signup/otpcheck";
//     } else if (step === 3) {
//       return "signup/register";
//     } else if (step === 4) {
//       return "signup/resendotp";
//     }
//     return "signup"; // Default case when no step matches
//   };

//   switch (true) {
//     case step === 1:
//       api_Data = { mailOrphone, username };
//       break;

//     case step === 2:
//       api_Data = { mailOrphone, otp: otp.join("") };
//       break;

//     case step === 3:
//       api_Data = { mailOrphone, password, confirmpass };
//       break;

//     case step === 4:
//       api_Data = { mailOrphone };
//       break;

//     default:
//       console.log("Invalid step");
//   }

//   const formSubmit = async () => {
//     console.log("Form submission started");

//     // Validate form fields based on the step
//     if (
//       step === 1
//         ? !username || !mailOrphone
//         : step === 3
//         ? !password || !confirmpass
//         : step === 2
//         ? !otp || !mailOrphone
//         : ""
//     ) {
//       console.log(step);
//       // toast.show("Please fill all fields", { type: "danger" });
//       return;
//     }
//     console.log(step);

//     try {
//       // Dynamically generate the signup URL

//       const response = await postJsonApi(getSignupUrl(step), api_Data);
//       console.log("Response received:", response);

//       if (response && response.status === 200) {
//         // if (step == 2) {
//         //   toast.show("OTP verified successfully!", { type: "success" });
//         // }
//         if (step == 3) {
//           setUsername("");
//           setMailOrphone("");
//           setOtp("");
//           setPassword("");
//           setConfirmPass("");
//           // toast.show("Registration successfully!", { type: "success" });
//         }
//         if (step !== (3 || 4)) {
//           setStep((prevStep) => prevStep + 1);
//         }
//         if (step === 4) {
//           setStep(2);
//         }
//       }
//     } catch (error) {
//       console.error("Error during form submission:", error);

//       // Handle specific error scenarios
//       if (error.response?.status === 401) {
//         toast.show("Invalid OTP. Please try again.", { type: "warning" });
//       } else if (error.response?.status === 500) {
//         toast.show("Server error. Please try again later.", { type: "danger" });
//       } else {
//         toast.show(
//           error.response?.data?.message || "An unexpected error occurred.",
//           { type: "danger" }
//         );
//       }
//     }
//   };

//   if (step === 4) {
//     formSubmit(mailOrphone);
//     setStep(2);
//   }

//   return (
//     <SafeAreaView>
//       <View className="h-screen w-screen  align-items-center bg-gray-200 ">
//         <View
//           className={`bg-white mt-24 ${
//             Platform.OS === "web"
//               ? " flex flex-row"
//               : "w-[90%] flex flex-col gap-6"
//           } mx-auto shadow-[5] rounded-md`}
//           style={[isScreenSmall ? { width: 360 } : {}]}
//         >
//           {/* Web-specific Welcome Card */}

//           {Platform.OS === "web" && !isScreenSmall && (
//             <View className="bg-teal-600 w-[40%] h-[415px] p-5 rounded-tl-md rounded-bl-md text-white hidden">
//               <View className="shadow-md p-5">
//                 <Text className="text-2xl font-bold mt-5 ml-3 text-white">
//                   Sign Up
//                 </Text>
//                 <Text className="mt-8 text-base font-medium ml-3 leading-6 text-white">
//                   Get access to your
//                   <Text className="font-semibold mt-8 text-white">
//                     {" "}
//                     Orders,{" "}
//                   </Text>
//                   <Text className="font-semibold text-white">
//                     Wishlist, and{" "}
//                   </Text>
//                   <Text className="font-semibold text-white">
//                     Recommendations.
//                   </Text>
//                 </Text>
//               </View>
//               <Pressable
//                 onPress={() => {
//                   router.push("/screens/Login");
//                 }}
//                 style={{
//                   position: "absolute",
//                   bottom: 16,
//                   width: "90%",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   padding: 8,
//                 }}
//               >
//                 <Text style={{ color: "white", fontWeight: "600" }}>
//                   Already have an account?{" "}
//                   <Text style={{ textDecorationLine: "underline" }}>Login</Text>
//                 </Text>
//               </Pressable>
//             </View>
//           )}

//           {/* Login Form */}
//           <View
//             className={`${
//               Platform.OS === "web" ? "w-[60%] h-[415px]" : "w-full mx-auto"
//             } p-5 py-8`}
//             style={[isScreenSmall ? { width: "120%" } : {}]}
//           >
//             {/* <Text className="text-2xl font-bold mx-auto text-TealGreen mb-4">
//               Create Your Account
//             </Text> */}

//             <UsernameScreen
//               username={username}
//               setUsername={setUsername}
//               mailOrphone={mailOrphone}
//               setMailOrphone={setMailOrphone}
//               mobile={mobile}
//               setMobile={setMobile}
//               selectedCode={selectedCode}
//               setSelectedCode={setSelectedCode}
//               phoneNumber={phoneNumber}
//               setPhoneNumber={setPhoneNumber}
//               dropdownVisible={dropdownVisible}
//               setDropdownVisible={setDropdownVisible}
//               filteredCountries={filteredCountries}
//               searchQuery={searchQuery}
//               setSearchQuery={setSearchQuery}
//               formSubmit={formSubmit}
//             />
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default SignUp;
