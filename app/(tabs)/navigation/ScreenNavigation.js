import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import IndustrieScreen from "../src/Folder/IndustrieScreen";
import CategoryScreen from "../src/Folder/CategoryScreen";

const Stack = createNativeStackNavigator();

export default function ScreenNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="IndustryPage"
        component={IndustrieScreen}
        options={{ title: "Home",headerShown: false }}
      />
      <Stack.Screen
        name="CategoryScreen" // 👈 new screen
        component={CategoryScreen}
        options={{ title: "Category Screen", headerShown: false }}
      />
      
    </Stack.Navigator>
  );
}
