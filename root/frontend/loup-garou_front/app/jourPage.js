import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import io from 'socket.io-client';
import { COLORS, images, LINKS, SPECIAL_POWERS,PLAYER_STATUS, ROLE } from '../constants'
import {
  ActionModal,
  TabBar,
  DisplayInfo,
  ChatTabs,
  InfoModal
} from '../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NAMING_FUNC, IMAGE_FUNC } from '../helperFunctions';
import { GLOBAL_STYLES } from '../styles';

export default function  JourPage ({gameStatus, socket}) {
  const [playerInfo, setPlayerInfo] = useState(null);
  const [alivePlayers, setAlivePlayers] = useState([]);
  const [deadPlayers, setDeadPlayers] = useState([]);
  const [gameRoom, setGameRoom] = useState("");
  const [allchats, setAllChats] = useState([]);
  const [playerRole, setPlayerRole] = useState([]);
  const [specialPower, setSpecialPower] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [user, setUser] = useState('');
  const [playerStatus, setPlayerStatus] = useState("");
  const [gameId, setGameId] = useState('');  
  const [activeChatTab, setChatActiveTab] = useState(0);

  //Modals that displays inforamtion
  const [infoModalActif, setIsModalActionVisible] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState("");
  const [infoModalTitle, setInfoModalTitle] = useState("");



  const handleVote = async (playerName) => {
    socket.emit("vote-jour", 
        user,
        playerName,
        gameId
        )
  };

  const handleMessage = async (message) => {
    socket.emit("send-message-game", message, allchats[activeChatTab].chatroom, user, gameId);
  };

  const incrementVotes = (playerName) => {
    setAlivePlayers(prevPlayersData => prevPlayersData.map(player => {
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
    <ScrollView>
    <View style={styles.viewBackground}>
      <Text style={GLOBAL_STYLES.gameTextLarge}>Profile </Text>
      <DisplayInfo data={profileDetails} />
      {actions()}
      <Text style={GLOBAL_STYLES.gameTextLarge}>Joueur vivants:</Text>
      {alivePlayers.map(player => (
        <DisplayInfo data={[
          { icon: images.villager_icon, label: 'pseudo', value: player.playerName },
          { icon: images.voting_icon, label: 'votes', value: player.votes },
        ]} />
      ))}
    {deadPlayers.length > 0 &&
      <View>
        <Text style={GLOBAL_STYLES.gameTextLarge}>Joueur morts:</Text>
        {deadPlayers.map(player => (
          <DisplayInfo data={[
            { icon: images.dead_player_icon, label: 'pseudo', value: player.playerName },
          ]} />
        ))}
      </View>}
      <InfoModal
          visibleParam={infoModalActif}
          visibleFunc={() => {
            setIsModalActionVisible(false)
          }}
          title={infoModalTitle}
          message={infoModalMessage}
        />
    </View>
    </ScrollView>
    </ScrollView>
  );
  };


  const actions = () => {
  if (playerStatus === PLAYER_STATUS.vivant){
      return (
        <View >
      <Text style={GLOBAL_STYLES.gameTextLarge}>Actions</Text>
      <ActionModal imageLink={images.voting_icon} textButton = {"Vote"} players={alivePlayers} handlePlayerClick={handleVote} />
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
      setAllChats(prevChats => prevChats.concat(Object.values(data.chats)));
      setGameRoom(data.roomId);
      setPlayerRole(data.playerRole);
      setSpecialPower(data.specialPowers);
      setUser(data.playerPseudo);
      setGameId(data.partieId);
      setPlayerStatus(data.playerStatut);
      const alive = [];
      const dead = [];  
      data.playersData.forEach(player => {
        if (player.playerStatus === PLAYER_STATUS.vivant) {
          alive.push(player);
        } else if (player.playerStatus === PLAYER_STATUS.mort) {
          dead.push(player);
        }
      });
      const updatedAlivePlayers = alive.map(player => ({
        ...player,
        votes: 0
      }));
      setAlivePlayers(updatedAlivePlayers);
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

    socket.on("notif-vote-final", function(data) {
      setInfoModalMessage(data.message);
      setInfoModalTitle("Bilan vote");
      setIsModalActionVisible(true);
    });

    socket.on('player-info', handlePlayerInfo);

    return () => {
      socket.off('notif-vote-final', () => {});
      socket.off('player-info',  () => {});
      socket.off('new-message',() => {});
      socket.off('notif-vote',() => {});
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
  viewBackground: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: COLORS.lightMarineBlue,
  },
})
