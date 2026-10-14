import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Image } from "expo-image";
import { useGame } from "../context/GameContext";
import { colors, styles } from "../constants/theme";
import { Button, Enter } from "./UI";
export default function Flag() {
  const { currentCountry, status } = useGame();
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  return (
    <Enter>
      <View
        style={[
          styles.card,
          {
            backgroundColor: "#F0F4FC",
            minHeight: 210,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        {loading && !failed && (
          <ActivityIndicator
            color={colors.blue}
            style={{ position: "absolute" }}
          />
        )}
        {!failed && (
          <Image
            key={attempt}
            source={{ uri: currentCountry.flag }}
            style={{ width: "100%", height: 165 }}
            contentFit="contain"
            transition={250}
            accessibilityLabel={
              status === "feedback"
                ? currentCountry.name
                : "Bandera del país a adivinar"
            }
            onLoad={() => setLoading(false)}
            onError={() => {
              setFailed(true);
              setLoading(false);
            }}
          />
        )}
        {failed && (
          <>
            <Text style={{ color: colors.bg, textAlign: "center" }}>
              No se pudo cargar la bandera.
            </Text>
            <Button
              title="Reintentar imagen"
              onPress={() => {
                setFailed(false);
                setLoading(true);
                setAttempt(attempt + 1);
              }}
            />
          </>
        )}
      </View>
    </Enter>
  );
}
