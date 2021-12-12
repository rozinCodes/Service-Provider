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
import Home from "../screens/home";
import Login from "../screens/login";
import SignUp from "../screens/signup";
import Profile from "../screens/profile";
import History from "../screens/history";
import Settings from "../screens/settings";
import ChatScreen from "../screens/chat";

const Tab = createBottomTabNavigator();
const stack = createNativeStackNavigator();

const THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

LogBox.ignoreLogs(["Setting a timer", "AsyncStorage", "Possible", "Can't"]);

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
  const currentUser = firebase.auth().currentUser;

  return (
    <Tab.Navigator
      initialRouteName="Home"
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
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          headerShown: false,
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
      {currentUser.uid == "MUjeAeY5cab9N8slLYbJZbIvDxs1" ? (
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabBarIcons
                fontFamily="Ionicons"
                name="list-outline"
                color={color}
              />
            ),
          }}
        />): (
          <Tab.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabBarIcons
                fontFamily="Ionicons"
                name="list-outline"
                color={color}
              />
            ),
          }}
        />
        )}

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcons fontFamily="Ionicons" name="settings" color={color} />
          ),
        }}
      />
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
    </stack.Navigator>
  );
}
function HistoryScreen() {
  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      <stack.Screen name="History " component={History} />
    </stack.Navigator>
  );
}
function SettingsScreen() {
  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      <stack.Screen name="Settings " component={Settings} />
    </stack.Navigator>
  );
}

export default Navigation;
