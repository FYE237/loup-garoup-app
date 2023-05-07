import { useState} from 'react'
import { Modal, Button, Text, View } from 'react-native'

const ActionModal = ({ textButton, players, handlePlayerClick }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleButtonClick = playerName => {
    setModalVisible(false);
    handlePlayerClick(playerName);
  };
  if (players){
    return (
      <View>
        <Button title={textButton} onPress={() => setModalVisible(true)} />
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={{ marginTop: 100, backgroundColor: 'white', padding: 20 }}>
            {players.map(player => (
              <Button key={player.playerName} title={player.playerName} onPress={() => handleButtonClick(player.playerName)} />
            ))}
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      </View>
    );
  }
};

export default ActionModal;