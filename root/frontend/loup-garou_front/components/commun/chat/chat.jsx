import React from 'react';
import { View, Text } from 'react-native';

export default function Chat({ chat }) {
  return (
    <View>
      <Text>Chat Name: {chat.chatname}</Text>
      <Text>Chat Room: {chat.chatroom}</Text>
    </View>
  );
}

