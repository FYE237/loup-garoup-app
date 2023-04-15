import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import styles from "./logout.style";
import { GLOBAL_STYLES } from "../../../styles";

export default function Logout({logoutFuntion}) { 
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={logoutFuntion}>
            <Text style={GLOBAL_STYLES.textCenterLarge}>Logout</Text>
          </TouchableOpacity>
      </View>
    );
};

