import { StyleSheet, View, Text, TextInput, Keyboard, useWindowDimensions } from "react-native";
import React, { useState } from "react";

type Props = {
    title: string;
    //post?
    onChange: (status: string) => void; 
  };
  

const FormField = ({ title, onChange}: Props ) => {
    const [value, setValue] = useState<string >();
    const [isFocus, setIsFocus] = useState(false);

     const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

    if (value){
        onChange(value);
    }
    return (
        <View style = {{justifyContent: 'center', width: '96%', }}>
            <View style = {{}}>
                <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>{title}</Text>
            </View>
            
            <View style = {{}}>
                <TextInput  style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', height: 42, paddingVertical: 'auto', color: '#B3B3B3', textAlign: 'center', marginBottom: 20, }}
                    placeholderTextColor="#111"
                    onChangeText={setValue}
                    value={value}
                />
            </View>
        </View>
    )
}

export default FormField

const styles = StyleSheet.create({
    object1: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: 123,
        height: 40,
        paddingTop: 12,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 12,
        color: '#B3B3B3',
        textAlign: 'center',
        marginBottom: 20
    },
    object2: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: 272,
        height: 40,
        paddingTop: 12,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 12,
        color: '#B3B3B3',
        textAlign: 'center',
        marginBottom: 20,
    }
})
