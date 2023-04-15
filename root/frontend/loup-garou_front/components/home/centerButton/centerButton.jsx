import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import styles from "./centerButton.style";
import { GLOBAL_STYLES } from "../../../styles";

export default function CenterButton({ textButton, onPressFunc, styleArg}) { 
    return (
      <View style={[styleArg, styles.container]}>
        <TouchableOpacity 
          onPress={onPressFunc}
          style = {styles.button}>
            <Text style={GLOBAL_STYLES.textCenterLarge}>{textButton}</Text>
          </TouchableOpacity>
      </View>
    );
};

