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
  const [gameId, setGameId] = useState("");

  useEffect(() => {
    if (gameStatus){
      setLatestMessage(gameStatus.message)
      setCurrentPlayers(gameStatus.nb_players_actuel);
      setRequiredPlayers(gameStatus.nb_participant_souhaite);
      setTimer(gameStatus.temps_restant / 1000);  
      setGameId(gameStatus.partieId);
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
            <Text>{`identifiant du jeu: ${gameId}`}</Text>
            <Text>{`dernier message: ${latestMessage}`}</Text>
            <Text>{`nombre courant de joueur: ${currentPlayers}`}</Text>
            <Text>{`nombre requit: ${requiredPlayers}`}</Text>
            <Text>{`Le jeu va commencer dans: ${Math.floor(timer)}`}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

