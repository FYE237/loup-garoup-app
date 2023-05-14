import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";


const TAB_BAR_HEIGHT = 48;
const TAB_BAR_BORDER_RADIUS = 8;
const TAB_BAR_BOX_SIZE = 100;
const TAB_PADDING = 16;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.lightMarineBlue,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_BORDER_RADIUS,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  tabBarBox: {
    width: TAB_BAR_BOX_SIZE,
    height: TAB_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: TAB_PADDING,
  },
  activeTabBarBox: {
    opacity: 0.7,
  },
  tabBarText: {
    fontWeight: 'bold',
    color: '#444444',
    textAlign: 'center',
  },
  activeTabBarText: {
    color: '#000000',
  },
  tabBarBorder: {
    position: 'absolute',
    bottom: -TAB_BAR_BORDER_RADIUS,
    height: TAB_BAR_BORDER_RADIUS * 2,
    width: TAB_BAR_BOX_SIZE,
    borderRadius: TAB_BAR_BORDER_RADIUS,
    backgroundColor: '#666666',
  },
});

export default styles;
