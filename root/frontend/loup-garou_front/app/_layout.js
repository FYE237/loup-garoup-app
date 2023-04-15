import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export const unstable_settings = {
  initialRouteName: "/home",
};


const Layout = () => {
  const [fonts] = useFonts({
    ItalicFont: require("../assets/fonts/italicFont.ttf"),
  });

  if (!fonts) {
    return null;
  }

  return (
    <Stack initialRouteName="home">
      <Stack.Screen name="home" />
    </Stack>
  )
};

export default Layout;







