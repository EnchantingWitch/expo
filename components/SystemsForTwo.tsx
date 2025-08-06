import React, { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export type ListToDrop = {
    label: string;
    value: string; 
};

type Props = {
    list: ListToDrop[]; // список
    nameFilter: string;
    width?: number;
   // statusreq: boolean; // для обновления значения даты при получении даты с запроса
    onChange: (subobj: string) => void; // Функция для обновления значения
};

const ListOfSubobj = ({ list, nameFilter, width, onChange }: Props) => {
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
        <View style={[styles.container,]} >
            <Dropdown
                style={[styles.dropdown,  isFocus && { borderColor: 'blue', width: width+30, maxWidth: width+30}]}
                placeholderStyle={[styles.placeholderStyle, 
                  { fontSize: ts(14), 
                    includeFontPadding: false, 
                    width: width, 
                    lineHeight: 16,  
                    textAlignVertical: 'center', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: 37}]}
                selectedTextStyle={[styles.selectedTextStyle, { fontSize: ts(14), includeFontPadding: false, width: width, lineHeight: 17,  textAlignVertical: 'center', maxHeight: 37,   overflow: 'hidden',
  textOverflow: 'ellipsis'}]}
                inputSearchStyle={[styles.inputSearchStyle, { fontSize: ts(14), includeFontPadding: false, justifyContent: 'center', alignSelf: 'center', width: width+20, marginLeft: -9, paddingLeft: 15}]}
                iconStyle={styles.iconStyle}
               // searchField={}
                containerStyle={{
                   // position: 'static',
                  // zIndex: 1,
                  alignItems: 'center',
                  
                    width: width+30, // Ширина списка может отличаться от инпута
                    borderColor: '#E0F2FE',
                    borderWidth: 1,
                    borderRadius: 8,
                  //   overflow: 'hidden', 
        //alignSelf: 'flex-start',
                  }}
                  dropdownPosition="auto"
                data={list}
                search
              //  dropdownPosition='auto'
                maxHeight={250}
                itemTextStyle={{ fontSize: ts(12), maxWidth: width,  }}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? nameFilter : nameFilter}
                searchPlaceholder="Поиск..."
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
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        //paddingBottom: 16,
       // width: 110,
        borderRadius: 8,
      // position: 'absolute', // Важно для позиционирования выпадающего списка
       // zIndex: 999, // Убедитесь, что контейнер выше других элементов
    },
    dropdown: {
        height: 37,
      
        borderColor: '#E0F2FE',
        borderWidth: 2,
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
      //  alignContent: 'flex-end',
    },
    inputSearchStyle: {
        height: 37,
        borderRadius: 8,
        color: 'rgba(178, 179, 179, 1)',
        borderColor: 'rgba(0, 0, 179, 0)',
        //,
       // fontSize: 16,
    },
});

export default ListOfSubobj;

