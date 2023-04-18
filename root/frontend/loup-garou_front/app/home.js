import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Pseudo, Logout } from "../components";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const logoutFuntion = () => {
    console.log("i have been pressed");
  };
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Pseudo></Pseudo>
        <Logout logoutFuntion={logoutFuntion}></Logout>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
