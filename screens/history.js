import React from "react";
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    Text,
    View
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebase } from "../components/configuration/config";
import { colors } from "../presets";

const History = () => {
  const user = firebase.auth().currentUser;
  const userRef = firebase.firestore().collection("users");

  let [userInfo, setUserInfo] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const users = [];
    setLoading(true);
    userRef
      .where("status", "!=", "pending")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          users.push(doc.data());
        });
        setUserInfo(users);
      });
    setLoading(false);
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
              {/* {item.rejectionTime ? <Text>{item.rejectionTime}</Text> : <Text>{item.approvalTime}</Text>} */}
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
                      item.status == "pending"
                        ? colors.lightred
                        : item.status == "Accepted"
                        ? colors.green
                        : colors.grey,
                  }}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={{ marginHorizontal: 20, flex: 1 }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          {user.uid == "MUjeAeY5cab9N8slLYbJZbIvDxs1" ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={userInfo}
              renderItem={renderItem}
              keyExtractor={(item) => item.userID}
              key={(item) => item.userID}
            />
          ) : (
            <>
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
export default History;
