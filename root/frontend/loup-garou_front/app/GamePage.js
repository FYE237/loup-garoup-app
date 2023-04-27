import React, { useState, useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
import io from 'socket.io-client';
import { COLORS, images, LINKS, GAME_STATUS} from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EnAttentePage from './EnAttentePage.js'
import JourPage from './jourPage.js'

const socket = io(LINKS.backend+"/api/parties/:id");


export default function GamePage (){
  const [gameState, setGameState] = useState(null);

  useEffect(async () => {
    socket.emit('rejoindre-jeu', 
      {pseudo : await AsyncStorage.getItem('userPseudo'),
      id_partie : await AsyncStorage.getItem('currentGameId') 
        });

    // Listen for gamestatus events from the server
    socket.on('status-game', (data) => {
      console.log(data);
      setGameState(data);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  if (gameState){
    if (gameState.status === GAME_STATUS.enAttente) {
      return <EnAttentePage
            gameStatus={gameState}  
              />;
    } else if (gameState.status === GAME_STATUS.jour) {
      return <JourPage
            gameStatus={gameState}  
            socket = {socket}
              />;    } else if (gameState.status === GAME_STATUS.soir) {
      return <p>The game in in the night state!</p>;
    } 
    else if (gameState.status === GAME_STATUS.finJeu) {
      return <p>The game is over!</p>;
    }
  }
  else{
      return <p>Loading game state...</p>;
  }
};

