import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export type ListToDrop = {
    label: string;
    value: string; 
};

type Props = {
    list: ListToDrop[]; // список
    nameFilter: string;
   // statusreq: boolean; // для обновления значения даты при получении даты с запроса
    onChange: (subobj: string) => void; // Функция для обновления значения
};

const ListOfSubobj = ({ list, nameFilter, onChange }: Props) => {
    const [value, setValue] = useState<string>('');
    const [isFocus, setIsFocus] = useState(false);
    const [List, setList] = useState<ListToDrop[]>([]);
    const fontScale = useWindowDimensions().fontScale;

    const ts = (fontSize: number) => {
        return (fontSize / fontScale);
    };
      
      useEffect(() => {
        // Обновляем родительский компонент при изменении значения
        if (value && onChange) {
          onChange(value);
        }
      }, [value]);

      useEffect(() => {
        if(list){
            console.log(list);
            const updated = List.map(item => {
                const found = list.find(s => s.label === item.label);
                return found ? { ...item, value: found.value } : item;
              });
              setList(updated);
           }
      }, [list]);
      
    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue'}]}
                placeholderStyle={[styles.placeholderStyle, { fontSize: ts(14)}]}
                selectedTextStyle={[styles.selectedTextStyle, { fontSize: ts(14)}]}
                inputSearchStyle={[styles.inputSearchStyle, { fontSize: ts(14) }]}
                iconStyle={styles.iconStyle}
                containerStyle={{
                    //width: '37%', // Ширина списка может отличаться от инпута
                    borderColor: '#E0F2FE',
                    borderWidth: 1,
                    borderRadius: 8,
        //alignSelf: 'flex-start',
                  }}
                data={list}
                search
                maxHeight={300}
                itemTextStyle={{ fontSize: ts(12) }}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? nameFilter : nameFilter}
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

// ... остальной код стилей остается без изменений

export default ListOfSubobj;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E0F2FE',
        //paddingBottom: 16,
        width: 120,
        borderRadius: 8,
    },
    dropdown: {
        height: 37,
        borderColor: '#E0F2FE',
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
        

      //  fontSize: 14,
        
    },
    placeholderStyle: {
       // fontSize: 16,
       textAlign: 'center',
       //color: '#B3B3B3',
      
    },
    selectedTextStyle: {
        //fontSize: 16,
        textAlign: 'center',
       // color: '#B3B3B3',
       
    },
    iconStyle: {
        width: 10,
        height: 10,
    },
    inputSearchStyle: {
        height: 37,
        borderRadius: 8,
       // fontSize: 16,
    },
});