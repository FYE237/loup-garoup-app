import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import CustomTabBar from '../customTabBar/customTabBar';
import Chat from '../chat/chat';

const ChatTabs = ({ chats, username, activeTab, setActiveTab, sendMessageFunc, sendVisibility }) => {
  
  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <View style={styles.container}>
      <CustomTabBar
        tabs={chats.map((chat) => ({ label: chat.chatname }))}
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        style={styles.tabBar}
      />
      <Chat
        chatroom={chats[activeTab].chatroom}
        username={username}
        messages={chats[activeTab].messages}
        onSendMessage={sendMessageFunc}
        sendVisibility={sendVisibility}
        style={styles.chat}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chat: {
    flex: 1,
  },
});

export default  ChatTabs