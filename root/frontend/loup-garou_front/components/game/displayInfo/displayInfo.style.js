import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom : 10
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
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
  },
  textBox: {
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#666666',
  },
  value: {
    fontSize: 16,
    color: '#333333',
  },
});

export default styles;
