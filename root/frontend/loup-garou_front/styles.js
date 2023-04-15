import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONT} from "./constants/index.js";

const GLOBAL_STYLES = StyleSheet.create({
    container: {
        width: "100%",
    },
    textHeaderLarge: {
        fontFamily: FONT.ItalicFont, 
        fontSize: SIZES.headerSize,
        color: COLORS.gray, 
        textAlign: 'center'
    },
    textCenterLarge: {
        fontFamily: FONT.ItalicFont, 
        fontSize: SIZES.CenterTextSize,
        color: COLORS.gray, 
        textAlign: 'center'
    },
});

export {
  GLOBAL_STYLES
}
