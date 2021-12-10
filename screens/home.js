import React from "react";
import {
  FlatList,
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebase } from "../components/configuration/config";
import { Button } from "react-native-paper";
import { colors } from "../presets";
import { Header } from "../components/header";

const Home = ({ navigation }) => {
  const user = firebase.auth().currentUser;
  const userRef = firebase.firestore().collection("users");

  let [userInfo, setUserInfo] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const users = [];
    setLoading(true);
    userRef.where("status", "==", "pending").onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUserInfo(users);
    });
    setLoading(false);
  }, [userApproved, userRejected]);

  const userApproved = (id) => {
    let data = {
      status: "Accepted",
      approvalTime: Date(),
    };
    userRef
      .doc(id)
      .update(data)
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
          floating: true,
          position: "bottom",
        });
      });
  };
  const userRejected = (id) => {
    let data = {
      status: "Rejected",
      rejectionTime: Date(),
    };
    userRef
      .doc(id)
      .update(data)
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
          floating: true,
          position: "bottom",
        });
      });
  };

  const renderItem = ({ item }) => {
    return (
      <ScrollView>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              borderWidth: 0.4,
              borderRadius: 12,
              marginBottom: 14,
              padding: 12,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                letterSpacing: 2,
                textTransform: "capitalize",
              }}
            >
              {item.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>{item.email}</Text>
              <Text
                style={{
                  marginRight: 30,
                  textTransform: "capitalize",
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  color: colors.white,
                  backgroundColor: colors.lightred,
                }}
              >
                {item.status}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 16,
                justifyContent: "space-around",
              }}
            >
              <Button
                icon="check"
                key={item.id}
                color="green"
                mode="outlined"
                onPress={() => userApproved(item.userID)}
              >
                Approve
              </Button>
              <Button
                icon="skull-crossbones"
                key={item.id}
                color="red"
                mode="outlined"
                onPress={() => userRejected(item.userID)}
              >
                Reject
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ marginHorizontal: 20, flex: 1 }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          {user.uid == "MUjeAeY5cab9N8slLYbJZbIvDxs1" ? (
            <>
              <Button
                color="red"
                mode="outlined"
                onPress={() => firebase.auth().signOut()}
              >
                Navigate
              </Button>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={userInfo}
                renderItem={renderItem}
                keyExtractor={(item) => item.userID}
                key={(item) => item.userID}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 0.8, backgroundColor: colors.grey }} />
                )}
              />
            </>
          ) : (
            <>
              <Header
                title="Home"
                post
                onPress={() => navigation.navigate("Profile")}
              />
              <Text>Default user, you are!</Text>
              <Button
                color="red"
                mode="outlined"
                onPress={() => firebase.auth().signOut()}
              >
                Navigate
              </Button>
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
};
export default Home;
