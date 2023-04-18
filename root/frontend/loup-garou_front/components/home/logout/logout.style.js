import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightRed,
    borderRadius: SIZES.borderRadius, 
    borderLeftWidth: SIZES.borderWidth,
    borderColor: COLORS.borderColor, 
  },
});

export default styles;
