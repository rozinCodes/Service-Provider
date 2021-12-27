import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebase } from "../components/configuration/config";
import { colors } from "../presets";

const History = () => {
  const userRef = firebase.firestore().collection("users");

  let [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    userRef.where("userStatus", "!=", "pending")
    .onSnapshot((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          users.push(doc.data());
        });
        setUserInfo(users);
        setLoading(false);
      })
  }, []);

  const renderItem = ({ item }) => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
              style={{
                flexDirection: "column",
                width: "100%",
                borderWidth: 0.4,
                borderRadius: 12,
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
              <Text style={{ fontWeight: "bold" }}>
                Account Created: {item.creationTime}
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                Approval Completed: {item.approvalTime}
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
                    backgroundColor:
                      item.userStatus == "Rejected"
                        ? colors.lightred
                        : colors.green,
                  }}
                >
                  {item.userStatus}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

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
          loop={true}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ marginHorizontal: 20, flex: 1 }}>
      {loading ? (
        <Loading />
      ) : (
        <>
          {userInfo.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Nothing here</Text>
              <Image
                source={require("../assets/empty.png")}
                style={{
                  width: "100%",
                  height: 250,
                  marginTop: 20,
                  resizeMode: "contain",
                }}
              />
            </View>
          ) : (
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={userInfo}
              renderItem={renderItem}
              keyExtractor={(item) => item.userId}
              key={(item) => item.userId}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};
export default History;
