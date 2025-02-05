import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, Text, TextInput, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link, router, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { parse } from 'date-fns';

type Props = {
    theme?: 'min';
    post?: string; //дата, которую получаем из бд - передача для вывода в текстинпут
};

const DateInputWithPicker = ({ theme, post }: Props) => {
    const router = useRouter();
    //const {post} = useLocalSearchParams();

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    if (post) {
        const customFormat = 'dd.MM.yyyy';
        const dateFnsDate = parse(post, customFormat, new Date());
        setDate(dateFnsDate);
    }

    const fontScale = useWindowDimensions().fontScale;

    const ts = (fontSize: number) => {
        return (fontSize / fontScale)
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(false);
        setDate(currentDate);
        router.setParams({ date: currentDate });
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

    if (theme === 'min') {
        return (
            <View style={styles.containerrowMin}>

                <TextInput style={[styles.inputMin, { fontSize: ts(14), textAlignVertical: 'center' }]}
                    placeholderTextColor="#111"
                    value={formatDate(date)}
                />


                <TouchableOpacity style={{ width: '24%', height: '100%', alignSelf: 'flex-end', borderRadius: 4 }} onPress={showDatePicker}>
                    <Image style={{ width: 50, height: 50 }}
                        source={require('../assets/images/calendar1.png')} />
                    {showPicker && (
                        <DateTimePicker style={{}}
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
            <TextInput style={[styles.input, { fontSize: ts(14) }]}
                placeholderTextColor="#111"
                value={formatDate(date)}
            />


            <TouchableOpacity style={{ width: '24%', height: '100%', alignSelf: 'flex-end', borderRadius: 4 }} onPress={showDatePicker}>
                <Image style={{ width: 70, height: 40 }}
                    source={require('../assets/images/calendar1.png')} />
                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}
            </TouchableOpacity>

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //paddingTop: 11,
        //paddingBottom: 12,
        backgroundColor: '#fff',
        width: '20%',

    },
    containerrow: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 11,
        paddingBottom: 12,
        backgroundColor: '#fff',
        width: '96%',
        flexDirection: 'row',
        marginBottom: 8,
    },
    containerrowMin: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 11,
        paddingBottom: 12,
        backgroundColor: '#fff',
        width: '0%',
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
        width: '50%',
        height: 42,
        color: '#B3B3B3',
        textAlign: 'center',
    },
    inputMin: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: '66%',
        height: 42,
        color: '#B3B3B3',
        textAlign: 'center',
    },
});

export default DateInputWithPicker;