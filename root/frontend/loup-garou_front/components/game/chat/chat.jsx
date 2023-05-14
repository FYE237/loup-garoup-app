import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Chat = ({ chatroom, username, messages, onSendMessage, sendVisibility }) => {
  const [messageText, setMessageText] = React.useState('');

  const renderMessage = ({ item }) => {
    const isSelf = item.Sender === username;
    return (
      <View style={[styles.messageContainer, isSelf ? styles.selfMessageContainer : styles.otherMessageContainer]}>
        {sendVisibility && !isSelf && <Text style={styles.sender}>{item.Sender}</Text>}
        <Text style={styles.messageText}>{item.messageValue}</Text>
        {sendVisibility && isSelf && <Text style={styles.sender}>{item.Sender}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity
          onPress={() => {
            onSendMessage(messageText);
            setMessageText('');
          }}
        >
          <Text style={styles.sendButton}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

export default Chat;
