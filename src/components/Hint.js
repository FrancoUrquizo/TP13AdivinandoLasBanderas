import React from "react";
import { Text, View } from "react-native";
import { useGame } from "../context/GameContext";
import { colors, styles } from "../constants/theme";
import { Button, Enter } from "./UI";
export default function Hint() {
  const { currentCountry, hints, requestHint, timer, status } = useGame();
  const letters = Array.from(currentCountry.name);
  const complete = letters.every(
    (letter, index) => !/\p{L}/u.test(letter) || hints.includes(index),
  );
  return (
    <View style={{ gap: 15 }}>
      <Button
        secondary
        title="Pedir pista · −2 segundos"
        icon="bulb-outline"
        onPress={requestHint}
        disabled={status !== "playing" || timer <= 2 || complete}
      />
      <Enter key={hints.length}>
        <Text
          accessibilityLabel="Letras reveladas"
          style={{
            textAlign: "center",
            color: colors.cyan,
            fontSize: 20,
            lineHeight: 32,
            letterSpacing: 3,
          }}
        >
          {letters
            .map((letter, index) =>
              /\p{L}/u.test(letter) && !hints.includes(index)
                ? "_"
                : letter.toUpperCase(),
            )
            .join(" ")}
        </Text>
      </Enter>
      <Text style={[styles.muted, { textAlign: "center", fontSize: 12 }]}>
        Cada pista revela una letra en su posición original.
      </Text>
    </View>
  );
}
