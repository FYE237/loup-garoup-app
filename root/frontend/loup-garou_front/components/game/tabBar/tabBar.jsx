

import { TouchableOpacity, Text, View } from 'react-native'


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


export default TabBar;