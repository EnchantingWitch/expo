import React, { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'Заказчик', value: '1' },
    { label: 'Куратор от заказчика', value: '2' },
    { label: 'Исполнитель ПНР', value: '3' },
    { label: 'Руководитель ПНР', value: '4' },
    { label: 'Исполнитеь СМР', value: '5' },
    { label: 'Куратор СМР', value: '6' },
];

type Props = {
    onChange: (status: string) => void; // Функция для обновления статуса
};

const ListOfRoles = ({ onChange }: Props) => {
    const [value, setValue] = useState('');
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
                style={[styles.dropdown, isFocus && { borderColor: 'blue',   }]}
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
                placeholder={!isFocus ? 'Роль' : 'Не выбрано'}
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

export default ListOfRoles;

const styles = StyleSheet.create({
    container: {
        //backgroundColor: 'white',
        //paddingBottom: 16,
    },
    dropdown: {
        height: 40,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        //width: 135,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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