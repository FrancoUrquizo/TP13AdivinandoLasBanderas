import React from "react";
import { Alert, Platform, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { useGame } from "../context/GameContext";
import { styles } from "../constants/theme";
import { Brand, Button, Page } from "../components/UI";
import Flag from "../components/Flag";
import Timer from "../components/Timer";
import ScoreBoard from "../components/ScoreBoard";
import GuessForm from "../components/GuessForm";
import Hint from "../components/Hint";
export default function GameScreen() {
  const { status, currentPlayer, currentCountry, round, finishGame } =
    useGame();
  if (status === "finished") return <Redirect href="/results" />;
  if (status === "idle" || !currentCountry) return <Redirect href="/" />;
  const finish = () => {
    const action = () => {
      finishGame();
      router.replace("/results");
    };
    if (Platform.OS === "web") {
      action();
      return;
    }
    Alert.alert("¿Finalizar partida?", "Se guardará el puntaje actual.", [
      { text: "Seguir jugando", style: "cancel" },
      { text: "Finalizar", onPress: action },
    ]);
  };
  return (
    <Page>
      <Brand />
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>EXPLORADOR</Text>
          <Text style={styles.heading}>{currentPlayer}</Text>
        </View>
        <Text style={styles.muted}>Desafío mundial</Text>
      </View>
      <ScoreBoard />
      <Timer />
      <Flag key={`flag-${round}`} />
      <GuessForm key={`form-${round}`} />
      <Hint />
      <Button
        title="Finalizar partida"
        secondary
        icon="exit-outline"
        onPress={finish}
      />
    </Page>
  );
}
