import React, { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'ТО', value: 'ТО' },
    { label: 'ЭО', value: 'ЭО' },
    { label: 'АСУ', value: 'АСУ' },
    { label: 'ПБ', value: 'ПБ' },
    { label: 'ОВиК', value: 'ОВиК' },
    { label: 'ТЭО', value: 'ТЭО' },
    { label: 'ВК', value: 'ВК' },
    { label: 'ЭХЗ', value: 'ЭХЗ' },
    { label: 'МО', value: 'МО' },
    { label: 'КИТСО', value: 'КИТСО' },
    { label: 'ПТО', value: 'ПТО' }, 
    { label: 'МОО', value: 'МОО' },
    { label: 'ХиКУ', value: 'ХиКУ' },
    { label: 'ГТМ', value: 'ГТМ' },
    { label: 'ПЭМ', value: 'ПЭМ' },
    { label: 'ИБ', value: 'ИБ' },
    { label: 'КЗ', value: 'КЗ' },
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