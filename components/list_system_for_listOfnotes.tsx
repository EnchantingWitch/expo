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
        <View >
            <Dropdown
               
                style={[styles.dropdown]}
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
                searchPlaceholder="Search..."
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

    dropdown: {
        width: 95,
        marginLeft: -5,
    },
    icon: {
        marginRight: 5,
    },

    placeholderStyle: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400',
        color: '#334155',
        textAlign: 'center',
    },
    selectedTextStyle: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400',
        color: '#334155',
        textAlign: 'center',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400',
        color: '#334155',
        textAlign: 'center',
    },
});