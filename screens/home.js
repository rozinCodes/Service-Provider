import axios from "axios";
import React from "react";
import { ScrollView, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/button";
import { firebase } from "../components/configuration/config";

const Home = ({ navigation }) => {
  const user = firebase.auth().currentUser;
  const userRef = firebase.firestore().collection("users").doc(user.uid);
  let [users, setUsers] = React.useState([]);
  const [blogs, setBlogs] = React.useState([]);

  const createPost = async () => {
    userRef.get().then((doc) => {
      const data = [];

      if (doc.exists) {
        const authorized = doc.get("authorized");
        if (authorized == false) {
          showMessage({
            message: "you are not authorized yet",
            type: "danger",
          });
        } else {
          userRef.get().then((snapshot) => {
            snapshot.forEach((doc) => {
              data.push(doc.data);
            });
            console.warn(data);
          });
          showMessage({
            message: "Authorized",
            type: "success",
          });
        }
      } else {
        showMessage({
          message: "Document doesnt exist",
          type: "warning",
        });
      }
    });
  };

  React.useEffect(() => {
    const baseUrl = "http://192.168.120.121:8080/thikthak/";
    axios
      .post("http://192.168.120.121:8080/thikthak/api/login", {
        username: "system",
        password: "system",
      })
      .then(function (response) {
        console.warn(response);
      })
      .catch(function (error) {
        console.warn(error);
      });
  }, []);

  const UserApproval = () => {
    return <View></View>;
  };

  return (
    <SafeAreaView style={{ marginHorizontal: 20, flex: 1 }}>
      <ScrollView>
        <UserApproval />
        <Button title="navigate" onPress={createPost} />

        <Button
          title="SignOut"
          onPress={() => {
            firebase.auth().signOut();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;
