import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import styles from "./tabBar.style"



const TabBar = ({ activeTab, setActiveTab }) => {
  const handleTabPress = tabNumber => {
    setActiveTab(tabNumber);
  };

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[
          styles.tabBarBox,
          activeTab === 1 ? styles.activeTabBarBox : null,
        ]}
        onPress={() => handleTabPress(1)}
      >
        <Text
          style={[
            styles.tabBarText,
            activeTab === 1 ? styles.activeTabBarText : null,
          ]}
        >
          jeu
        </Text>
        <View style={styles.tabBarBorder} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabBarBox,
          activeTab === 2 ? styles.activeTabBarBox : null,
        ]}
        onPress={() => handleTabPress(2)}
      >
        <Text
          style={[
            styles.tabBarText,
            activeTab === 2 ? styles.activeTabBarText : null,
          ]}
        >
          chats
        </Text>
        <View style={styles.tabBarBorder} />
      </TouchableOpacity>
    </View>
  );
};


export default TabBar;
