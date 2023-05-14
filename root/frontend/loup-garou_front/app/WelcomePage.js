import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import { COLORS, FONT } from '../constants'

const WelcomePage = () => {
  const [activeTab, setActiveTab] = useState('login')

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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.greenApple
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
