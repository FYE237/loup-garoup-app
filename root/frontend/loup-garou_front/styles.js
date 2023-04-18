import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONT} from "./constants/index.js";

const GLOBAL_STYLES = StyleSheet.create({
    container: {
        width: "100%",
    },
    textSmallWarn: {
        fontSize: SIZES.small,
        color:  "#990000",
    },
    textSmallTitle: {
        fontFamily: FONT.ItalicFont, 
        fontSize: SIZES.large,
        color: COLORS.darkGrey,
        textAlign: 'center'
    },
    textModal: {
        fontFamily: FONT.ItalicFont, 
        fontSize: SIZES.modalSize,
        color: COLORS.darkGrey, 
        textAlign: 'center'
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
    background: {
        borderRadius: 10,
        overflow : "hidden",
        flex: 0.3,
        resizeMode: 'cover',
        backgroundColor: 'transparent'
      },
});

export {
  GLOBAL_STYLES
}
