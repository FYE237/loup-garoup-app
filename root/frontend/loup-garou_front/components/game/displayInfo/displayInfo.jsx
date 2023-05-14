import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import styles from './displayInfo.style';

const DisplayInfo = ({ data }) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.infoBox}>
          <View style={styles.iconContainer}>
            <Image source={item.icon} style={styles.icon} />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};


export default DisplayInfo;
