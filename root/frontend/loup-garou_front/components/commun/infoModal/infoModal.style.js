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
  headerModal : {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default styles;
