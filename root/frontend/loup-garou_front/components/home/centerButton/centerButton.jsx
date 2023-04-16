import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";

import styles from "./centerButton.style";
import { GLOBAL_STYLES } from "../../../styles";
import { COLORS, FONT, SIZES } from "../../../constants";

export default function CenterButton({ textButton, onPressFunc, 
                                        styleArg, TextSize,
                                        extraMarginVerticalB,
                                        extraMarginVerticalT,
                                        buttonDisabled,
                                        boxColorArg}) { 
    let num = 0;
    if (TextSize !== undefined){
      num = parseInt(TextSize);
      if (!(!isNaN(num) && Number.isInteger(num))) {
        num = 0;
      }
    }
    let boxColor = COLORS.greenApple;
    if (boxColorArg !==undefined){
      boxColor = boxColorArg;
    }
    return (
      <View style={[styleArg, styles.container, {marginBottom : extraMarginVerticalB,
                                                  marginTop : extraMarginVerticalT,
                                                   backgroundColor: boxColor,}]}>
        <TouchableOpacity 
          onPress={onPressFunc}
          style = {styles.button}
          disabled={buttonDisabled}
          >
            <Text style={ num ? [GLOBAL_STYLES.textCenterLarge, {fontSize : num}]: GLOBAL_STYLES.textCenterLarge}>{textButton}</Text>
          </TouchableOpacity>
      </View>
    );
};

