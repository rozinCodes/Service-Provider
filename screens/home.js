import axios from "axios";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/button";
import { firebase } from "../components/configuration/config";

const Home = ({ navigation }) => {
  const user = firebase.auth().currentUser;
  const userRef = firebase.firestore().collection("users").doc('MUjeAeY5cab9N8slLYbJZbIvDxs1');
  let [userInfo, setUserInfo] = React.useState([]);

  // const createPost = async () => {
  //   userRef.get().then((doc) => {
  //     const data = [];

  //     if (doc.exists) {
  //       const authorized = doc.get("authorized");
  //       if (authorized == false) {
  //         showMessage({
  //           message: "you are not authorized yet",
  //           type: "danger",
  //         });
  //       } else {
  //         userRef.get().then((snapshot) => {
  //           snapshot.forEach((doc) => {
  //             data.push(doc.data);
  //           });
  //           // console.warn(data);
  //         });
  //         showMessage({
  //           message: "Authorized",
  //           type: "success",
  //         });
  //       }
  //     } else {
  //       showMessage({
  //         message: "Document doesnt exist",
  //         type: "warning",
  //       });
  //     }
  //   });
  // };

  // React.useEffect(() => {
  //   const baseUrl = "http://192.168.120.121:8080/thikthak/";
  //   axios
  //     .post("http://192.168.120.121:8080/thikthak/api/login", {
  //       username: "system",
  //       password: "system",
  //     })
  //     .then(function (response) {
  //       // console.warn(response);
  //     })
  //     .catch(function (error) {
  //       // console.warn(error);
  //     });
  // }, []);

  const updatePost = async () => {
    let userData = {
      id: user.uid,
      email: "farisha",
      status: "pending",
    };

    userRef.get().then((doc) => {
      const userID = doc.get('id')
      console.warn(userID)
      if (doc.exists && user.uid == userID) {
            console.warn("already exists");
            userRef
              .update(userData)
              .then(() => {
                showMessage({
                  message: "Success",
                  description: "Your data was updated",
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
      } else {
        userRef
        .set(userData)
        .then(() => {
          showMessage({
            message: "Success",
            description: "Your data was set",
            type: "success",
            });
            console.warn("does not exist");
          })
          .catch((err) => {
            showMessage({
              message: "Error",
              description: err.message,
              type: "danger",
            });
          });
      }
    });
  };

  return (
    <SafeAreaView style={{ marginHorizontal: 20, flex: 1 }}>
      <ScrollView>
        {user.uid == "MUjeAeY5cab9N8slLYbJZbIvDxs1" ? (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text>You are admin</Text>
            <Button
              title="SignOut"
              onPress={() => {
                firebase.auth().signOut();
              }}
            />
          </View>
        ) : (
          <>
            <Button title="navigate" onPress={updatePost} />

            <Button
              title="SignOut"
              onPress={() => {
                firebase.auth().signOut();
              }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;
