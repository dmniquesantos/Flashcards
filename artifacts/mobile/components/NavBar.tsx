import React from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BookOpen, Home, Layers3, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

type Props = {
  onHome: () => void;
  onCreate: () => void;
};

export default function NavBar({ onHome, onCreate }: Props) {
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      <TouchableOpacity onPress={onHome} style={styles.btn}>
        <Home size={18} color={Colors.tabIconActive} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onHome} style={styles.btn}>
        <Layers3 size={18} color={Colors.tabIconInactive} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCreate} style={styles.btn}>
        <BookOpen size={18} color={Colors.tabIconInactive} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn}>
        <User size={18} color={Colors.tabIconInactive} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderTopWidth: 1,
    borderTopColor: Colors.tabBarBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  btn: {
    padding: 10,
  },
});
