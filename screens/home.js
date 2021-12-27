import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebase } from "../components/configuration/config";
import { Header } from "../components/header";
import { colors } from "../presets";

const Home = ({ navigation }) => {
  const user = firebase.auth().currentUser;
  const userRef = firebase.firestore().collection("users");
  const postRef = firebase.firestore().collection("posts");

  let [userInfo, setUserInfo] = useState([]);
  let [postInfo, setPostInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (user.uid == "MUjeAeY5cab9N8slLYbJZbIvDxs1") {
      //pending users
      userRef.where("userStatus", "==", "pending").onSnapshot((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          users.push(doc.data());
        });
        setUserInfo(users);
      });
      setLoading(false);
    } else {
      userRef.doc(user.uid).onSnapshot((snapshot) => {
        const user = [];
        user.push(snapshot.data());
        setUserInfo(user);
      });

      //approved users
      postRef.onSnapshot((snapshot) => {
        const userPosts = [];
        snapshot.forEach((doc) => {
          userPosts.push(doc.data());
        });
        setPostInfo(userPosts);
      });
      setLoading(false);
    }
  }, []);

  //check if user is approved or not
  const checkApproved = () => {
    const userStatus = userInfo.map((item) => item.userStatus);
    if (userStatus != "Approved") {
      showMessage({
        message: "Not approved",
        description: "Your profile is not yet approved by the admin",
        type: "warning",
        position: "top",
        floating: true,
      });
    } else {
      navigation.navigate("Profile");
    }
  };

  //called when admin approves the user
  const userApproved = async (id) => {
    setLoading(true);
    let data = {
      userStatus: "Approved",
      approvalTime: Date(),
    };
    await userRef
      .doc(id)
      .update(data)
      .then(() => {
        showMessage({
          message: "Success",
          description: "Account status changed",
          type: "success",
        });
        setLoading(false);
      })
      .catch((err) => {
        showMessage({
          message: "Error",
          description: err.message,
          type: "danger",
          floating: true,
        });
        setLoading(false);
      });
  };

  //called when admin rejects the user
  const userRejected = async (id) => {
    let data = {
      userStatus: "Rejected",
      approvalTime: Date(),
    };
    await userRef
      .doc(id)
      .update(data)
      .then(() => {
        showMessage({
          message: "Success",
          description: "Account status changed",
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

  const renderUsers = ({ item }) => {
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
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  borderWidth: 0.1,
                  resizeMode: "cover",
                }}
              />
            )}
            <Text style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {item.userName}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                letterSpacing: 2,
                textTransform: "capitalize",
              }}
            ></Text>
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
                {item.userStatus}
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
                onPress={() => userApproved(item.userId)}
              >
                Approve
              </Button>
              <Button
                icon="skull-crossbones"
                key={item.id}
                color="red"
                mode="outlined"
                onPress={() => userRejected(item.userId)}
              >
                Reject
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const deletePost = () => {
    postRef
      .doc(user.uid)
      .delete()
      .then((response) => {
        showMessage({
          message: "Success",
          description: response,
          type: "success",
        }).catch((err) => {
          showMessage({
            message: "Failed",
            description: err.message,
            type: "danger",
          });
        });
      });
  };

  const renderPosts = ({ item }) => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {item.url && (
          <Image
            source={{ uri: item.image }}
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              borderWidth: 0.1,
              resizeMode: "cover",
            }}
          />
        )}

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
          <Text>{item.phone}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>{item.email}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 16,
              justifyContent: "space-around",
            }}
          >
            {user.uid != item.userId ? (
              <Button
                style={{ flex: 1 }}
                color="green"
                mode="contained"
                onPress={() =>
                  navigation.navigate("ChatScreen", { id: item.userId })
                }
              >
                Hire
              </Button>
            ) : (
              <Button
                style={{ flex: 1 }}
                color="red"
                mode="contained"
                onPress={deletePost}
              >
                Delete
              </Button>
            )}
          </View>
        </View>
      </View>
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
      <Header
        title="Home"
        post={user.uid == "MUjeAeY5cab9N8slLYbJZbIvDxs1" ? false : true}
        onPress={() => checkApproved()}
      />
      <>
        {user.uid == "MUjeAeY5cab9N8slLYbJZbIvDxs1" ? (
          <>
            {loading ? (
              <Loading />
            ) : (
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={userInfo}
                renderItem={renderUsers}
                keyExtractor={(item) => item.userId}
                key={(item) => item.userId}
              />
            )}
          </>
        ) : (
          <>
            {postInfo.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {userInfo.map((item) => item.userStatus) == "Approved" ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: colors.green,
                      }}
                    >
                      {`Congrats! your account has been approved! \n You can now create posts`}
                    </Text>

                    <LottieView
                      style={{
                        height: 200,
                      }}
                      source={require("../assets/approved.json")}
                      autoPlay={true}
                    />
                  </View>
                ) : (
                  <>
                    <View>
                      <Text style={{ fontWeight: "bold" }}>
                        Your account is under approval process
                      </Text>
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
                  </>
                )}
              </View>
            ) : (
              <>
                {loading ? (
                  <Loading />
                ) : (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={postInfo}
                    renderItem={renderPosts}
                    keyExtractor={(item) => item.userId}
                    key={(item) => item.userId}
                  />
                )}
              </>
            )}
          </>
        )}
      </>
    </SafeAreaView>
  );
};
export default Home;
