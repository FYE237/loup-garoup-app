import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import styles from './customTabBar.style';

const CustomTabBar = ({ tabs, activeTab, onChangeTab }) => {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tabBarBox,
            activeTab === index ? styles.activeTabBarBox : null,
          ]}
          onPress={() => onChangeTab(index)}
        >
          <Text
            style={[
              styles.tabBarText,
              activeTab === index ? styles.activeTabBarText : null,
            ]}
          >
            {tab.label}
          </Text>
          <View style={styles.tabBarBorder} />
        </TouchableOpacity>
      ))}
    </View>
  );
};



export default  CustomTabBar;