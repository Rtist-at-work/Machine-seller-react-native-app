import React from "react";
import HomeScreen from "./screens/(Homepage)/HomeScreen";
import BottomNavBar from "./navigation/(navigationBar)/BottomNavBar";
import MenuNavigation from "./AdminFolder/MenuNavigation";
import { Platform } from "react-native";
import Recommeded from "./screens/(Homepage)/Recommeded";
import Header from "./component/(header)/Header";
import All from "./component/(subMenu)/All";
import Banner from "./screens/(Homepage)/Banner";
import Explore from "./screens/(Homepage)/Explore";
import RoleSelection from "./mechanicApp/RoleSelection";
import SignUp from "./screens/(auth)/(SignIn)/SignUp";
import MechanicList_2 from "./mechanicApp/MechanicList_2";
import ProfilePage from "./screens/(profile)/ProfilePage";
import LandingPage from "./screens/LandingPage";
import Login from "./screens/(auth)/(login)/Login";
import SellScreen from "./screens/(sellerForm)/SellScreen";
import SellPage from "./screens/(sellerForm)/Page";
import LikeButton from "./mechanicApp/Like";
import AdminHomePage from "./AdminFolder/AdminHomePage";
import AdminPageNavigation from "./AdminFolder/AdminPageNavigation";
import SubCategory from "./mechanicApp/SubCategory";
import CategoryManager from "./AdminFolder/CategoryManager";
import createCategory from "./AdminFolder/CreateCategory";
import Layout from "./_layout";
import QrPage from "./AdminFolder/QrPage";
import PixelArtEditor from "./mechanicApp/PixelArtEditor";
export default function index() {
  return (
    <>
      {/* {Platform.OS === "web" && <HomeScreen />}
       */}
      {/* <LandingPage /> */}

      {/* <BottomNavBar /> */}
      {/* <Layout/> */}
      {/* <LikeButton /> */}
      {/* <SignUp /> */}
      {/* <SellScreen /> */}
      {/* <RoleSelection /> */}
      {/* <Login />  */}
      {/* <MechanicList_2 /> */}
      {/* <ProfilePage /> */}
      {/* <SellPage /> */}
      {/* <HomeScreen /> */}
      {/* <All />  */}
      {/* <AdminPageNavigation/> */}
      {/* <MenuNavigation/> */}
      {/* <QrPage/> */}
      <PixelArtEditor/>
      {/* <SubCategory/> */}
      {/* <createCategory/> */}

    </>
  );
}
