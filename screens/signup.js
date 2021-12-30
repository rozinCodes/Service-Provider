import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useFormik } from "formik";
import LottieView from "lottie-react-native";
import React from "react";
import { useState, useEffect } from "react";
import { Dimensions, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import Button from "../components/button";
import { firebase } from "../components/configuration/config";
import { Header } from "../components/header";
import Input from "../components/input";
import RadioInput from "../components/radioInput";
import { colors } from "../presets";

const SignUp = () => {
  const OPTIONS = ["Technician", "User"];
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);
  const [visible, setVisible] = useState(true);
  const [expoPushToken, setExpoPushToken] = useState("");

  const userRef = firebase.firestore().collection("users");
  const pushRef = firebase.firestore().collection("notificationDevices");

  useEffect(() => {
    setLoading(true);
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      setLoading(false);
    });
  }, []);

  //get token for push notification
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

    return token;
  }

  //yup validation schema
  const schema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Please enter your username")
      .min(2, "Username should be minimum 2 characters"),
    email: Yup.string()
      .trim()
      .required("Please enter your email")
      .email("Please enter a valid email"),
    password: Yup.string()
      .required("Please Enter your password")
      .matches(/^(?=.{8,})/, "Must Contain at least 8 Characters")
      .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
      .matches(
        /^(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .matches(/^(?=.*[A-Z])/, "Password must contain one upper case letter")
      .matches(
        /^(?=.*[!@#\$%\^&\*])/,
        "Password must be contain at least one special character"
      ),
    confirm: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Please confirm your password"),
  });

  //formik form handler
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const name = values.name.trim();
      const email = values.email.trim();
      const password = values.password.trim();
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          let userData = {
            userId: response.user.uid,
            userType: type,
            userName: name,
            creationTime: Date(),
            email: response.user.email,
            userStatus: "pending",
          };
          userRef
            .doc(response.user.uid)
            .set(userData)
            .then(() => {
              showMessage({
                message: "Success",
                description: "Your information has been sent to admin for approval",
                type: "success",
              });
            })
            .catch((err) => {
              showMessage({
                message: "Error",
                description: err.message,
                type: "danger",
              });
            });
            pushRef
            .doc(response.user.uid)
            .set({expoPushToken}, {merge: true})
          setLoading(false);
        })
        .catch((err) => {
          showMessage({
            message: "Error",
            description: err.message,
            type: "danger",
          });
        });
      setLoading(false);
    },
  });
  const nameError = formik.errors.name && formik.touched.name;
  const emailError = formik.errors.email && formik.touched.email;
  const passwordError = formik.errors.password && formik.touched.password;
  const confirmError = formik.errors.confirm && formik.touched.confirm;

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
    )
  };

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <Header backButton={true} title="Sign Up" />
        <View
          style={{
            marginTop: 20,
            justifyContent: "center",
            marginBottom: 20,
            marginHorizontal: 20,
          }}
        >
          <Input
            textTitle="Username"
            placeholder="What should we call you?"
            textTitleColor={nameError && "#D16969"}
            borderColor={nameError && "#D16969"}
            borderWidth={nameError && 2}
            onchangeText={formik.handleChange("name")}
            customStyle={{ borderBottomWidth: 0 }}
            onBlur={formik.handleBlur("name")}
          />
          {formik.errors.name && formik.touched.name && (
            <Text style={{ color: "#D16969", marginTop: 8 }}>
              {formik.errors.name}
            </Text>
          )}
          <Input
            textTitle="Email"
            placeholder="Enter your email"
            textTitleColor={emailError && "#D16969"}
            borderColor={emailError && "#D16969"}
            borderWidth={emailError && 2}
            onchangeText={formik.handleChange("email")}
            customStyle={{ borderBottomWidth: 0 }}
            onBlur={formik.handleBlur("email")}
          />
          {formik.errors.email && formik.touched.email && (
            <Text style={{ color: "#D16969", marginTop: 8 }}>
              {formik.errors.email}
            </Text>
          )}
          <Input
            placeholder="Enter your password"
            textTitle="Password"
            textTitleColor={passwordError && "#D16969"}
            borderColor={passwordError && "#D16969"}
            borderWidth={passwordError && 2}
            secureIcon
            onchangeText={formik.handleChange("password")}
            customStyle={{
              borderBottomWidth: 0,
            }}
            secureInput={visible}
            onPress={() => setVisible(!visible)}
            onBlur={formik.handleBlur("password")}
          />
          {formik.errors.password && formik.touched.password && (
            <Text style={{ color: "#D16969", marginTop: 8 }}>
              {formik.errors.password}
            </Text>
          )}
          <Text
            style={{
              color: colors.grey,
              marginTop: 12,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            * Must Contain at least 8 Characters, One Uppercase, One Lowercase,
            One Number and One Special Case Character e.g - @reactNativ3
          </Text>
          <Input
            placeholder="Confirm your password"
            textTitle="Confirm password"
            textTitleColor={confirmError && "#D16969"}
            borderColor={confirmError && "#D16969"}
            borderWidth={confirmError && 2}
            onchangeText={formik.handleChange("confirm")}
            customStyle={{
              borderBottomWidth: 0,
            }}
            secureInput
            onBlur={formik.handleBlur("confirm")}
          />
          {formik.errors.confirm && formik.touched.confirm && (
            <Text style={{ color: "#D16969", marginTop: 8 }}>
              {formik.errors.confirm}
            </Text>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 14,
            }}
          >
            {OPTIONS.map((options, index) => (
              <RadioInput
                key={index}
                title={options}
                value={type}
                setValue={setType}
              />
            ))}
          </View>
        </View>
        {loading ? (
           <Loading/>
        ) : (
          <Button
            disabled={!(formik.isValid && formik.dirty)}
            onPress={formik.handleSubmit}
            title="Submit"
          />
        )}

        <Text style={{ alignSelf: "center", fontSize: 12 }}>
          By continuing you accept the{" "}
          <Text style={{ color: "dodgerblue" }}> Terms of use</Text>
          <Text> and </Text>
          <Text style={{ color: "dodgerblue" }}> Privacy policy</Text>
        </Text>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
