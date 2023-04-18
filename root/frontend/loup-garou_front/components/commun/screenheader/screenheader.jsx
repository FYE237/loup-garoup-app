import React from "react";
import { Image, TouchableOpacity } from "react-native";

import styles from "./screenheader.style";

const ScreenHeader = ({ imageurl, dimension, handlePress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image
        source={imageurl}
        resizeMode='cover'
        style={styles.imageStyle(dimension)}
      />
    </TouchableOpacity>
  );
};

export default ScreenHeader;
