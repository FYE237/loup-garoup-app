import React from "react";
import { Image, TouchableOpacity } from "react-native";

import styles from "./screenheader.style";

const ScreenHeader = ({ imageurl, dimension, handlePress, testID }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} testID={testID}>
      <Image
        source={imageurl}
        resizeMode='cover'
        style={styles.imageStyle(dimension)}
      />
    </TouchableOpacity>
  );
};

export default ScreenHeader;
