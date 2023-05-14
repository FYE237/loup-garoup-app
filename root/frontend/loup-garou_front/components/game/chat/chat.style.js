
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  selfMessageContainer: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#DCF8C6',
    maxWidth: '80%',
  },
  otherMessageContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'white',
    maxWidth: '80%',
  },
  sender: {
    fontSize: 12,
    color: '#888',
    marginRight: 8,
  },
  messageText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#CCC',
    padding: 8,
    alignItems: 'flex-end', 
    justifyContent: 'flex-end', 
    paddingBottom : 10
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    color: '#0084FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default styles;
