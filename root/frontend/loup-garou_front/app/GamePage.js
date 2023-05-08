import React, { useState, useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage'
import EnAttentePage from './EnAttentePage.js'
import JourPage from './jourPage.js'
import NuitPage from './nuitPage.js'
import { Stack, useRouter } from 'expo-router'
import { COLORS, images, LINKS, GAME_STATUS, ROLE, SPECIAL_POWERS } from '../constants'
import {
  ScreenHeader
} from '../components'

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
    let StackPage = 
        <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightRed },
          headerShadowViSeaRescuesible: false,
          headerRight: () => (
            <ScreenHeader
              imageurl={images.icon_wolf_head}
              dimension="60%"
            />
          ),
          headerTitle: gameState.status
        }}
      />
    if (gameState.status === GAME_STATUS.enAttente) {
      return (
      <>
      {StackPage}
      <EnAttentePage
            gameStatus={gameState}  
              />
      </>);
    } else if (gameState.status === GAME_STATUS.jour) {
      return (
        <>
        {StackPage}
        <JourPage
            gameStatus={gameState}  
            socket = {socket}
          />
        </>)  }
     else if (gameState.status === GAME_STATUS.soir) {
      return (
        <>
        {StackPage}
        <NuitPage
            gameStatus={gameState}  
            socket = {socket}
          />
        </>)  
    } 
    else if (gameState.status === GAME_STATUS.finJeu) {
      return (
        <>
        {StackPage}
        <p>The game is over!</p>
        </>
        );
    }
  }
  else{
      return <p>Loading game state...</p>;
  }
};

