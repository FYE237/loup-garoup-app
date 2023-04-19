import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Alert } from "react-native";
import CallToActionBtn from "../components/common/CallToActionBtn";
import {LINKS} from "../constants"
import { Stack, useRouter } from 'expo-router'

const RegisterPage = () => {
  const router = useRouter()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      let data = {
        name: name,
        email: email,
        password: password,
      };
      console.log(LINKS.backend+'/api/users')

      const response = await fetch(
        LINKS.backend+'/api/users',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `data=${JSON.stringify(data)}`,
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "You have been registered");
        router.replace("/WelcomePage")
      } else {
        Alert.alert("Error", "Failed to register");
      }
    } catch (error) {
      Alert.alert("Error", "An error occured");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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

      <CallToActionBtn onPress={handleRegister} title="Register" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#B2B2B2",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    marginBottom: 15,
  },
});

export default RegisterPage;
