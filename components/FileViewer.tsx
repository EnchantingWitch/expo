import { StyleSheet, Text } from 'react-native';
import { Image, type ImageSource } from "expo-image";

type Props = {
  selectedImage?: any;
};

export default function FileViewer({ selectedImage }: Props) {
 const imageSource = selectedImage ? "Файл выбран": "Файл не выбран";

  return <Text style={{fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center', }}>{imageSource}</Text> ;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 340,
    borderRadius: 18,
  },
});