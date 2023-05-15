import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

import styles from './confirmationModal.style';

const ConfirmationModal = ({ visible, message, onConfirm, onCancel, testIDConfirm, testIDCancel }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.redButton]} onPress={onConfirm} testID={testIDConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.whiteButton]} onPress={onCancel} testID={testIDCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default ConfirmationModal;