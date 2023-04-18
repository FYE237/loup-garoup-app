import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor : COLORS.backgroundStrongGray,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    opacity : 0.95
  },
  closeButton: {
    alignSelf: 'flex-end',
    fontSize: 24,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  buttonSubmit: {
    marginTop : 20,
    backgroundColor: COLORS.greenApple,
    borderRadius: SIZES.borderRadiusBig, 
    borderWidth: SIZES.borderWidthMid,
    borderColor: COLORS.borderColor, 
  },
  headerModal : {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default styles;
