import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage'
import EnAttentePage from './EnAttentePage.js'
import JourPage from './jourPage.js'
import NuitPage from './nuitPage.js'
import FinJeuPage from './finJeuPage.js'
import { Stack, useRouter } from 'expo-router'
import { COLORS, images, LINKS, GAME_STATUS, ROLE, SPECIAL_POWERS } from '../constants'
import {
  ScreenHeader,
  ConfirmationModal
} from '../components'
import { GLOBAL_STYLES } from '../styles.js';
import { NAMING_FUNC } from '../helperFunctions';

let socket = io(LINKS.backend+"/api/parties/:id");


export default function GamePage (){
  const router = useRouter();
  const [gameState, setGameState] = useState(null);
  const [exitModal, setExitModal] = useState(false);
  const [title, setTitle] = useState("Chargement de la page .....");

  const handleConfirm = () => {
    setExitModal(false);
    router.replace('/home');
  };

  const handleCancel = () => {
    setExitModal(false);
  };

  useEffect(() => {
    if (gameState != null){
      setTitle(NAMING_FUNC.gameNameFunc(gameState.status))
    }else {
      setTitle("Chargement de la page .....");
    }
    return;
  }, [gameState]);


  useEffect(() => {
    AsyncStorage.getItem('userPseudo')
      .then(async (pseudo) => {
        console.log("Trying to join the game socket : " + pseudo);
        socket.emit('rejoindre-jeu', {
          pseudo,
          id_partie: await AsyncStorage.getItem('currentGameId')
        });
      })
      .catch((error) => {
        console.log(error);
      });
  
    // Listen for gamestatus events from the server
    socket.on('status-game', (data) => {
      setGameState(data);
    });
  
    // Clean up the event listener when the component unmounts
    return () => {
      socket.emit("leave-game");
      socket = io(LINKS.backend+"/api/parties/:id");

    };
  }, [socket]);


  //Page header containes the button to leave the game 
  //And informs of the current game status
  let StackPage = (
    <>
      <Stack.Screen
      options={{
        headerStyle: { backgroundColor: COLORS.lightMarineBlue },
        headerShadowViSeaRescuesible: false,
        headerRight: () => (
          <ScreenHeader
            imageurl={images.icon_wolf_head}
            dimension="60%"
            handlePress={() => {
              setExitModal(true);
            }}
          />
        ),
        headerTitle: title,
        headerTintColor: COLORS.richBrown
      }}
    />
    <ConfirmationModal
    visible={exitModal}
    message="Voulez vous vraiment quitter?"
    onConfirm={handleConfirm}
    onCancel={handleCancel}
  />
  </>
  )

  /**
   * Depending on the value of status in the gameState we will display
   * the page that correspands to that particular status.
   */
  if (gameState){
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
        <FinJeuPage
            gameStatus={gameState}  
            socket = {socket}
          />
        </>)
    }
  }
  else{
    return (
      <>
      {StackPage}
      <View style={[styles.container, styles.shadow]}>
      <Text style={GLOBAL_STYLES.gameTextLarge}>
          Chargement du jeu. Si cet écran persiste, appuyez sur le bouton 
          en haut à droite pour revenir au menu d'accueil.
      </Text>
      </View>
    </>)
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightMarineBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
  },
});


