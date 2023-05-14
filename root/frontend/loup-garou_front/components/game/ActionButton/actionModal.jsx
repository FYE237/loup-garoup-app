import { useState} from 'react'
import { Modal, Button, Text, View,StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { images } from "../../../constants"
import styles from './actionModal.style';
import { GLOBAL_STYLES } from '../../../styles';
const ActionModal = ({ textButton, players, handlePlayerClick, imageLink }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleButtonClick = playerName => {
    setModalVisible(false);
    handlePlayerClick(playerName);
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.infoBox} >
          <View style={styles.iconContainer}>
            <Image source={imageLink}  style={styles.icon} />
          </View>
          <TouchableOpacity style={styles.textBox} onPress={() => setModalVisible(true)}>
           <View style={{ ...styles.buttonContainer, backgroundColor: '#FDF2F0' }}>
           <Text style={ GLOBAL_STYLES.gameTextBox}>{textButton}</Text>
           </View>
         </TouchableOpacity>
      </View>
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={GLOBAL_STYLES.gameTextMid}>{textButton}</Text>
            <ScrollView style={styles.modalScrollView}>
              {players.map(player => (
                <TouchableOpacity key={player.playerName} style={styles.modalButton} onPress={() => handleButtonClick(player.playerName)}>
                  <Text style={GLOBAL_STYLES.textModal}>{player.playerName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default ActionModal;