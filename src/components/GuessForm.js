import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useGame } from "../context/GameContext";
import { colors, styles } from "../constants/theme";
import { Button, Enter } from "./UI";
export default function GuessForm() {
  const { guess, status, feedback } = useGame();
  const [answer, setAnswer] = useState("");
  const submit = () => {
    if (guess(answer)) setAnswer("");
  };
  return (
    <View style={{ gap: 14 }}>
      <Text style={[styles.heading, { textAlign: "center" }]}>
        ¿De qué país es esta bandera?
      </Text>
      <Text style={[styles.muted, { textAlign: "center" }]}>
        Usá el nombre en inglés, como en la API.
      </Text>
      <TextInput
        accessibilityLabel="Tu respuesta"
        style={styles.input}
        placeholder="Escribí el país…"
        placeholderTextColor={colors.muted}
        value={answer}
        onChangeText={setAnswer}
        autoCorrect={false}
        autoCapitalize="words"
        editable={status === "playing"}
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <Button
        title="Confirmar respuesta"
        icon="checkmark-circle-outline"
        disabled={status !== "playing" || !answer.trim()}
        onPress={submit}
      />
      {feedback && (
        <Enter key={feedback.text}>
          <View
            accessibilityLiveRegion="polite"
            style={{
              borderRadius: 14,
              padding: 14,
              backgroundColor:
                feedback.type === "success" ? "#113929" : "#3A202B",
            }}
          >
            <Text
              style={{
                color:
                  feedback.type === "success"
                    ? colors.green
                    : feedback.type === "error"
                      ? "#FCA5A5"
                      : colors.gold,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              {feedback.text}
            </Text>
          </View>
        </Enter>
      )}
    </View>
  );
}
