import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import { COLORS, images, LINKS, PLAYER_STATUS, ROLE, SPECIAL_POWERS } from '../constants'
import {
  Chat, 
  ActionModal,
  TabBar,
  InfoModal
} from '../components'
import AsyncStorage from '@react-native-async-storage/async-storage'



export default function  NuitPage ({gameStatus, socket}) {
  const [playerInfo, setPlayerInfo] = useState(null);
  const [alivePlayers, setAlivePlayers] = useState([]);
  const [aliveHumans, setAliveHumans] = useState([]);
  const [aliveWolfs, setAliveWolfs] = useState([]);
  const [aliveBesidesCurrent, setAliveBesidesCurrent] = useState([]);
  
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
  
  const handleMessage = async (playerName, message) => {
    socket.emit("send-message-game", message, user, playerName, gameId);
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
          <Text>Showing chats</Text>
          {allchats.map((chat) => (
            <Chat key={chat.chatname} chat={chat} />
          ))}
        </View>
      ); 
    }
    else{
      <Text>Loading jour day data </Text>
    }
  };

  const gameinfo = () => {
      return (
    <View>
      <Text>Pseudo {user}, Role: {playerRole}, Special Power : {specialPower}</Text>
      {playerRole === ROLE.loupGarou && (
        <>
          <Text>Alive Wolfs:</Text>
          {aliveWolfs.map(player => (
            <Text key={player.playerName}>{player.playerName}</Text>
          ))}
          <Text>Alive humans:</Text>
          {aliveHumans.map(player => (
            <Text key={player.playerName}>{player.playerName}; votes : {player.votes}</Text>
          ))}
          {/* <FlatList
            data={displayWolfs}
            renderItem={({ item }) => <Text key={item.key}>{item.name}</Text>}
          /> */}
        </>
      )}
      {playerRole === ROLE.humain && (
        <>
        <Text>Alive players:</Text>
        {alivePlayers.map(player => (
          <Text key={player.playerName}>{player.playerName}</Text>
        ))}
        </>
      )}
      <Text>Dead Players:</Text>
      {deadPlayers.map(player => (
        <Text key={player.playerName}>{player.playerName}</Text>
      ))
      }
    </View>
  );
  };


  const actions = () => {
    let specialPowerButton = null;
    switch (specialPower) {
      case SPECIAL_POWERS.voyanteHumain:
      case SPECIAL_POWERS.voyanteLoup:
        specialPowerButton = (
          <ActionModal textButton = {"voyance"} players={aliveBesidesCurrent} handlePlayerClick={handleVoyance} />
        );
        break;
      case SPECIAL_POWERS.contamination:
        specialPowerButton = (
          <ActionModal textButton = {"contamination"} players={aliveHumans} handlePlayerClick={handleContamination} />
        );
        break;
      case SPECIAL_POWERS.spiritismeHumain:
      case SPECIAL_POWERS.spiritismeLoup:
        specialPowerButton = (
          <ActionModal textButton = {"spiritisme"} players={deadPlayers} handlePlayerClick={handleSpiritisme} />
        );
        break;  
      default:
        specialPowerButton = null;
    }

    if (playerStatus === PLAYER_STATUS.vivant){
      return (
        <View style={styles.container}>
        <Text>List of actions</Text>
      <View style={styles.centerContainer}>
        {playerRole === ROLE.loupGarou ? 
            <ActionModal 
            textButton = {"Vote"} players={aliveHumans}
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
      <Text>No actions can be applied when dead</Text>
      </View >
    )
  }
  }

  let content;
  if (activeTab === 1) {
    content = gameinfo();
  } else if (activeTab === 2) {
    content = chats();
  } else if (activeTab === 3){
    content = actions();
  }

  useEffect(() => {
    const handlePlayerInfo = (data) => {
      setPlayerInfo(data)
      console.log("------------------------Soir-------------------------------");
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
      const aliveBesidesCurrentTmp = [];
      const aliveHuman = [];
      const aliveWolf = [];
      const dead = [];  
      data.playersData.forEach(player => {
        // console.log(JSON.stringify(player))
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
      // console.log("alive " + JSON.stringify(alive));
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
      console.log('Received voting information:', data);
      incrementVotes(data.candidat)
    });

    socket.on('new-message', function(data) {
      console.log('Received new message:', data);
    });

    socket.on('send-Player-Data-Voyante', function(data) {
      let pouvoirtest = "";
      if (data.ciblePowers !== ROLE.pasDePouvoir){
        pouvoirtest = " et posséde le pouvoir "+data.ciblePowers
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

    socket.on('new-message', function(data) {
    });

    socket.on('player-info', handlePlayerInfo);

    return () => {
      socket.off('player-info',  () => {});
      socket.off('new-message',() => {});
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
    paddingHorizontal: 20,
    paddingTop: 50
  },
})

