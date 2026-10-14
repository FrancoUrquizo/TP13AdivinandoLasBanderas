import React, { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGame } from "../context/GameContext";
import { colors } from "../constants/theme";
export default function Celebration() {
  const { correct } = useGame();
  const [scale] = useState(() => new Animated.Value(0.7));
  useEffect(() => {
    const animation = Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.12,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [scale]);
  return (
    <View style={{ alignItems: "center" }}>
      <Animated.View
        style={{
          transform: [{ scale }],
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
      >
        {correct >= 7 && (
          <Ionicons name="sparkles" size={26} color={colors.cyan} />
        )}
        <Ionicons name="trophy" color={colors.gold} size={80} />
        {correct >= 7 && (
          <Ionicons name="sparkles" size={26} color={colors.cyan} />
        )}
      </Animated.View>
    </View>
  );
}
