import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.borderRadiusBig, 
    borderLeftWidth: SIZES.borderWidthBig,
    borderColor: COLORS.borderColor, 
    opacity: 0.75,
    width : 300,
    height : 100,
  },
});

export default styles;
