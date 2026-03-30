import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

type Props = {
  title: string;
  subtitle: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function TopGradient({ title, subtitle, leftIcon, rightIcon }: Props) {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientMid, Colors.primaryGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { paddingTop: topPadding + 12 }]}
    >
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.row}>
        {leftIcon ?? <View style={styles.placeholder} />}
        {rightIcon ?? <View style={styles.avatar} />}
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: 170,
    paddingHorizontal: 20,
    paddingBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  circle1: {
    position: "absolute",
    right: -32,
    top: 48,
    height: 144,
    width: 96,
    borderRadius: 72,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  circle2: {
    position: "absolute",
    left: 56,
    bottom: -32,
    height: 96,
    width: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeholder: {
    width: 22,
    height: 22,
  },
  avatar: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  textBlock: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 11,
    color: "rgba(255,255,255,0.70)",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.5,
    marginTop: 2,
  },
});
