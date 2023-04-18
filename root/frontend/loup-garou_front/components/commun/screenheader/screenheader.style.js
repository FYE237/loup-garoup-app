import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.darkGrey,
    borderRadius: 6 ,
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: (dimension) => ({
    width: dimension,
    height: dimension,
    borderRadius: 6,
  }),
});

export default styles;
