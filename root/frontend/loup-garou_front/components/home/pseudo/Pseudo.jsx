import React from "react";
import { View, Text } from "react-native";

import styles from "./pseudo.style";
import { GLOBAL_STYLES } from "../../../styles";

/**
 * This componenet will be used to place the value of the pseudo name of the 
 * user in the top left corner
 */
export default function Pseudo() { 
    return (
      <View style={styles.container}>
        <Text style = {GLOBAL_STYLES.textCenterLarge}>Pseudo name!</Text>
      </View>
    );
};

