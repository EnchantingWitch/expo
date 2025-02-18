import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '@/components/CustomButton';

type Props = {
    theme?: 'min';
  };

const DateInputWithPicker = ({theme }: Props) => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(false);
        setDate(currentDate);
    };

    const showDatePicker = () => {
        setShowPicker(true);
    };

    const formatDate = (date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const yyyy = date.getFullYear();
        return `${dd}.${mm}.${yyyy}`;
    };
    if (theme === 'min'){ return(
        <View style={styles.containerrowMin}>
            <TextInput style={styles.inputMin}
                        //placeholder="Исполнитель"
                placeholderTextColor="#111"
                value={formatDate(date)}
            />
      
            
            <TouchableOpacity style={{width: '24%', height: '100%', backgroundColor: '#0072C8', alignSelf: 'flex-end', borderRadius: 4 }} onPress={showDatePicker}>
            <Image src={'./assets/images/building-2'} style={{alignSelf: 'flex-end'}}/> 
            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}
            </TouchableOpacity>
      
        </View>
    );
    }
    return (
        <View style={styles.containerrow}>
            <TextInput style={styles.input}
                        //placeholder="Исполнитель"
                placeholderTextColor="#111"
                value={formatDate(date)}
            />
      
            
            <TouchableOpacity style={{width: '12%', height: '100%', backgroundColor: '#0072C8', alignSelf: 'flex-end', borderRadius: 4 }} onPress={showDatePicker}>
            <Image src={'./assets/images/building-2'} style={{alignSelf: 'flex-end'}}/> 
            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}
            </TouchableOpacity>
      
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        //paddingTop: 11,
        //paddingBottom: 12,
        backgroundColor: '#fff',
        width:'20%',
        
    },
    containerrow: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 11,
        paddingBottom: 12,
        backgroundColor: '#fff',
        width:'96%',
        flexDirection: 'row',
        marginBottom: 8,
    },
    containerrowMin: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 11,
        paddingBottom: 12,
        backgroundColor: '#fff',
        width:'50%',
        flexDirection: 'row',
        marginBottom: 8,
    },
    resultText: {
        fontSize: 14,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: '85%',
        height: 40,
        color: '#B3B3B3',
        textAlign: 'center',
      },
      inputMin: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: '50%',
        height: 40,
        color: '#B3B3B3',
        textAlign: 'center',
      },
});

export default DateInputWithPicker;