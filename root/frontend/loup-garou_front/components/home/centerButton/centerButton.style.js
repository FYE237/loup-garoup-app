import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.greenApple,
    borderRadius: SIZES.borderRadiusBig, 
    borderLeftWidth: SIZES.borderWidthBig,
    borderColor: COLORS.borderColor, 
    opacity: 0.75,
  },
});

export default styles;
