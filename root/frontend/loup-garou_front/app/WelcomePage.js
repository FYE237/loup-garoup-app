import React, { useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { View, Text, SafeAreaView,ImageBackground,StyleSheet, TouchableOpacity } from 'react-native'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import { COLORS, FONT, images } from '../constants'
import { ScreenHeader } from '../components'
const WelcomePage = () => {
  const [activeTab, setActiveTab] = useState('login')
  const router = useRouter()

  const renderContent = () => {
    switch (activeTab) {
      case 'login':
        return <LoginPage />
      case 'register':
        return <RegisterPage />
      default:
        return <LoginPage />
    }
  }

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
              router.replace('/WelcomePage');
            }}
          />
        ),
        headerTitle: 'Lunar'
      }}
    />
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'login' ? styles.activeTab : null]}
          onPress={() => setActiveTab('login')}
        >
          <Text style={styles.tabText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="registerTab"
          style={[
            styles.tab,
            activeTab === 'register' ? styles.activeTab : null
          ]}
          onPress={() => setActiveTab('register')}
        >
          <Text style={styles.tabText}>Register</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : COLORS.backgroundGray
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightRed
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center'
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.tertiary
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT.ItalicFont,
    fontWeight: 'bold'
  }
})

export default WelcomePage
