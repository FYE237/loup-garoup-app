import React, { useState, useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
import io from 'socket.io-client';
import { COLORS, images, LINKS } from '../constants'

export default function EnAttentePage ({gameStatus, socket}) {
  const [modalVisible, setModalVisible] = useState(true);
  const [currentPlayers, setCurrentPlayers] = useState(0);
  const [requiredPlayers, setRequiredPlayers] = useState(4);
  const [timer, setTimer] = useState(0);
  const [latestMessage, setLatestMessage] = useState("");

  useEffect(() => {
    if (gameStatus){
      setLatestMessage(gameStatus.message)
      setCurrentPlayers(gameStatus.nb_players_actuel);
      setRequiredPlayers(gameStatus.nb_participant_souhaite);
      setTimer(gameStatus.temps_restant / 1000);  
    }
  }, []);


  useEffect(() => {
    // Countdown timer logic
    let intervalId = null;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [timer]);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 20 }}>
            <Text>{`Lastest message: ${latestMessage}`}</Text>
            <Text>{`Current players: ${currentPlayers}`}</Text>
            <Text>{`Required players: ${requiredPlayers}`}</Text>
            <Text>{`Game starting in: ${timer}`}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

