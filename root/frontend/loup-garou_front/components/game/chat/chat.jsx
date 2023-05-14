import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import styles from './chat.style';

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

export default Chat;
