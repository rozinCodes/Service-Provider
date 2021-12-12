import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { firebase } from "../components/configuration/config";
import { StyleSheet, TextInput, View, Button } from "react-native";

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
//   const id = route.params;
  const user = firebase.auth().currentUser;
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        user: {
          _id: 2,
        
        },
      },
    ]);
  }, []);

  const onSend = (msgArray) => {
    const msg = msgArray[0];
    const myMsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: '2134144e',
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, myMsg)
    );
    const docID = user.uid;
    firebase
      .firestore()
      .collection("chatRoom")
      .doc(docID)
      .collection("messages")
      .add({
        ...msg,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };
  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(text) => onSend(text)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};

export default ChatScreen;
