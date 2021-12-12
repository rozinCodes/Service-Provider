import React from "react";
import { ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebase } from "../components/configuration/config";

const Settings = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <Button mode="contained" onPress={() => firebase.auth().signOut()}>
          Signout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
