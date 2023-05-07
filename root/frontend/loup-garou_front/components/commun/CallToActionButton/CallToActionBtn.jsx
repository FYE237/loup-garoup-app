import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import styles from './CallToActionBtn.style.js';

export default function CallToActionBtn({ onPress, title }) {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};
