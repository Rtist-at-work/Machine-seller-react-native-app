import IndustrieScreen from "@/app/screens/(mobileScreens)/IndustrieScreen";
import CategoryList from "@/app/screens/(productPage)/CategoryList";
import ProductList from "@/app/screens/(productPage)/ProductList";
import SelectProduct from "@/app/screens/(productPage)/SelectProduct";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Login from "@/app/screens/(auth)/(login)/Login";
import ChatUser from "@/app/(chat)/RightPart/ChatUser";
import SignUp from "@/app/screens/(auth)/(SignIn)/SignUp";
import MechanicList_2 from "@/app/mechanicApp/MechanicList_2";
import ProfilePage from "@/app/screens/(profile)/ProfilePage";
import LandingPage from "@/app/screens/LandingPage";

const Stack = createNativeStackNavigator();

export default function ScreenNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="IndustryPage"
        component={IndustrieScreen}
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="ProductList" // 👈 new screen
        component={ProductList}
        options={{ title: "ProductList ", headerShown: false }}
      />
      <Stack.Screen
        name="CategoryList" // 👈 new screen
        component={CategoryList}
        options={{ title: "CategoryList ", headerShown: false }}
      />

      <Stack.Screen
        name="Chat" // 👈 new screen
        component={ChatUser}
        options={{ title: "Chat ", headerShown: false }}
      />
      <Stack.Screen
        name="SelectProduct" // 👈 new screen
        component={SelectProduct}
        options={{ title: "SelectedProduct ", headerShown: false }}
      />
      <Stack.Screen
        name="LoginPage" // 👈 new screen
        component={Login}
        options={{ title: "LoginPage ", headerShown: false }}
      />
      <Stack.Screen
        name="SignUp" // 👈 new screen
        component={SignUp}
        options={{ title: "SignUp ", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const MechanicProfile = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={LandingPage}
        options={{ title: "HomePage", headerShown: false }}
      />
      <Stack.Screen
        name="MechanicPage"
        component={MechanicList_2}
        options={{ title: "MechanicPage", headerShown: false }}
      />
      {/* <Stack.Screen
        name="MechanicProfilePage"
        component={ProfilePage}
        options={{ title: "MechanicProfilePage", headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};
export { MechanicProfile };
