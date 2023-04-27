import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
import { COLORS, images, LINKS } from '../constants'
import {
  Chat
} from '../components'


const TabBar = ({ activeTab, setActiveTab }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <TouchableOpacity onPress={() => setActiveTab(1)}>
        <Text style={{ color: activeTab === 1 ? 'red' : 'black' }}>game info </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveTab(2)}>
        <Text style={{ color: activeTab === 2 ? 'red' : 'black' }}>chats </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveTab(3)}>
        <Text style={{ color: activeTab === 3 ? 'red' : 'black' }}>actions</Text>
      </TouchableOpacity>
    </View>
  );
};


export default function  JourPage ({gameStatus, socket}) {
  const [playerInfo, setPlayerInfo] = useState(null);
  const [alivePlayers, setAlivePlayers] = useState([]);
  const [deadPlayers, setDeadPlayers] = useState([]);
  const [gameRoom, setGameRoom] = useState("");
  const [allchats, setAllChats] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

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
      <Text>Alive Players:</Text>
      {alivePlayers.map(player => (
        <Text key={player.playerName}>{player.playerName}</Text>
      ))}

      <Text>Dead Players:</Text>
      {deadPlayers.map(player => (
        <Text key={player.playerName}>{player.playerName}</Text>
      ))}
    </View>
  );
  };


  const actions = () => {
    return (
      <View>
        <Text>Showing game info</Text>
      </View>
    )}


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
      console.log(data.playersData);
      setAllChats(prevChats => prevChats.concat(Object.values(data.chats)));
      setGameRoom(data.roomId);
      const alive = [];
      const dead = [];  
      data.playersData.forEach(player => {
        if (player.playerStatus === 'vivant') {
          alive.push(player);
        } else if (player.playerStatus === 'mort') {
          dead.push(player);
        }
      });
      setAlivePlayers(alive);
      setDeadPlayers(dead);

    }; 

    socket.on('new-message', function(data) {
      console.log('Received new message:', data);
    });

    socket.on('player-info', handlePlayerInfo);

    return () => {
      socket.off('player-info',  () => {});
      socket.off('new-message',() => {});
    };
  }, [socket]);

  return (
    <View style={{ flex: 1 }}>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {content}
    </View>
  );

};

