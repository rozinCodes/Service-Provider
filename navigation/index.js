import { Fontisto, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, LogBox } from "react-native";
import { firebase } from "../components/configuration/config";
import { colors } from "../presets/colors";
import Cart from "../screens/cart";
import Checkout from "../screens/checkout";
import Earphone from "../screens/earphone";
import Headphone from "../screens/headphone";
import Home from "../screens/home";
import Login from "../screens/login";
import Notification from "../screens/notification";
import ProductDetails from "../screens/product-details";
import SignUp from "../screens/signup";
import SoundBox from "../screens/soundbox";
import Profile from "../screens/profile";
import Create from "../screens/create";

const Tab = createBottomTabNavigator();
const stack = createNativeStackNavigator();

const THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

LogBox.ignoreLogs(["Setting a timer", "AsyncStorage"]);

const Navigation = () => {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();

  function userStateChanged(user) {
    setUser(user);
    setLoading(false);
  }

  useEffect(() => {
    const subscribe = firebase.auth().onAuthStateChanged(userStateChanged);
    return () => {
      subscribe;
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (loading) {
    return (
      <LottieView
        style={{ flex: 1, width: Dimensions.get("window").height / 4 }}
        resizeMode="contain"
        source={require("../assets/loading.json")}
        autoPlay={true}
      />
    );
  }

  return (
    <NavigationContainer theme={THEME}>
      {user ? <BottomTabNavigator /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home "
      screenOptions={{
        tabBarActiveTintColor: colors.purple,
        tabBarStyle: {
          paddingBottom: 6,
          borderWidth: 0.1,
          borderRadius: 14,
          marginHorizontal: 6,
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home "
        component={HomeStackScreen}
        options={{
          headerTitleAlign: "center",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcons
              fontFamily="Ionicons"
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Headphone"
        component={HeadphoneScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcons fontFamily="Fontiso" name="headphone" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Soundbox"
        component={SoundboxScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcons
              fontFamily="MaterialCommunityIcons"
              name="boombox"
              color={color}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Earphone"
        component={EarphoneScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcons
              fontFamily="MaterialCommunityIcons"
              name="headphones"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcons
              fontFamily="MaterialCommunityIcons"
              name="cart"
              color={color}
            />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

function TabBarIcons({ fontFamily, color, name }) {
  if (fontFamily === "Ionicons") {
    return <Ionicons name={name} color={color} size={18} />;
  } else if (fontFamily === "MaterialCommunityIcons") {
    return <MaterialCommunityIcons name={name} size={18} color={color} />;
  } else if (fontFamily === "Fontiso") {
    return <Fontisto name={name} size={18} color={color} />;
  }
}

function HomeStackScreen() {
  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      <stack.Screen name="Home" component={Home} />
      <stack.Screen name="Profile" component={Profile} />
      <stack.Screen name="Create" component={Create} />
      <stack.Screen name="Notification" component={Notification} />
    </stack.Navigator>
  );
}
function AuthStackScreen() {
  return (
    <stack.Navigator>
      <stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="PRofile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </stack.Navigator>
  );
}
function HeadphoneScreen() {
  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      <stack.Screen name="Headphone " component={Headphone} />
      <stack.Screen name="ProductDetails" component={ProductDetails} />
    </stack.Navigator>
  );
}
function SoundboxScreen() {
  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      <stack.Screen name="Earphone " component={SoundBox} />
      <stack.Screen name="ProductDetails" component={ProductDetails} />
    </stack.Navigator>
  );
}
function EarphoneScreen() {
  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      <stack.Screen name="Soundbox " component={Earphone} />
      <stack.Screen name="ProductDetails" component={ProductDetails} />
    </stack.Navigator>
  );
}
function CartScreen() {
  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      <stack.Screen name="Cart " component={Cart} />
      <stack.Screen name="Checkout" component={Checkout} />
    </stack.Navigator>
  );
}

export default Navigation;
