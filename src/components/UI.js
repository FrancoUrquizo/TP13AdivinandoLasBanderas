import React, { useEffect, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, styles } from "../constants/theme";

export function Page({ children }) {
  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  icon = "arrow-forward",
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: secondary ? "#202E49" : colors.blue,
        borderRadius: 16,
        minHeight: 55,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
      })}
    >
      <Ionicons name={icon} size={20} color={colors.text} />
      <Text style={{ color: colors.text, fontWeight: "700", fontSize: 15 }}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Enter({ children }) {
  const [value] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.timing(value, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [value]);
  return (
    <Animated.View
      style={{
        opacity: value,
        transform: [
          {
            translateY: value.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 0],
            }),
          },
        ],
        gap: 20,
      }}
    >
      {children}
    </Animated.View>
  );
}
export function Brand() {
  return (
    <View style={styles.row}>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Ionicons name="earth" size={24} color={colors.cyan} />
        <Text style={{ color: colors.text, fontWeight: "800", fontSize: 18 }}>
          FlagMaster
        </Text>
      </View>
      <Text style={styles.label}>WORLD QUIZ</Text>
    </View>
  );
}
