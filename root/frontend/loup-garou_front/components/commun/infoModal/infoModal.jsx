import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Modal, View } from 'react-native';
import { GLOBAL_STYLES } from "../../../styles";
import styles from "./infoModal.style";

const infoModal = ({visibleParam, visibleFunc, title, message}) => {
  return (
    <>
      <Modal
        visible={visibleParam}
        animationType="slide"
        onRequestClose={visibleFunc}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalButton} onRequestClose={visibleFunc}>
            <Text style={[GLOBAL_STYLES.textSmallTitle, {flex : 1}]}>{title}</Text>
            <Text style={styles.closeModalText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.modalContent}>{message}</Text>
        </View>
      </Modal>
    </>
  );
};

