import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Modal, View } from 'react-native';
import { GLOBAL_STYLES } from "../../../styles";
import styles from "./infoModal.style";

const InfoModal = ({visibleParam, visibleFunc, title, message}) => {
  return (
    <Modal
      visible={visibleParam}
      animationType="slide"
      onRequestClose={visibleFunc}
      transparent={true}
    >
      <View style={[styles.modalContainer]}>
        <View style={styles.modalContent}>
          <View style={styles.headerModal}>
            <Text style={[GLOBAL_STYLES.textSmallTitle, {flex : 1}]}>{title}</Text>
            <TouchableOpacity style={styles.closeModalButton} onPress={visibleFunc}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
          </View>
          <Text style={GLOBAL_STYLES.textModal}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default InfoModal;


