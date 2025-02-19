import { StyleSheet, View, Text, TextInput, Keyboard } from "react-native";
import React from "react";
import DropdownComponent1 from '@/components/list_system';
import DateInputWithPicker from '@/components/calendar';

type Props = {

    title: string;
    value: any;
    placeholder?: string;
    keyboardtype: string;
    editable: string;
    numberOfLines: number;
    theme?: 'min';
    handleChangeText?: () => void;
  };
  

const FormField = ({ title, value, placeholder,
    handleChangeText, keyboardtype, editable, numberOfLines, theme}: Props ) => {
    if (theme === 'min') return (
        <View>
            <View>
                <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>{title}</Text>
            </View>
            
            <View>
                <TextInput  style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 123, height: 40, paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#111"
                    onChangeText={handleChangeText}    
                />
                
            </View>
        </View>
    )
    if (theme === 'dropdown') return (
        <View>
            <View>
                <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>{title}</Text>
            </View>
            <DropdownComponent1 />  
        </View>
    )
    if (theme === 'date') return (
        <View>
            <View>
                <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>{title}</Text>
            </View>
            
           
        </View> 
    )
    return (
        <View>
            <View>
                <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>{title}</Text>
            </View>
            
            <View>
                <TextInput  style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 42, paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#111"
                    onChangeText={handleChangeText}
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
