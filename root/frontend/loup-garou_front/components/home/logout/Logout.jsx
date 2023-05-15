import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import styles from "./logout.style";
import { GLOBAL_STYLES } from "../../../styles";

export default function Logout({logoutFuntion, styleArg}) { 
    return (
      <View style={[styleArg, styles.container]}>
        <TouchableOpacity 
          onPress={logoutFuntion}>
            <Text style={GLOBAL_STYLES.textHeaderLarge}>déconnecter</Text>
          </TouchableOpacity>
      </View>
    );
};

