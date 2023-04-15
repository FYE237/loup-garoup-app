import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONT} from "./constants/index.js";

const GLOBAL_STYLES = StyleSheet.create({
    container: {
        width: "100%",
    },
    textCenterLarge: {
        fontFamily: FONT.ItalicFont, 
        fontSize: SIZES.headerSize,
        color: COLORS.primary, 
        textAlign: 'center'
    },
});

export {
  GLOBAL_STYLES
}
