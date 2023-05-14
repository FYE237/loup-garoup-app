import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";
import { GLOBAL_STYLES } from "../../../styles";

const styles = StyleSheet.create({
  mainView: {
    paddingBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalScrollView: {
    maxHeight: '60%',
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  modalButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  modalCancelButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
  },
  modalCancelButtonText: {
    fontFamily: FONT.ItalicFont, 
    fontSize: 23,
    textAlign: 'center',
    color: 'red',
  },
  icon: {
    width: 40,
    height: 40,
  },
  buttonContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
});

export default styles;
