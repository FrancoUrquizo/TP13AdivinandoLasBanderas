import React, { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import { useGame } from "../context/GameContext";
import { colors, styles } from "../constants/theme";
export default function Timer() {
  const { timer } = useGame();
  const [progress] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: timer / 15,
      duration: 200,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [timer, progress]);
  const color = timer <= 5 ? colors.red : colors.cyan;
  return (
    <View style={{ gap: 10 }}>
      <View style={styles.row}>
        <Text style={styles.muted}>TIEMPO RESTANTE</Text>
        <Text
          accessibilityLiveRegion="polite"
          style={{ color, fontSize: 22, fontWeight: "800" }}
        >
          {timer}s
        </Text>
      </View>
      <View
        style={{
          height: 8,
          backgroundColor: "#26334E",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height: 8,
            backgroundColor: color,
            borderRadius: 8,
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
      </View>
    </View>
  );
}
