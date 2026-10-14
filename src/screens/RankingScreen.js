import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGame } from "../context/GameContext";
import { colors, styles } from "../constants/theme";
import { Brand, Button, Enter, Page } from "../components/UI";
import Leaderboard from "../components/Leaderboard";
export default function RankingScreen() {
  const { goHome, storageReady, storageError } = useGame();
  return (
    <Page>
      <Brand />
      <Enter>
        <View style={[styles.center, { paddingVertical: 20 }]}>
          <Ionicons name="podium" size={64} color={colors.gold} />
          <Text style={styles.label}>LOS MEJORES EXPLORADORES</Text>
          <Text style={styles.title}>Ranking mundial</Text>
          <Text style={[styles.muted, { textAlign: "center" }]}>
            Tu mejor partida cuenta. Superá tu marca. Ranking local de este
            dispositivo.
          </Text>
        </View>
        {storageReady ? (
          <Leaderboard />
        ) : (
          <ActivityIndicator color={colors.cyan} />
        )}
        {storageError ? (
          <Text style={{ color: colors.gold }}>{storageError}</Text>
        ) : null}
        <Button
          title="Volver al inicio"
          secondary
          icon="home-outline"
          onPress={() => {
            goHome();
            router.replace("/");
          }}
        />
      </Enter>
    </Page>
  );
}
