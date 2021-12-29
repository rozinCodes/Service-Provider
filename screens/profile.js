import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useFormik } from "formik";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import PhoneInput from "react-native-phone-number-input";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import * as Yup from "yup";
import Button from "../components/button";
import { firebase } from "../components/configuration/config";
import { Header } from "../components/header";
import { colors } from "../presets";
import MapViewDirections from "react-native-maps-directions";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Profile = ({ navigation }) => {
  const postRef = firebase.firestore().collection("posts");

  const [beginTime, setBeginTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [beginMode, setBeginMode] = useState("date");
  const [endMode, setEndMode] = useState("date");
  const [beginShow, setBeginShow] = useState(false);
  const [endShow, setEndShow] = useState(false);

  const [value, setValue] = useState("");
  const phoneInput = useRef(null);
  const [showMessage, setShowMessage] = useState(false);
  const [valid, setValid] = useState(false);

  const onBeginChange = (event, selectedDate) => {
    const currentDate = selectedDate || beginTime;
    setBeginShow(Platform.OS === "ios");
    setBeginTime(currentDate);
  };
  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setEndShow(Platform.OS === "ios");
    setEndTime(currentDate);
  };

  const showBeginMode = (currentMode) => {
    setBeginShow(true);
    setBeginMode(currentMode);
  };
  const showEndMode = (currentMode) => {
    setEndShow(true);
    setEndMode(currentMode);
  };

  const showBeginPicker = () => {
    showBeginMode("time");
  };
  const showEndPicker = () => {
    showEndMode("time");
  };

  const coordinates = [
    {
      latitude: 30.7046,
      longitude: 76.7179,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    },
    {
      latitude: 30.7333,
      longitude: 76.7794,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    },
  ];

  const user = firebase.auth().currentUser;
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: -90.4324,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  const schema = Yup.object().shape({});

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    // push notification function ends here

    return token;
  }

  const formik = useFormik({
    initialValues: {
      phone: "",
    },
    // validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      const phone = values.phone.trim();

      const postData = {
        name: user.displayName,
        email: user.email,
        userId: user.uid,
        longitude: region.longitude,
        latitude: region.latitude,
        longitudeDelta: region.longitudeDelta,
        latitudeDelta: region.latitudeDelta,
        beginTime: beginTime.toLocaleTimeString(),
        endTime: endTime.toLocaleTimeString(),
        phone: value,
        image,
        expoPushToken,
        userStatus: "Approved",
      };

      postRef
        .doc(user.uid)
        .set(postData)
        .then(async () => {
          const message = {
            to: expoPushToken,
            sound: "default",
            title: "user.displayName",
            body: "your post has been published successfully",
          };

          await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          });
          showMessage({
            message: "Success",
            message: "your post has been created successfully",
            type: "success",
          });
          navigation.navigate("Home");
        })
        .catch((err) => {
          showMessage({
            message: "Oops",
            description: err.message,
            type: "danger",
          });
        });
      setLoading(false);
    },
  });

  // Image picker function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", result.uri, true);
        xhr.send(null);
      });

      const ref = firebase.storage().ref().child(uuid.v4());

      const snapshot = await ref.put(blob);
      blob.close();
      const url = await snapshot.ref.getDownloadURL();
      setImage(url);
    }
  };

  useEffect(() => {
    setLoading(true);
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      });
      setLoading(false);
    })();
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const phoneError = formik.errors.phone && formik.touched.phone;

  const Loading = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          style={{
            height: 200,
            width: 100,
          }}
          source={require("../assets/loading.json")}
          autoPlay={true}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ marginBottom: 60 }}>
      <Header title="Post" backButton />
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <Pressable
              style={{
                height: 80,
                width: 80,
                borderRadius: 40,
                marginBottom: 20,
                backgroundColor: "dodgerblue",
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center",
              }}
              onPress={pickImage}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ height: "100%", width: "100%", resizeMode: "cover" }}
                />
              ) : (
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="image" size={20} color="white" />
                  <Text style={{ color: "white", fontSize: 10 }}>
                    Add Image
                  </Text>
                </View>
              )}
            </Pressable>
            <View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {beginTime.toLocaleTimeString()}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {endTime.toLocaleTimeString()}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Button onPress={showBeginPicker} title="Active time start" />
                <Button onPress={showEndPicker} title="Active time end" />
              </View>
              {beginShow && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={beginTime}
                  mode={beginMode}
                  is24Hour={true}
                  display="default"
                  onChange={onBeginChange}
                />
              )}
              {endShow && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={endTime}
                  mode={endMode}
                  is24Hour={true}
                  display="default"
                  onChange={onEndChange}
                />
              )}
            </View>
            {showMessage && (
              <View style={styles.message}>
                <Text>Value : {value}</Text>
                <Text>Valid : {valid ? "true" : "false"}</Text>
              </View>
            )}
            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              layout="second"
              containerStyle={{
                width: "100%",
                backgroundColor: colors.white,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 0.22,

                elevation: 3,
              }}
              textContainerStyle={{ backgroundColor: colors.white }}
              codeTextStyle={{ color: colors.grey }}
              disableArrowIcon
              defaultCode="BD"
              onChangeFormattedText={(text) => {
                setValue(text);
                const checkValid = phoneInput.current?.isValidNumber(value);
                // setShowMessage(true)
                setValid(checkValid ? checkValid : false);
              }}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const checkValid = phoneInput.current?.isValidNumber(value);
                setShowMessage(true);
                setValid(checkValid ? checkValid : false);
              }}
            >
              <Text>Check</Text>
            </TouchableOpacity>
            {/* <Input
            placeholder='Enter your mobile number'
            textTitle='Contact'
            textTitleColor={phoneError && '#D16969'}
            borderColor={phoneError && '#D16969'}
            borderWidth={phoneError && 2}
            onchangeText={formik.handleChange('phone')}
            customStyle={{ borderBottomWidth: 0 }}
            onBlur={formik.handleBlur('phone')}
          />
          {formik.errors.phone && formik.touched.phone && (
            <Text style={{ color: '#D16969', marginTop: 8 }}>
              {formik.errors.phone}
            </Text>
          )} */}
          </View>
          <View style={styles.container}>
            <MapView
              region={region}
              zoomEnabled={true}
              showsUserLocation={true}
              style={styles.map}
            >
              <Marker
                coordinate={{
                  longitude: region.longitude,
                  latitude: region.latitude,
                }}
                draggable={true}
                onDragEnd={(e) => {
                  setRegion({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421,
                  });
                }}
              >
                <Callout>
                  <Text>Current Location</Text>
                </Callout>
              </Marker>
              <MapViewDirections
                origin={region}
                apikey="" //maps direction api key here
                destination={coordinates[1]}
                strokeWidth={3}
                strokeColor="red"
              />
            </MapView>
          </View>
          <Button
            disabled={!valid}
            onPress={formik.handleSubmit}
            title="Create"
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: "100%",
  },
  map: {
    width: "100%",
    height: 200,
  },
});
