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
    gameTextMid: {
        fontFamily: FONT.ItalicFont, 
        fontSize: SIZES.large,
        marginBottom: 10,
        color: COLORS.richBrown, 
        textAlign: 'center',
        fontWeight: 'bold',
    },
    gameTextBox: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#666666',
    },
    gameTextLarge: {
        fontFamily: FONT.ItalicFont, 
        fontSize: SIZES.CenterTextSize,
        color: COLORS.richBrown, 
        paddingLeft: 10, 
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
