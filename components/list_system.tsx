import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

const DropdownComponent = () => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}

                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Система' : 'Система'}
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

export default DropdownComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingBottom: 16,
        width: '96%',
    },
    dropdown: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
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
        fontSize: 14,
        
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
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