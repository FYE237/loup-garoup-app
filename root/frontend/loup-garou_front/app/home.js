import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState, useEffect } from 'react'
import { useFetchCustom } from "../customhooks"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native'
import {
  CenterButton,
  InputModal,
  Logout,
  Pseudo,
  ScreenHeader
} from '../components'
import { COLORS, images, LINKS } from '../constants'

export default function Home() {
  const router = useRouter()
  const [joinModalVisible, setJoinModalVisible] = useState(false)
  const [joinGameId, setJoinGameId] = useState(false)
  const [pseudo, setPseudo] = useState("pseudo");
  let {data, loading, errorValue} = useFetchCustom("/whoami");
  if (data && !loading){
      setPseudo(data.data);
  }
  if (errorValue){
    console.log("Found and error :" + errorValue);
  }
  // async function fetchPseudo(){
  //   console.log("Doing a lookup for the pseudo");
  //   console.log("pseudo is equal to " + pseudo);
  //   console.log("data home level =" + JSON.stringify(data));
    
  //   if (data && !loading){
  //     console.log("setting data" + JSON.stringify(data));

  //     await AsyncStorage.setItem('userPseudo', pseudo)
  //   }
  // }
  // fetchPseudo();

  // useEffect(() => {
  //     //This will allow us to get the user pseudo

  // }, []);
  
  const  logoutFuntion = async () => {
    await AsyncStorage.removeItem('userToken')
    router.replace("/WelcomePage")
  }

  const submitJoinGame = () => {
    console.log(joinGameId)
  }

  const createGameFunc = () => {
    router.push('/configGame')
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
              dimension="60%"
              handlePress={() => {
                router.replace('/home')
              }}
            />
          ),
          headerTitle: 'Folie de Minuit'
        }}
      />
      <View style={styles.container}>
        <ImageBackground
          source={images.background_camp_fire}
          style={styles.background}
        >
          <View style={styles.header}>
            <Pseudo styleArg={styles.pseudoBox} pseudo={pseudo} />
            <Logout styleArg={styles.logoutBox} logoutFuntion={logoutFuntion} />
          </View>
          <View style={styles.centerContainer}>
            <CenterButton
              textButton={'Rejoindre un jeu'}
              onPressFunc={() => setJoinModalVisible(true)}
              styleArg={styles.button}
            />
            <InputModal
              visibleParam={joinModalVisible}
              textInit={'id du jeu'}
              visibleFunc={() => setJoinModalVisible(false)}
              submitText={'Rejoindre le jeu'}
              submitFunc={submitJoinGame}
              inputValue={joinGameId}
              inputValueFunc={(text) => setJoinGameId(text)}
              isImageBackground={false}
              title={'Identifiant du jeu'}
            />
            <CenterButton
              textButton={'Créer un jeu'}
              onPressFunc={createGameFunc}
              styleArg={styles.button}
              extraMarginVertical={60}
            />
          </View>
          <StatusBar style="auto" />
        </ImageBackground>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center'
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
    flex: 0.65,
    height: 50,
    marginRight: 5,
    marginHorizontal: 10
  },
  logoutBox: {
    flex: 0.35,
    marginLeft: 5,
    marginHorizontal: 10
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 15
  },
  background: {
    flex: 1,
    resizeMode: 'cover'
  }
})
