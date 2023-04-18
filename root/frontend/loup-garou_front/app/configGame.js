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
         ScrollView } from 'react-native';

import { Link, Stack, useNavigation} from "expo-router";
import {
  Pseudo,
  Logout,
  CenterButton,
  InputModal,
  ScreenHeader
} from "../components";

import { useRouter , Redirect } from "expo-router";
import {images, COLORS} from "../constants"

import React from 'react'

export default function ConfigGame() {
  const router =  useRouter();
  const navigation = useNavigation();
  const [nbParticipantMin, setNbParticipantMin] = useState(5);
  const [nbParticipantMax, setNbParticipantMax] = useState(20);
  const [dureeJour, setDureeJour] = useState(12);
  const [dureeNuit, setDureeNuit] = useState(12);
  const [horaireDebut, setHoraireDebut] = useState(8);
  const [probaPouvoirrSpecial, setProbaPouvoirrSpecial] = useState(0);
  const [proportionLoup, setProportionLoup] = useState(0.3);

  const [createButtonDisabled, setCreateButtonDisabled] = useState(false);

  const [nbParticipantMinModal, setNbParticipantMinModal] = useState(false);
  const [nbParticipantMaxModal, setNbParticipantMaxModal] = useState(false);
  const [dureeJourModal, setDureeJourModal] = useState(false);
  const [dureeNuitModal, setDureeNuitModal] = useState(false);
  const [horaireDebutModal, setHoraireDebutModal] = useState(false);
  const [probaPouvoirrSpecialModal, setProbaPouvoirrSpecialModal] = useState(false);
  const [proportionLoupModal, setProportionLoupModal] = useState(false);

  const validate_value = (value ,min, max) => {
     if (!isNaN(parseFloat(value)) && isFinite(value)){
      const val = parseFloat(value);
      console.log("val"+val);
      if (val <= max && val >= min ){
        console.log("val after "+val);
        return true;  
      }
     }
     return false;
  } 
  
  const submitfunc = () => {
    console.log("i have been pressed")
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
           textButton = {"min joueur ("+nbParticipantMin+")"}
           onPressFunc = {() => setNbParticipantMinModal(true)}
           styleArg = {styles.button}
           TextSize = {30} 
           boxColorArg={"#78909c"}
          />
          <InputModal 
            visibleParam = {nbParticipantMinModal}
            textInit = {"min joueur ("+nbParticipantMin+")"}
            visibleFunc = {() => setNbParticipantMinModal(false)}
            submitText = {"Valider"}
            // submitFunc = {submitfunc}
            inputValue = {nbParticipantMin}
            submitFunc = {(text, setErrorFunc) => {
              if (validate_value(text, 3,20)){
                if (parseInt(text)<nbParticipantMax){
                  setNbParticipantMin(parseInt(text))
                  setNbParticipantMinModal(false)
                  return;
                }
              }
              setErrorFunc("La valeur doit être entre 3 et 20 et inférieur au max");
            }}
            isImageBackground={false}
            title = {"Min joueurs"}
          />
          <CenterButton
           textButton = {"max joueur ("+nbParticipantMax+")"}
           onPressFunc = {() => setNbParticipantMaxModal(true)}
           styleArg = {styles.button}
           TextSize = {30} 
           boxColorArg={"#78909c"}
          />
          <InputModal 
            visibleParam = {nbParticipantMaxModal}
            textInit = {"max joueur ("+nbParticipantMax+")"}
            visibleFunc = {() => setNbParticipantMaxModal(false)}
            submitText = {"Valider"}
            // submitFunc = {submitfunc}
            inputValue = {nbParticipantMax}
            submitFunc = {(text, setErrorFunc) => {
              if (validate_value(text, 3, 20)){
                if (parseInt(text)>nbParticipantMin){
                  setNbParticipantMax(parseInt(text))
                  setNbParticipantMaxModal(false)
                  return;
                }
              }
              setErrorFunc("La valeur doit être entre 3 et 20 et inférieur au max");
            }}
            isImageBackground={false}
            title = {"Max joueurs"}
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
            // submitFunc = {submitfunc}
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
            textInit = {"max joueur ("+dureeNuit+")"}
            visibleFunc = {() => setDureeNuitModal(false)}
            submitText = {"Valider"}
            // submitFunc = {submitfunc}
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
           textButton = {"Horaire debut ("+horaireDebut+")"}
           onPressFunc = {() => setHoraireDebutModal(true)}
           styleArg = {styles.button}
           TextSize = {30} 
           boxColorArg={"#78909c"}
          />
          <InputModal 
            visibleParam = {horaireDebutModal}
            textInit = {"max joueur ("+horaireDebut+")"}
            visibleFunc = {() => setHoraireDebutModal(false)}
            submitText = {"Valider"}
            // submitFunc = {submitfunc}
            inputValue = {horaireDebut}
            submitFunc = {(text, setErrorFunc) => {
                if (validate_value(text, 1, 36000)){
                        setHoraireDebut(text)
                        setHoraireDebutModal(false)
                        return;
                      }
                  setErrorFunc("La valeur doit être entre 1 et 36000");
                }
              }
            isImageBackground={false}
            title = {"Horaire debut"}
          />
          <CenterButton
           textButton = {"%pouvoir spéciaux ("+probaPouvoirrSpecial+")"}
           onPressFunc = {() => setProbaPouvoirrSpecialModal(true)}
           styleArg = {styles.button}
           TextSize = {27} 
           boxColorArg={"#78909c"}
          />
          <InputModal 
            visibleParam = {probaPouvoirrSpecialModal}
            textInit = {"probabilité ("+probaPouvoirrSpecial+")"}
            visibleFunc = {() => setProbaPouvoirrSpecialModal(false)}
            submitText = {"Valider"}
            // submitFunc = {submitfunc}
            inputValue = {probaPouvoirrSpecial}
            submitFunc = {(text, setErrorFunc) =>{ 
              if (validate_value(text, 0, 1)){
                setProbaPouvoirrSpecial(parseFloat(text))
                setProbaPouvoirrSpecialModal(false)
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
            onPressFunc = {submitfunc}
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
