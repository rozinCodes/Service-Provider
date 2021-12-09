import { useFormik } from "formik";
import LottieView from "lottie-react-native";
import React from "react";
import { Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import Button from "../components/button";
import { firebase } from "../components/configuration/config";
import { Header } from "../components/header";
import Input from "../components/input";
import { colors } from "../presets";

const SignUp = () => {
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  const userRef = firebase.firestore().collection("users");

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Please enter your username")
      .min(2, "Username should be minimum 2 characters"),
    email: Yup.string()
      .trim()
      .required("Please enter your email")
      .email("Please enter a valid email"),
    password: Yup.string().required("Please Enter your password"),
    // .matches(/^(?=.{8,})/, "Must Contain at least 8 Characters")
    // .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
    // .matches(
    //   /^(?=.*[a-z])/,
    //   "Password must contain at least one lowercase letter"
    // )
    // .matches(/^(?=.*[A-Z])/, "Password must contain one upper case letter")
    // .matches(
    //   /^(?=.*[!@#\$%\^&\*])/,
    //   "Password must be contain at least one special character"
    // ),
    confirm: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Please confirm your password"),
  });
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
            userID: response.user.uid,
            name: name,
            email: response.user.email,
            status: "pending",
          };
          userRef
            .doc(response.user.uid)
            .set(userData)
            .then(() => {
              showMessage({
                message: "Success",
                description: "Your data was set",
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
            One Number and One Special Case Character e.g - @iHateMyself1
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
        </View>
        {loading ? (
          <LottieView
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
            source={require("../assets/loading.json")}
            autoPlay={true}
          />
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
