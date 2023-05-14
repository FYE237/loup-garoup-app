import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import io from 'socket.io-client';
import { COLORS, images, LINKS } from '../constants'
import { GLOBAL_STYLES } from '../styles';

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
  }, [gameStatus]);


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
    <View style={styles.container}>
      <View style={styles.background}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.box}>
           <Text style={GLOBAL_STYLES.gameTextMid}>{`Identifiant du jeu: ${gameId}`}</Text>
           <Text style={GLOBAL_STYLES.gameTextMid}>{`Dernier message: ${latestMessage}`}</Text>
           <Text style={GLOBAL_STYLES.gameTextMid}>{`Nombre de joueur connecté: ${currentPlayers}`}</Text>
           <Text style={GLOBAL_STYLES.gameTextMid}>{`Nombre de joueur souhaité: ${requiredPlayers}`}</Text>
           <Text style={GLOBAL_STYLES.gameTextMid}>{`Le jeu va commencer dans: ${Math.floor(timer)}`}</Text>
            </View>  
          </View>
        </Modal>
      </View>
    </View>
  );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    box: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
      elevation: 2,
    },
  });
