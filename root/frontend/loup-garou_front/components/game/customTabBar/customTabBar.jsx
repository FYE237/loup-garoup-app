import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  tabBarBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabBarBox: {
    borderBottomColor: '#007AFF',
  },
  tabBarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabBarText: {
    color: '#007AFF',
  },
  tabBarBorder: {
    paddingTop : 1,
    paddingBottom : 1,
    backgroundColor: '#007AFF',
  },
});

export default  CustomTabBar;