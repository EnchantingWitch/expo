import React, { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'ТО', value: '1' },
    { label: 'ЭО', value: '2' },
    { label: 'АСУ', value: '3' },
    { label: 'ПБ', value: '4' },
    { label: 'ОВиК', value: '5' },
    { label: 'ТЭО', value: '6' },
    { label: 'ВК', value: '7' },
    { label: 'ЭХЗ', value: '8' },
    { label: 'МО', value: '9' },
    { label: 'КИТСО', value: '10' },
    { label: 'ПТО', value: '11' }, 
    { label: 'МОО', value: '12' },
    { label: 'ХиКУ', value: '13' },
    { label: 'ГТМ', value: '14' },
    { label: 'ПЭМ', value: '15' },
    { label: 'ИБ', value: '16' },
    { label: 'КЗ', value: '17' },
];

type Props = {
    post?: string;
    onChange: (system: string) => void; // Функция для обновления системы
};

const ListOfSystem = ({post, onChange }: Props) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

     const fontScale = useWindowDimensions().fontScale;

    const ts = (fontSize: number) => {
        return (fontSize / fontScale)};
    
    if (value){
        onChange(value);
    }
        
    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={[styles.placeholderStyle, { fontSize: ts(14)}]}
                selectedTextStyle={[styles.selectedTextStyle, { fontSize: ts(14)} ]}
                inputSearchStyle={[styles.inputSearchStyle, { fontSize: ts(14)}]}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                itemTextStyle={{fontSize: ts(14)}}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Система' : 'Не выбрано'}
                searchPlaceholder="Поиск"
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                }}
            />
        </View>
    );
};

export default ListOfSystem;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingBottom: 16,
        width: '96%',
    },
    dropdown: {
        height: 42,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        

    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
       // fontSize: 14,
        
    },
    placeholderStyle: {
        //fontSize: 16,
        textAlign: 'center',
        color: '#B3B3B3',
    },
    selectedTextStyle: {
        //fontSize: 16,
        textAlign: 'center',
        color: '#B3B3B3',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});