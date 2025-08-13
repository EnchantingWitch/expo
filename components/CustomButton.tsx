import React from "react";
import { Text, TouchableOpacity, useWindowDimensions } from "react-native";
//import { Style } from "tailwind-rn";

type Props = {
  title: string;
  disabled?: boolean;
  handlePress?: () => void;
};

export default function CustomButton({ title, disabled, handlePress}: Props) {
const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};
  return (
    <TouchableOpacity disabled={disabled} style={{ borderRadius: 8, backgroundColor: '#0072C8', width: 272, height: 40, alignSelf: 'center', justifyContent: 'center', marginBottom: 8}}
      onPress={handlePress}>
        
      <Text style={{
        //fontFamily: 'ArialNarrow', 
        fontSize: ts(14), fontWeight: '400', color: '#F5F5F5', textAlign: 'center', }}>{title}</Text>

    </TouchableOpacity >
  );
}

