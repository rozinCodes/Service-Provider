import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const Header = ({
  backButton = false,
  title,
  post = false,
  onPress,
}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: backButton == true ? "flex-start" : 'space-between',
        paddingLeft: 30,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      {backButton && (
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="caret-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}

      <Text style={{ fontWeight: "bold", fontSize: 25, marginBottom: 5 }}>
        {" "}
        {title}{" "}
      </Text>
      {post && (
		  <View>
          <Ionicons onPress={onPress} name="add" size={24} color="black" />
        </View>
      )}
    </View>
  );
};
