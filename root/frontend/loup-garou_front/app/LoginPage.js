import React, { useState } from 'react'
import { View, TextInput, Text, StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {CallToActionBtn} from '../components'
import { Stack, useRouter } from 'expo-router'
import {LINKS} from "../constants"
import { io } from "socket.io-client";

const LoginPage = () => {
  const router = useRouter()
  const [pseudo, setPseudo] = useState('')
  const [password, setPassword] = useState('')
  const [data, setData] = useState({});

  const handleLogin = async () => {
    let data = {
      name: pseudo,
      password: password
    }

    try {
      const response = await fetch(
        LINKS.backend + '/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `data=${JSON.stringify(data)}`
        }
      )

      if (response.status === 200) {
        const data = await response.json()
        const token = data.token
        await AsyncStorage.setItem('userToken', token)
        router.replace("/home")
        Alert.alert('Success', 'User logged in successfully.')
      } else {
        Alert.alert('Error', 'Failed to log in user')
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while logging in the user.')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pseudo</Text>
      <TextInput
        style={styles.input}
        value={pseudo}
        onChangeText={setPseudo}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <CallToActionBtn title="Login" testID="loginbutton" onPress={handleLogin} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#B2B2B2',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 18,
    marginBottom: 15
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 15
  }
})

export default LoginPage
