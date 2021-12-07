import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useFormik } from "formik";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import MapView, { Callout, Marker } from "react-native-maps";
import uuid from "react-native-uuid";
import * as Yup from "yup";
import Button from "../components/button";
import { firebase } from "../components/configuration/config";
import Input from "../components/input";
import RadioInput from "../components/radioInput";

const Profile = ({ navigation }) => {
  const OPTIONS = ["Male", "Female", "Non-binary"];
  const [gender, setGender] = React.useState(null);
  const [expoPushToken, setExpoPushToken] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [region, setRegion] = React.useState({
    latitude: 0,
    longitude: -90.4324,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0121,
  });
  const [errorMsg, setErrorMsg] = React.useState(null);

  const schema = Yup.object().shape({
    name: Yup.string().trim().required("Please enter your name"),
    age: Yup.string().trim().required("Please Enter your age").min(2),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const name = values.name.trim();
      const age = values.age.trim();
      const user = firebase.auth().currentUser;
      const employeeData = {
        userId: user.uid,
        name,
        age,
        gender,
        image,
        pushToken: expoPushToken,
        region
      };
      const usersRef = firebase.firestore().collection("users");
      setLoading(true);

      usersRef.add(employeeData).catch((err) => {
        showMessage({
          message: "Oops",
          description: err.message,
          type: "danger",
        });
      });
      setLoading(false);
    },
  });

  //expo push notificaction
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

  React.useEffect(() => {
    setLoading(true);
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
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
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0121,
      });
      // console.warn(location.coords.longitude);
      setLoading(false);
    })();
  }, []);

  const nameError = formik.errors.name && formik.touched.name;
  const ageError = formik.errors.age && formik.touched.age;

  return (
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
            height: 120,
            width: 120,
            borderRadius: 60,
            marginBottom: 40,
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
              <Ionicons name="image" size={40} color="white" />
              <Text style={{ color: "white" }}>Add Image</Text>
            </View>
          )}
        </Pressable>
        <Input
          placeholder="Enter your name"
          textTitle="Name"
          textTitleColor={nameError && "#D16969"}
          borderColor={nameError && "#D16969"}
          borderWidth={nameError && 2}
          onchangeText={formik.handleChange("name")}
          customStyle={{ borderBottomWidth: 0 }}
          onBlur={formik.handleBlur("name")}
        />
        {formik.errors.name && formik.touched.name && (
          <Text style={{ color: "#D16969", marginVertical: 8 }}>
            {formik.errors.name}
          </Text>
        )}
        <Input
          placeholder="Enter your age"
          textTitle="Age"
          textTitleColor={ageError && "#D16969"}
          borderColor={ageError && "#D16969"}
          borderWidth={ageError && 2}
          onchangeText={formik.handleChange("age")}
          customStyle={{ borderBottomWidth: 0 }}
          onBlur={formik.handleBlur("age")}
        />
        {formik.errors.age && formik.touched.age && (
          <Text style={{ color: "#D16969", marginTop: 8 }}>
            {formik.errors.age}
          </Text>
        )}
      </View>
      <View style={styles.container}>
        <MapView
          provider="google"
          initialRegion={region}
          zoomEnabled={true}
          showsMyLocationButton={false}
          focusable={true}
          followsUserLocation={true}
          liteMode={true}
          showsUserLocation={true}
          provider="google"
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
              });
            }}
          >
            <Callout>
              <Text>Current Location</Text>
            </Callout>
          </Marker>
        </MapView>
      </View>
      {OPTIONS.map((options, index) => (
        <RadioInput
          key={index}
          title={options}
          value={gender}
          setValue={setGender}
        />
      ))}
      <Button
        disabled={!(formik.isValid && formik.dirty && gender != null)}
        onPress={formik.handleSubmit}
        title="Create"
      />
    </ScrollView>
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
