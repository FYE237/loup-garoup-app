import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Button } from 'react-native';
import io from 'socket.io-client';
import { COLORS, images, LINKS, PLAYER_STATUS, ROLE } from '../constants'
import {
  Chat, 
  ActionModal,
  TabBar
} from '../components'
import AsyncStorage from '@react-native-async-storage/async-storage'



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

  const handleVote = async (playerName) => {
    socket.emit("vote-jour", 
        user,
        playerName,
        gameId
        )
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
      <Text>Alive Players:</Text>
      {alivePlayers.map(player => (
        <Text key={player.playerName}>{player.playerName}; votes : {player.votes}</Text>
      ))}
      <Text>Dead Players:</Text>
      {deadPlayers.map(player => (
        <Text key={player.playerName}>{player.playerName}</Text>
      ))}
    </View>
  );
  };


  const actions = () => {
  if (playerStatus === PLAYER_STATUS.vivant){
      return (
        <View >
      <Text>List of actions</Text>
      <ActionModal textButton = {"Vote"} players={alivePlayers} handlePlayerClick={handleVote} />
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
      console.log("player info " + JSON.stringify(data));
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
      console.log("alive jour " + alive);
      const updatedAlivePlayers = alive.map(player => ({
        ...player,
        votes: 0
      }));
      setAlivePlayers(updatedAlivePlayers);
      setDeadPlayers(dead);
    }; 

    socket.on('notif-vote', function(data) {
      console.log('Received voting information:', data);
      incrementVotes(data.candidat)
    });

    socket.on('new-message', function(data) {
      console.log('Received new message:', data);
    });

    socket.on('player-info', handlePlayerInfo);

    return () => {
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

