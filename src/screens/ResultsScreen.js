import React from "react";
import { Text, View } from "react-native";
import Celebration from "../components/Celebration";
import { Redirect, router } from "expo-router";
import { useGame } from "../context/GameContext";
import { colors, styles } from "../constants/theme";
import { Brand, Button, Enter, Page } from "../components/UI";
export default function ResultsScreen() {
  const {
    status,
    currentPlayer,
    score,
    correct,
    incorrect,
    timeouts,
    accuracy,
    personalBest,
    restartGame,
    goHome,
    storageError,
  } = useGame();
  if (status !== "finished") return <Redirect href="/" />;
  return (
    <Page>
      <Brand />
      <Enter>
        <View style={[styles.center, { paddingVertical: 20 }]}>
          <Celebration />
          <Text style={styles.label}>AVENTURA COMPLETADA</Text>
          <Text style={styles.title}>¡Bien jugado, {currentPlayer}!</Text>
          <Text style={styles.muted}>
            {correct >= 7
              ? "¡Tu conocimiento del mundo merece una celebración!"
              : "Cada bandera es una oportunidad para aprender."}
          </Text>
        </View>
        <View style={[styles.card, styles.center]}>
          <Text style={styles.label}>PUNTAJE FINAL</Text>
          <Text style={{ color: colors.gold, fontSize: 70, fontWeight: "800" }}>
            {score}
          </Text>
          <Text style={styles.muted}>
            Tu mejor marca: {personalBest} puntos
          </Text>
        </View>
        <View style={styles.card}>
          {[
            ["✓ Aciertos", correct, colors.green],
            ["✕ Intentos incorrectos", incorrect, colors.red],
            ["◷ Sin tiempo", timeouts, colors.text],
            ["Precisión de respuestas", `${accuracy}%`, colors.cyan],
          ].map(([label, value, color]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.text}>{label}</Text>
              <Text style={[styles.heading, { color }]}>{value}</Text>
            </View>
          ))}
          <Text style={styles.muted}>
            Precisión = aciertos / total de respuestas enviadas.
          </Text>
        </View>
        {storageError ? (
          <Text style={{ color: colors.gold }}>{storageError}</Text>
        ) : null}
        <Button
          title="Jugar nuevamente"
          icon="refresh"
          onPress={() => {
            if (restartGame()) router.replace("/game");
          }}
        />
        <Button
          title="Ver ranking"
          secondary
          icon="trophy-outline"
          onPress={() => router.push("/ranking")}
        />
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
