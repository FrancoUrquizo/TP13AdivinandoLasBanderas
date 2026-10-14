import React, { useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGame } from "../context/GameContext";
import { colors, styles } from "../constants/theme";
import { Brand, Button, Enter, Page } from "../components/UI";
export default function HomeScreen() {
  const {
    startGame,
    currentPlayer,
    countries,
    loading,
    error,
    loadCountries,
    storageReady,
    storageError,
  } = useGame();
  const [name, setName] = useState(currentPlayer);
  const start = () => {
    if (startGame(name)) router.replace("/game");
  };
  return (
    <Page>
      <Brand />
      <Enter>
        <View style={[styles.center, { paddingVertical: 24 }]}>
          <View
            style={{
              width: 112,
              height: 112,
              borderRadius: 36,
              backgroundColor: "#142D50",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#295484",
            }}
          >
            <Ionicons name="earth-outline" size={76} color={colors.cyan} />
          </View>
          <Text style={[styles.label, { marginTop: 10 }]}>
            UN MUNDO POR DESCUBRIR
          </Text>
          <Text style={[styles.title, { fontSize: 46 }]}>
            Flag<Text style={{ color: colors.blue }}>Master</Text>
          </Text>
          <Text style={[styles.muted, { textAlign: "center", fontSize: 17 }]}>
            ¿Cuánto sabés sobre las banderas del mundo?
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Tu próxima aventura empieza acá</Text>
          <Text style={styles.muted}>
            Elegí tu nombre y conquistá el ranking.
          </Text>
          <TextInput
            accessibilityLabel="Nombre del jugador"
            style={styles.input}
            value={name}
            onChangeText={setName}
            maxLength={24}
            placeholder="Tu nombre"
            placeholderTextColor={colors.muted}
            autoCapitalize="words"
            returnKeyType="go"
            onSubmitEditing={start}
          />
          {loading && <ActivityIndicator color={colors.cyan} />}
          {error ? (
            <>
              <Text style={{ color: "#FCA5A5" }}>{error}</Text>
              <Button
                title="Reintentar conexión"
                secondary
                icon="refresh"
                onPress={() => loadCountries()}
              />
            </>
          ) : null}
          <Button
            title="Empezar a jugar"
            onPress={start}
            disabled={
              !name.trim() ||
              loading ||
              !!error ||
              !countries.length ||
              !storageReady
            }
          />
          <Button
            title="Ver ranking"
            secondary
            icon="trophy-outline"
            onPress={() => router.push("/ranking")}
          />
        </View>
        <View style={[styles.card, { backgroundColor: "#111B30" }]}>
          <Text style={styles.label}>CÓMO SE JUEGA</Text>
          {[
            [
              "flag-outline",
              "10 banderas",
              "Una vuelta al mundo en cada partida.",
            ],
            [
              "timer-outline",
              "15 segundos",
              "Acertá: +10 puntos y el tiempo restante.",
            ],
            [
              "bulb-outline",
              "Una ayuda extra",
              "Una letra por −2s. Cada error resta 1 punto.",
            ],
          ].map(([icon, title, description]) => (
            <View key={title} style={{ flexDirection: "row", gap: 14 }}>
              <Ionicons name={icon} color={colors.cyan} size={23} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.text, { fontWeight: "700" }]}>
                  {title}
                </Text>
                <Text style={styles.muted}>{description}</Text>
              </View>
            </View>
          ))}
        </View>
        {storageError ? (
          <Text style={{ color: colors.gold }}>{storageError}</Text>
        ) : null}
        <Text style={[styles.muted, { textAlign: "center", fontSize: 12 }]}>
          Aprendé. Descubrí. Superate. 🌎
        </Text>
      </Enter>
    </Page>
  );
}
