import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGame } from "../context/GameContext";
import { colors, styles } from "../constants/theme";
export default function ScoreBoard() {
  const { score, round } = useGame();
  return (
    <View style={[styles.card, styles.row, { padding: 18 }]}>
      <View>
        <Text style={styles.muted}>TU PUNTAJE</Text>
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.title, { color: colors.gold }]}
        >
          {score} <Text style={{ fontSize: 14 }}>pts</Text>
        </Text>
      </View>
      <View style={styles.center}>
        <Ionicons name="flag" size={23} color={colors.cyan} />
        <Text style={styles.text}>Bandera {round} de 10</Text>
      </View>
    </View>
  );
}
