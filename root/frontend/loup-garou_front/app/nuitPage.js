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
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NAMING_FUNC, IMAGE_FUNC } from '../helperFunctions';
import { GLOBAL_STYLES } from '../styles';



export default function  NuitPage ({gameStatus, socket}) {
  const [playerInfo, setPlayerInfo] = useState(null);
  const [alivePlayers, setAlivePlayers] = useState([]);
  const [aliveHumans, setAliveHumans] = useState([]);
  const [aliveWolfs, setAliveWolfs] = useState([]);
  const [aliveBesidesCurrent, setAliveBesidesCurrent] = useState([]);
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

  const handleVote = async (playerName) => {
    socket.emit("vote-jour", user, playerName, gameId)
  };

  const handleVoyance = async (playerName) => {
    socket.emit("request-Voyance", user, playerName, gameId)
  };
  
  const handleContamination = async (playerName) => {
    socket.emit("request-Loup-alpha", user, playerName, gameId)
  };
  
  const handleSpiritisme = async (playerName) => {
    socket.emit("Pouvoir-Spiritisme", user, playerName, gameId)
  };
  
  const handleMessage = async (message) => {
    socket.emit("send-message-game", message, allchats[activeChatTab].chatroom, user, gameId);
  };
  
  const incrementVotes = (playerName) => {
    setAliveHumans(prevPlayersData => prevPlayersData.map(player => {
      if (player.playerName === playerName) {
        return {
          ...player,
          votes: (player.votes || 0) + 1
        }
      }
      return player;
    }));
  };

  const chats = () => {
    if (allchats){
      return (
        <View>
          <ChatTabs 
              chats={allchats}
              activeTab={activeChatTab}
              username={user}
              sendVisibility={playerStatus === PLAYER_STATUS.mort 
                              || specialPower !== SPECIAL_POWERS.insomnie}
              setActiveTab={setChatActiveTab}
              sendMessageFunc={(message) => {
                handleMessage(message)
              }}
              />
        </View>
      ); 
    }
    else{
      <Text>Loading jour day data </Text>
    }
  };

  const gameinfo = () => {
    let profileDetails;
    if (playerStatus === PLAYER_STATUS.vivant){
      profileDetails = [
        { icon: images.avatar_icon, label: 'pseudo', value: user },
        { icon: IMAGE_FUNC.roleImageFunc(playerRole), label: 'rôle', value: NAMING_FUNC.roleNameFunc(playerRole) },
      ];
      if (specialPower !== SPECIAL_POWERS.pasDePouvoir) {
        profileDetails.push(
          { icon: IMAGE_FUNC.powerImageFunc(specialPower), label: 'pouvoir', value: NAMING_FUNC.powerNameFunc(specialPower) },
          );
      }
     }else {
      profileDetails = [
        { icon: images.dead_player_icon, label: 'pseudo', value: user },
      ];
    }
      return (
      <ScrollView horizontal={true}>
      <ScrollView>    <View style={styles.viewBackground}>
      <Text style={GLOBAL_STYLES.gameTextLarge}>Profile </Text>
      <DisplayInfo data={profileDetails} />
      {actions()}
      {playerRole === ROLE.loupGarou && (
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
      {playerRole === ROLE.humain && (
        <>
      <Text style={GLOBAL_STYLES.gameTextLarge}>Joueur vivants:</Text>
        {alivePlayers.map(player => (
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
          ]} />
        ))}
      </View>}
    </View>
    </ScrollView>
    </ScrollView>
  );
  };


  const actions = () => {
    let specialPowerButton = null;
    switch (specialPower) {
      case SPECIAL_POWERS.voyanteHumain:
      case SPECIAL_POWERS.voyanteLoup:
        if (aliveBesidesCurrent.length > 0){
          specialPowerButton = (
            <ActionModal imageLink={images.voyance_icon} textButton = {"voyance"} players={aliveBesidesCurrent} handlePlayerClick={handleVoyance} />
          );
        } 
        break;
      case SPECIAL_POWERS.contamination:
        if (aliveHumans.length>0){
          specialPowerButton = (
            <ActionModal imageLink={images.contamination_icon} textButton = {"contamination"} players={aliveHumans} handlePlayerClick={handleContamination} />
          );
        }
        break;
      case SPECIAL_POWERS.spiritismeHumain:
      case SPECIAL_POWERS.spiritismeLoup:
        if (deadPlayers.length>0){
          specialPowerButton = (
            <ActionModal imageLink={images.spiritisme_icon} textButton = {"spiritisme"} players={deadPlayers} handlePlayerClick={handleSpiritisme} />
          );
        }
        break;  
      default:
        specialPowerButton = null;
    }

    if (playerStatus === PLAYER_STATUS.vivant){
      return (
        <View style={styles.container}>
        <Text style={GLOBAL_STYLES.gameTextLarge}>Actions</Text>
      <View style={styles.centerContainer}>
        {playerRole === ROLE.loupGarou ? 
            <ActionModal 
            textButton = {"Vote"} players={aliveHumans}
            imageLink={images.voting_icon}
            handlePlayerClick={handleVote} /> : null}
        {specialPowerButton}
        <InfoModal
          visibleParam={infoModalActif}
          visibleFunc={() => {
            setIsModalActionVisible(false)
          }}
          title={infoModalTitle}
          message={infoModalMessage}
        />
        </View>
      </View>
    )}
  else{
    return (
      <View >
      <Text style={GLOBAL_STYLES.gameTextLarge}>
        Aucune action ne peut être appliquée une fois mort
      </Text>
      </View >
    )
  }
  }

  let content;
  if (activeTab === 1) {
    content = gameinfo();
  } else if (activeTab === 2) {
    content = chats();
  } 

  useEffect(() => {
    const handlePlayerInfo = (data) => {
      setPlayerInfo(data)
      setAllChats([]);
      setAllChats(prevChats => prevChats.concat(Object.values(data.chats)));
      setGameRoom(data.roomId);
      setPlayerRole(data.playerRole);
      setSpecialPower(data.specialPowers);
      setUser(data.playerPseudo);
      setGameId(data.partieId);
      setPlayerStatus(data.playerStatut);
      const alive = [];
      const aliveBesidesCurrentTmp = [];
      const aliveHuman = []; 
      const aliveWolf = [];
      const dead = [];  
      data.playersData.forEach(player => {
        if (player.playerStatus === PLAYER_STATUS.vivant) {
          alive.push(player);
          if (player.playerName !== data.playerPseudo){
            aliveBesidesCurrentTmp.push(player);
          }
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
      const updatedAliveHumans = aliveHuman.map(player => ({
        ...player,
        votes: 0
      }));
      setAlivePlayers(alive);
      setAliveHumans(updatedAliveHumans);
      setAliveWolfs(aliveWolf);
      setAliveBesidesCurrent(aliveBesidesCurrentTmp)
      setDeadPlayers(dead);
    }; 

    socket.on('notif-vote', function(data) {
      incrementVotes(data.candidat)
    });

    socket.on('new-message', function(data) {
      setAllChats(prevChats => {
        const updatedChats = [...prevChats];
        const chatIndex = updatedChats.findIndex(chat => {
          return chat.chatroom === data.chat_room}
          );
        if (chatIndex !== -1) {
          if (!updatedChats[chatIndex].messages) {
            updatedChats[chatIndex].messages = [];
          }
          updatedChats[chatIndex].messages.push({ Sender: data.sender, messageValue: data.message });
        }
        return updatedChats;
      });
    });

    socket.on('send-Player-Data-Voyante', function(data) {
      let pouvoirtest = "";
      if (data.ciblePowers !== ROLE.pasDePouvoir){
        pouvoirtest = " et posséde le pouvoir "+ NAMING_FUNC.powerNameFunc(data.ciblePowers) 
      }else{
        pouvoirtest = " et ne posséde aucun pouvoir "
      }
      setInfoModalMessage(data.ciblePseudo+" est un " + data.cibleRole + pouvoirtest);
      setInfoModalTitle("Pouvoir Voyance");
      setIsModalActionVisible(true);
    });

    socket.on('new-custom-chat', function(data) {
      setAllChats(prevChats => prevChats.concat(Object.values(data.chats)));
    });

    socket.on("notif-vote-final", function(data) {
      setInfoModalMessage(data.message);
      setInfoModalTitle("Bilan vote");
      setIsModalActionVisible(true);
    });


    socket.on('player-info', handlePlayerInfo);

    return () => {
      socket.off('notif-vote-final', () => {});
      socket.off('player-info',  () => {});
      socket.off('notif-vote',() => {});
      socket.off('new-message',() => {});
      socket.off('new-custom-chat',() => {});
    };
  }, [socket]);

  return (
    <View style={{ flex: 1 }}>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {content}
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



