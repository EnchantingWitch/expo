import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, useWindowDimensions } from "react-native";
import React from "react";
import { Style } from "tailwind-rn";

type Props = {
  title: string;
  handlePress?: () => void;
};

export default function CustomButton({ title, handlePress}: Props) {
const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};
  return (
    <TouchableOpacity style={{ borderRadius: 8, backgroundColor: '#0072C8', width: 272, height: 40, alignSelf: 'center', justifyContent: 'center', marginBottom: 8}}
      onPress={handlePress}>
        
      <Text style={{ fontSize: ts(14), fontWeight: '400', color: '#F5F5F5', textAlign: 'center', }}>{title}</Text>

    </TouchableOpacity >
  );
}

