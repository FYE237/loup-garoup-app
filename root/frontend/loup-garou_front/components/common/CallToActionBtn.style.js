import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { FONT } from '../../constants';

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.greenApple,
    borderRadius: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    fontStyle: FONT.ItalicFont,
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
