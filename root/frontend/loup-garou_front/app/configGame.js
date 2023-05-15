import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { StyleSheet,
         ImageBackground, 
         Image, 
         View, 
         Modal, 
         TouchableOpacity, 
         Text, 
         SafeAreaView,
         ScrollView,
         Alert } from 'react-native';

import { Link, Stack, useNavigation} from "expo-router";
import {
  Pseudo,
  Logout,
  CenterButton,
  InputModal,
  ScreenHeader
} from "../components";
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useRouter , Redirect } from "expo-router";
import {images, COLORS, LINKS} from "../constants"

import React from 'react'

async function getToken(){
  try {
    let value = await AsyncStorage.getItem('userToken').then(
      (value) => {
          // console.log("value = ", value);
          return value;
      }
      )
    return value;
  } catch (error) {
    console.log('Error: ',error);
    return null;
  }
}

/**
 * This method is used for debugging
 */
const getDateAfterSeconds = (sec) => {
  const now = new Date();
  const timestamp = now.getTime() + sec*1000; // Add 45 seconds in milliseconds
  const futureDate = new Date(timestamp);
  return futureDate;
};


const getTomorrowAt8AM = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8);
  tomorrow.setMinutes(0);
  tomorrow.setSeconds(0);
  tomorrow.setMilliseconds(0);
  return tomorrow;
};

const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  const monthString = month < 10 ? `0${month}` : `${month}`;
  const dayString = day < 10 ? `0${day}` : `${day}`;
  const hoursString = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${year}-${monthString}-${dayString};${hoursString}:${minutesString}:${secondsString}`;
};

const getSecondsDifference = (dateString) => {
  const dateParts = dateString.split(';');
  const dateComponents = dateParts[0].split('-').map(part => parseInt(part));
  const timeComponents = dateParts[1].split(':').map(part => parseInt(part));
  const targetDate = new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2], timeComponents[0], timeComponents[1], timeComponents[2]);
  const currentDate = new Date();
  const differenceInSeconds = Math.floor((targetDate.getTime() - currentDate.getTime()) / 1000);
  return differenceInSeconds;
};

const validateDate = (dateString) => {
  const pattern = /^([0-9]{4})-([0-9]{2})-([0-9]{2});([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
  if (!pattern.test(dateString)) {
    return false;
  }
  const dateParts = dateString.split(';');
  const date = dateParts[0];
  const time = dateParts[1];
  const datePattern = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
  const timePattern = /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
  if (!datePattern.test(date) || !timePattern.test(time)) {
    return false;
  }
  const [year, month, day] = date.split('-').map((value) => parseInt(value));
  const [hour, minute, second] = time.split(':').map((value) => parseInt(value));
  if (getSecondsDifference(dateString)<0){return false;}
  const dateObject = new Date(year, month - 1, day, hour, minute, second);
  return dateObject.getFullYear() === year && dateObject.getMonth() === month - 1 && dateObject.getDate() === day &&
    dateObject.getHours() === hour && dateObject.getMinutes() === minute && dateObject.getSeconds() === second;
};



export default function ConfigGame() {
  const router =  useRouter();
  const navigation = useNavigation();
  const [nbParticipant, setNbParticipant] = useState(5);
  const [dureeJour, setDureeJour] = useState(12);
  const [dureeNuit, setDureeNuit] = useState(12);
  const [dateDebut, setDateDebut] = useState(formatDateToString(getDateAfterSeconds(20)));
  const [probaPouvoirSpecial, setProbaPouvoirSpecial] = useState(1);
  const [proportionLoup, setProportionLoup] = useState(0.3);
  const [createButtonDisabled, setCreateButtonDisabled] = useState(false);

  const [nbParticipantModal, setNbParticipantModal] = useState(false);
  const [dureeJourModal, setDureeJourModal] = useState(false);
  const [dureeNuitModal, setDureeNuitModal] = useState(false);
  const [dateDebutModal, setDateDebutModal] = useState(false);
  const [probaPouvoirSpecialModal, setProbaPouvoirSpecialModal] = useState(false);
  const [proportionLoupModal, setProportionLoupModal] = useState(false);
  
  const validate_value = (value ,min, max) => {
     if (!isNaN(parseFloat(value)) && isFinite(value)){
      const val = parseFloat(value);
      if (val <= max && val >= min ){
        return true;  
      }
     }
     return false;
  } 
  
  const enterIntoGame = () => {
    navigation.popToTop();
    router.replace('/GamePage');
  }

  const createGameFunc = async () =>{
    await sendFormFunc();
  }

  const sendFormFunc = async () => {
    let data = {
        heure_debut: getSecondsDifference(dateDebut),
        nb_participant: nbParticipant,
        hote_name: await AsyncStorage.getItem('userPseudo'),
        duree_jour: dureeJour,
        duree_nuit: dureeNuit,
        proba_pouvoir_speciaux: probaPouvoirSpecial,
        proportion_loup: proportionLoup
    }
    try {
        let tokenVal =  await getToken();
        const response = await fetch(
          LINKS.backend + '/api/parties',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              "x-access-token": tokenVal
            },
            body: `data=${JSON.stringify(data)}`
          }
        )
        if (response.status === 200) {
          const data = await response.json();
          console.log(data)
          await AsyncStorage.setItem('currentGameId', data.data.game_id);
          Alert.alert('Sucess', 'Le jeu a été crée avec sucess')
          enterIntoGame();
        } else {
          Alert.alert('Error', 'Il y avait une erreur lors de la creation du jeu')
        }
      } catch (error) {
        Alert.alert('Error', 'Il y avait une erreur lors de la creation du jeu')
      }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.lightRed },
                    headerShadowVisible: false,
                    headerRight: () => (
                        <ScreenHeader
                            imageurl={images.icon_wolf_head}
                            dimension='60%'
                            handlePress={() => {
                              navigation.popToTop()
                            }}
                        />
                    ),
                    headerTitle: "Configurez le jeu",
                }}
        />

      <View style={styles.container}>
        <ImageBackground source={images.background_lone_wolf} style={styles.background}>
        <ScrollView>
        <Link href="/home">Home</Link>
        <View style = {styles.centerContainer}>
          <CenterButton
           textButton = {"joueur souhaité ("+nbParticipant+")"}
           onPressFunc = {() => setNbParticipantModal(true)}
           styleArg = {styles.button}
           TextSize = {30} 
           boxColorArg={"#78909c"}
          />
          <InputModal 
            visibleParam = {nbParticipantModal}
            textInit = {"joueur souhaité ("+nbParticipant+")"}
            visibleFunc = {() => setNbParticipantModal(false)}
            submitText = {"Valider"}
            inputValue = {nbParticipant}
            submitFunc = {(text, setErrorFunc) => {
              if (validate_value(text, 3,20)){
                  setNbParticipant(parseInt(text))
                  setNbParticipantModal(false)
                  return;
              }
              setErrorFunc("La valeur doit être entre 3 et 20 et inférieur au max");
            }}
            isImageBackground={false}
            title = {"Joueur souhaité"}
          />
          <CenterButton
           textButton = {"durée jour ("+dureeJour+")"}
           onPressFunc = {() => setDureeJourModal(true)}
           styleArg = {styles.button}
           TextSize = {30} 
           boxColorArg={"#78909c"}
          />
          <InputModal 
            visibleParam = {dureeJourModal}
            textInit = {"duree jour ("+dureeJour+")"}
            visibleFunc = {() => setDureeJourModal(false)}
            submitText = {"Valider"}
            inputValue = {dureeJour}
            submitFunc = {(text, setErrorFunc) => {
              if (validate_value(text, 1, 23)){
                setDureeJour(parseInt(text))
                setDureeNuit(24-parseInt(text))  
                setDureeJourModal(false)
                return;                
            }
            setErrorFunc("La valeur doit être entre 1 et 23");
          }}
            isImageBackground={false}
            title = {"Durée jour"}
          />
          <CenterButton
           textButton = {"durée nuit ("+dureeNuit+")"}
           onPressFunc = {() => setDureeNuitModal(true)}
           styleArg = {styles.button}
           TextSize = {30} 
           boxColorArg={"#78909c"}
          />
          <InputModal 
            visibleParam = {dureeNuitModal}
            textInit = {"durée nuit ("+dureeNuit+")"}
            visibleFunc = {() => setDureeNuitModal(false)}
            submitText = {"Valider"}
            inputValue = {dureeNuit}
            submitFunc = {(text, setErrorFunc) => 
              {
                if (validate_value(text, 1, 23)){
                    setDureeNuit(parseInt(text))
                    setDureeJour(24-parseInt(text))                  
                    setDureeNuitModal(false)
                    return;
                }
                setErrorFunc("La valeur doit être entre 1 et 23");
              }
              }
            isImageBackground={false}
            title = {"Durée nuit"}
          />
          <CenterButton
           textButton = {"date debut ("+dateDebut+")"}
           onPressFunc = {() => setDateDebutModal(true)}
           styleArg = {styles.button}
           TextSize = {30} 
           boxColorArg={"#78909c"}
          />
          <InputModal 
            visibleParam = {dateDebutModal}
            textInit = {"dateDebut ("+dateDebut+")"}
            visibleFunc = {() => setDateDebutModal(false)}
            submitText = {"Valider"}
            inputValue = {dateDebut}
            submitFunc = {(text, setErrorFunc) => {
                if (validateDate(text)){
                    setDateDebut(text);
                    setDateDebutModal(false);
                    return;
                  }
                  setErrorFunc("La date doit être sous le format : yyyy-mm-dd;hh:mm:ss"
                               +" et ca doit être supérieur à la date d'aujourd'hui");
                }
              }
            isImageBackground={false}
            title = {"Date de début"}
          />
          <CenterButton
           textButton = {"%pouvoir spéciaux ("+probaPouvoirSpecial+")"}
           onPressFunc = {() => setProbaPouvoirSpecialModal(true)}
           styleArg = {styles.button}
           TextSize = {27} 
           boxColorArg={"#78909c"}
          />
          <InputModal 
            visibleParam = {probaPouvoirSpecialModal}
            textInit = {"probabilité ("+probaPouvoirSpecial+")"}
            visibleFunc = {() => setProbaPouvoirSpecialModal(false)}
            submitText = {"Valider"}
            // submitFunc = {submitfunc}
            inputValue = {probaPouvoirSpecial}
            submitFunc = {(text, setErrorFunc) =>{ 
              if (validate_value(text, 0, 1)){
                setProbaPouvoirSpecial(parseFloat(text))
                setProbaPouvoirSpecialModal(false)
                return;
              }
              setErrorFunc("La valeur doit être entre 0 et 1");
            }
          }
            isImageBackground={false}
            title = {"Probabilité des pouvoir spéciaux"}
          />
          <CenterButton
           textButton = {"Proportion loup ("+proportionLoup+")"}
           onPressFunc = {() => setProportionLoupModal(true)}
           styleArg = {styles.button}
           TextSize = {30} 
           boxColorArg={"#78909c"}
          />
          <InputModal 
            visibleParam = {proportionLoupModal}
            textInit = {"proportion loup ("+proportionLoup+")"}
            visibleFunc = {() => setProportionLoupModal(false)}
            submitText = {"Valider"}
            // submitFunc = {submitfunc}
            inputValue = {proportionLoup}
            submitFunc = {(text, setErrorFunc) => {
              if (validate_value(text, 0, 1)){
                setProportionLoup(parseFloat(text))
                setProportionLoupModal(false)
                return;
              }
              setErrorFunc("La valeur doit être entre 0 et 1");
            }
            } 
            isImageBackground={false}
            title = {"Proportion loup"}
          />
          <CenterButton
            textButton = {"Créer un jeu"}
            onPressFunc = {createGameFunc}
            styleArg = {styles.button}
            TextSize = {37}
            buttonDisabled = {createButtonDisabled}
            boxColorArg={"#4caf50"}
            extraMarginVerticalB = {60}
            extraMarginVerticalT = {30}
          />
        </View>
        <StatusBar style="auto" />
        </ScrollView>
        </ImageBackground>
      </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',  
  },
  centerContainer: {    
    flex: 1,
    flexDirection : "column",
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  button: {
    paddingVertical: 30,
    paddingHorizontal: 50,
    marginVertical: 15,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  
});
