import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,ScrollView, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
import { COLORS, images, LINKS, PLAYER_STATUS, ROLE, SPECIAL_POWERS } from '../constants'
import {
  Chat, 
  ActionModal,
  TabBar,
  InfoModal,
  DisplayInfo,
  ChatTabs
} from '../components'
import { NAMING_FUNC, IMAGE_FUNC } from '../helperFunctions';
import { GLOBAL_STYLES } from '../styles';



export default function  FinJeuPage ({gameStatus, socket}) {
  const [alivePlayers, setAlivePlayers] = useState([]);
  const [aliveHumans, setAliveHumans] = useState([]);
  const [aliveWolfs, setAliveWolfs] = useState([]);
  const [activeChatTab, setChatActiveTab] = useState(0);

  const [deadPlayers, setDeadPlayers] = useState([]);
  const [gameRoom, setGameRoom] = useState("");
  const [allchats, setAllChats] = useState([]);
  const [playerRole, setPlayerRole] = useState([]);
  const [specialPower, setSpecialPower] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [user, setUser] = useState('');
  const [gameId, setGameId] = useState('');  
  const [playerStatus, setPlayerStatus] = useState("");

  const [infoModalActif, setIsModalActionVisible] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState("");
  const [infoModalTitle, setInfoModalTitle] = useState("");

  const chats = () => {
    if (allchats){
      return (
        <View>
          <ChatTabs 
              chats={allchats}
              activeTab={activeChatTab}
              username={user}
              sendVisibility={true}
              setActiveTab={setChatActiveTab}
              sendMessageFunc={(message) => {
                handleMessage(message)
              }}
              />
        </View>
      ); 
    }
    else{
      <Text>chargement des chats </Text>
    }
  };

  const gameinfo = () => {
    let profileDetails;
    if (playerStatus === PLAYER_STATUS.vivant){
      profileDetails = [
        { icon: images.avatar_icon, label: 'pseudo', value: user },
      ];
    }else {
      profileDetails = [
        { icon: images.dead_player_icon, label: 'pseudo', value: user },
      ];
    }
    profileDetails.push({ icon: IMAGE_FUNC.roleImageFunc(playerRole),
                               label: 'rôle',
                               value: NAMING_FUNC.roleNameFunc(playerRole) })
    profileDetails.push({ icon: IMAGE_FUNC.powerImageFunc(specialPower), 
                               label: 'pouvoir',
                               value: NAMING_FUNC.powerNameFunc(specialPower) })
    if (profileDetails === 'pasDePouvoir') {
      userData.pop();
    }
      return (
      <ScrollView horizontal={true}>
      <ScrollView> 
      <View style={styles.viewBackground}>
      <Text style={GLOBAL_STYLES.gameTextLarge}>Profile </Text>
      <DisplayInfo data={profileDetails} />
      {(
        <>
          <Text style={GLOBAL_STYLES.gameTextLarge}>loups vivants:</Text>
          {aliveWolfs.map(player => (
            <DisplayInfo data={[
              { icon: images.wolf_game_icon, label: 'pseudo', value: player.playerName },
            ]} />
          ))}
          <Text style={GLOBAL_STYLES.gameTextLarge}>humains vivants:</Text>
          {aliveHumans.map(player => (
          <DisplayInfo data={[
            { icon: images.villager_icon, label: 'pseudo', value: player.playerName },
            { icon: images.voting_icon, label: 'votes', value: player.votes },
          ]} />
      ))}
        </>
      )}
    {deadPlayers.length > 0 &&
      <View>
        <Text style={GLOBAL_STYLES.gameTextLarge}>Joueur morts:</Text>
        {deadPlayers.map(player => (
          <DisplayInfo data={[
            { icon: images.dead_player_icon, label: 'pseudo', value: player.playerName },
            { icon: IMAGE_FUNC.roleImageFunc(player.playerRole),
              label: 'rôle',
              value: NAMING_FUNC.roleNameFunc(player.playerRole) }
          ]} />
        ))}
      </View>}
    </View>
    </ScrollView>
    </ScrollView>
  );
  };

  let content;
  if (activeTab === 1) {
    content = gameinfo();
  } else if (activeTab === 2) {
    content = chats();
  } 

  useEffect(() => {
    const handlePlayerInfo = (data) => {
      console.log("------------------------FinJeu-------------------------------");
      console.log("player info " + JSON.stringify(data));
      setAllChats([]);
      setAllChats(prevChats => prevChats.concat(Object.values(data.chats)));
      setGameRoom(data.roomId);
      setPlayerRole(data.playerRole);
      setSpecialPower(data.specialPowers);
      setUser(data.playerPseudo);
      setGameId(data.partieId);
      setPlayerStatus(data.playerStatut);
      const alive = [];
      const aliveHuman = [];
      const aliveWolf = [];
      const dead = [];  
      data.playersData.forEach(player => {
        // console.log(JSON.stringify(player))
        if (player.playerStatus === PLAYER_STATUS.vivant) {
          alive.push(player);
          if (player.playerRole === ROLE.humain){
            aliveHuman.push(player);
          }
          else if (player.playerRole === ROLE.loupGarou){
            aliveWolf.push(player);
          }
        } else if (player.playerStatus === PLAYER_STATUS.mort) {
          dead.push(player);
        }
      });
      // console.log("alive " + JSON.stringify(alive));
      const updatedAliveHumans = aliveHuman.map(player => ({
        ...player,
        votes: 0
      }));
      setAlivePlayers(alive);
      setAliveHumans(updatedAliveHumans);
      setAliveWolfs(aliveWolf);
      console.log("dead data " + JSON.stringify(dead));
      setDeadPlayers(dead);
    }; 

    socket.on("game-result", function(data) {
      setInfoModalMessage(data.message);
      setInfoModalTitle("Résultat");
      setIsModalActionVisible(true);
    });

    socket.on('player-info', handlePlayerInfo);

    return () => {
      socket.off('player-info',  () => {});
    };
  }, [socket]);

  return (
    <View style={{ flex: 1 }}>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {content}
      <InfoModal
          visibleParam={infoModalActif}
          visibleFunc={() => {
            setIsModalActionVisible(false)
          }}
          title={infoModalTitle}
          message={infoModalMessage}
        />
    </View>
  );

};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10
  },
  viewBackground: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: COLORS.lightMarineBlue,
  },
})



