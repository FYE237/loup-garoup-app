import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";



const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
