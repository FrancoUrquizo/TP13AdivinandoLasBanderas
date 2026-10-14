import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGame } from "../context/GameContext";
import { normalizeCountry } from "../utils/normalizeCountry";
import { colors, styles } from "../constants/theme";
export default function Leaderboard() {
  const { ranking, currentPlayer } = useGame();
  if (!ranking.length)
    return (
      <View style={[styles.card, styles.center]}>
        <Ionicons name="podium-outline" size={52} color={colors.gold} />
        <Text style={styles.heading}>El podio te espera</Text>
        <Text style={styles.muted}>
          Completá tu primera partida para entrar al ranking.
        </Text>
      </View>
    );
  return (
    <View style={{ gap: 10 }}>
      {ranking.map((player, index) => {
        const selected =
          normalizeCountry(player.name) === normalizeCountry(currentPlayer);
        return (
          <View
            key={normalizeCountry(player.name)}
            style={[
              styles.card,
              styles.row,
              { padding: 18, borderColor: selected ? colors.blue : "#26334E" },
            ]}
          >
            <View style={{ width: 34, alignItems: "center" }}>
              {index < 3 ? (
                <Ionicons
                  name="medal"
                  size={30}
                  color={[colors.gold, "#CBD5E1", "#CD9365"][index]}
                />
              ) : (
                <Text style={styles.muted}>#{index + 1}</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.text, { fontWeight: "700" }]}>
                {player.name}
                {selected ? " · Vos" : ""}
              </Text>
              <Text style={styles.muted}>{player.games || 1} partidas</Text>
            </View>
            <Text
              style={{ color: colors.gold, fontSize: 22, fontWeight: "800" }}
            >
              {player.bestScore}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
