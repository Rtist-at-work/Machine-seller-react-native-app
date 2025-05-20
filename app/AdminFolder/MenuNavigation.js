import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AdminHomePage from "./AdminHomePage";
import CategoryManager from "./CategoryManager";
import EditCategory from "./EditCategory";
import BannerUpload from "./BannerUpload";

const Drawer = createDrawerNavigator();

export default function MenuNavigation() {
  return (
    <Drawer.Navigator initialRouteName="AdminHomePage">
      <Drawer.Screen name="AdminHomePage" component={AdminHomePage} />
      <Drawer.Screen name="CategoryManager" component={CategoryManager} />
      <Drawer.Screen name="BannerUpload" component={BannerUpload} />
    </Drawer.Navigator>
  );
}
