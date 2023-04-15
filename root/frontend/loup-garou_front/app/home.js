import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { StyleSheet,ImageBackground, Image, View } from 'react-native';
import {
  Pseudo,
  Logout,
  CenterButton
} from "../components";
import { useRouter } from "expo-router";
import {images} from "../constants"


export default function Home() {
  const router =  useRouter()
  const [joinModalVisible, isJoinModalVisible] = useState(false);
  const [createModalVisible, isCreateModalVisible] = useState(false);

  const logoutFuntion = () => {
    console.log("i have been pressed")
  }
  return (
      <View style={styles.container}>
        <ImageBackground source={images.background_camp_fire} style={styles.background}>
        <View style={styles.header}>
          <Pseudo 
          styleArg={styles.pseudoBox} />
          <Logout 
          styleArg={styles.logoutBox}        
          logoutFuntion = {logoutFuntion} />
        </View>
        <Image
          source={images.background_tower}
          resizeMode='cover'
          style={{width: 20,
            height: 20,
            borderRadius: 50 / 1.25}
          }
        />
        <View style = {styles.centerContainer}>
          <CenterButton
          textButton = {"Rejoindre un jeu"}
          onPressFunc = {logoutFuntion}
          styleArg ={styles.button} 
          />
          <CenterButton
          textButton = {"Créer un jeu"}
          onPressFunc = {logoutFuntion}
          styleArg ={styles.button} 
          />
        </View>
        <StatusBar style="auto" />
        </ImageBackground>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    alignItems: 'stretch',
    justifyContent: 'center',  
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
    height: 80
  },
  pseudoBox: {
    // width: '50%',
    // height: 80,
    flex: 0.65, 
    height: 50,
    marginRight : 5,
    marginHorizontal: 10,
  },
  logoutBox: {
    // width: '50%',
    flex: 0.35,
    marginLeft : 5,
    marginHorizontal: 10,
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
