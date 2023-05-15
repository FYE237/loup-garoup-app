import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState, useEffect } from 'react'
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

/**
 * This method tries to locate the token from the local storage
 * and the it saves so that we can use it later on
 * @returns 
 */
async function getToken(){
  try {
    let value = await AsyncStorage.getItem('userToken').then(
      (value) => {
          return value;
      }
      )
    return value;
  } catch (error) {
    console.log('Error: ',error);
    return null;
  }
}

export default function Home() {
  const router = useRouter()
  const [joinModalVisible, setJoinModalVisible] = useState(false)
  const [joinGameId, setJoinGameId] = useState(false)
  const [pseudo, setPseudo] = useState("pseudo");
  const [failJoinMessage, setFailJoinMessage] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [errorValue, setError] = useState(null);
  
  const  logoutFuntion = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userPseudo');
    router.replace("/WelcomePage")
  }

  const createGameFunc = () => {
    router.push('/configGame')
  }

  const enterIntoGame = () => {
    router.replace('/GamePage');
  }

  const sendFormFunc = async (gameid) => {

    try {
        let tokenVal =  await getToken();
        let dataQeury = {
          id_joueur: await AsyncStorage.getItem('userPseudo'),
        }
        const response = await fetch(
          LINKS.backend + '/api/parties/'+gameid,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              "x-access-token": tokenVal
            },
            body: `data=${JSON.stringify(dataQeury)}`
          }
        )

        if (response.status === 200) {
          const data = await response.json()
          await AsyncStorage.setItem('currentGameId', gameid);
          return true;
        } else {
          const data = await response.json()
          if (data){setFailJoinMessage(data.message);}
          return false;
        }
      } catch (error) {
        return false;
      }
  }

  useEffect(() => {
    async function fetchData(){
      let tokenVal =  await getToken();
      const queryDetails = {
        method: "GET",
        headers: {
        "x-access-token": tokenVal
        },
      };
        
      setIsLoading(true);
      try{
        const linkEndPoint = "/whoami"
        const response = await fetch(LINKS.backend+linkEndPoint, queryDetails);
        const data = await response.json();
        await setPseudo(data.data)
        if (data.data){
          await AsyncStorage.setItem('userPseudo', data.data);
        }
      } catch (error) {
          console.log("Fetch ran into an error : "+error);
          setIsLoading(false);
          setError(error);
      } finally {
          setIsLoading(false);
      }
    }
    fetchData()
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightRed },
          headerShadowViSeaRescuesible: false,
          headerRight: () => (
            <ScreenHeader
              imageurl={images.icon_wolf_head}
              dimension="60%"
              handlePress={() => {
                router.replace('/home');
              }}
            />
          ),
          headerTitle: 'Lunar'
        }}
      />
      <View style={styles.container}>
        <ImageBackground
          source={images.background_camp_fire}
          style={styles.background}
        >
          <View style={styles.header}>
            <Pseudo styleArg={styles.pseudoBox} pseudo={pseudo } />
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
              submitFunc = {async (text, setErrorFunc) => {
                if (await sendFormFunc(text)){
                    setJoinModalVisible(false);
                    enterIntoGame();
                    return;
                  }
                  setErrorFunc("cound not join the game, check if game id is valid; server error = " + failJoinMessage);
              }}
              inputValue={joinGameId}
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
