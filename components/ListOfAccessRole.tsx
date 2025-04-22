import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'Без доступа', value: 'NONE' },
    { label: 'Пользователь', value: 'USER' },
    { label: 'Администратор', value: 'ADMIN' },
];

type Props = {
    post: string;
    status: boolean;
    onChange: (status: string) => void;
};

const ListOfAccessRole = ({ post, status, onChange }: Props) => {
    const [value, setValue] = useState(post || '');
    const [isFocus, setIsFocus] = useState(false);
    const fontScale = useWindowDimensions().fontScale;

    const ts = (fontSize: number) => {
        return (fontSize / fontScale);
    };

    useEffect(() => {
        // Устанавливаем значение из props при изменении post или status
        if (post !== value && status) {
            setValue(post);
        }
        if (status){
            setValue(post);
        }
    }, [post, status]);

    useEffect(() => {
        // Обновляем родительский компонент при изменении значения
        if (onChange) {
            onChange(value);
        }
    }, [value]);

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={[styles.placeholderStyle, { fontSize: ts(14) }]}
                selectedTextStyle={[styles.selectedTextStyle, { fontSize: ts(14) }]}
                inputSearchStyle={[styles.inputSearchStyle, { fontSize: ts(14) }]}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                itemTextStyle={{ fontSize: ts(14) }}
                labelField="label"
                valueField="value"
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

export default ListOfAccessRole;

const styles = StyleSheet.create({
    container: {
        paddingBottom: 16,
    },
    dropdown: {
        height: 40,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: '96%',
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
        textAlign: 'center',
    },
    selectedTextStyle: {
        fontSize: 16,
        textAlign: 'center',
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