import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export type ListToDrop = {
    label: string;
    value: string; 
  };

type Props = {
    list: ListToDrop[];//список
    post: string;//значение из бд статуса для просмотра, при записи передавать пустую строку
    subobj?: string;//
    statusreq?: boolean;//для обновления значения даты при получении даты с запроса
    onChange: (subobj: string, ) => void; // Функция для обновления значения
    onChangeStatus?: (subobj: boolean, ) => void; // 
};

const ListOfSystem = ({list, post, subobj, statusreq, onChange, onChangeStatus }: Props) => {
    const [value, setValue] = useState<string >();
    const [data, setData] = useState<ListToDrop[]>([]);
    const [isFocus, setIsFocus] = useState(false);
    const [startD, setStartD] = useState<boolean>(true);//при первом рендеринге поставить значения из бд 

    const fontScale = useWindowDimensions().fontScale;

    const ts = (fontSize: number) => {
        return (fontSize / fontScale)};

    useEffect(
        () => {
        if(list){
            setValue(post);
            //значение из БД
            console.log(post, 'post');
            //onChange(post);
            //setStartD(false);
            console.log('List', list.length );
            setData(list);

          
    console.log('startD',startD);
            /*for (const label in list) {
               if ( list[label].value === post){setValue(post);}
               else {onChange('');setValue('');}
        
            } */
        }
        
        if(post != ' '){
            setValue(post);
            //setData(list);
            console.log('post List', list );
        }
        /*if(subobj ){

            console.log('!!!');
            for (const label in list) {
               
               if ( list[label].value === post){setValue(post);}
               else {onChange('');setValue('');}
        
            } 
        }              */
        }, [ list]
    )

   /* if(list && statusreq){
        setValue(post);//значение из БД
        console.log('!');
        //onChange(post);
        //setStartD(false);
        setData(list);
        onChangeStatus(false);
      
        /*for (const label in list) {
           if ( list[label].value === post){setValue(post);}
           else {onChange('');setValue('');}
    
        } */
   // }     

    /*if (startD ){//запись при первом и единственном рендеринге
        setStartD(false);
        //setValue(post);//значение из БД
        setData(list);
    }*/
    
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
                placeholder={!isFocus ? 'Не выбрано' : 'Не выбрано'}
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
      //  fontSize: 14,
        
    },
    placeholderStyle: {
       // fontSize: 16,
       textAlign: 'center',
       color: '#B3B3B3',
    },
    selectedTextStyle: {
        //fontSize: 16,
        textAlign: 'center',
        color: '#B3B3B3',
         lineHeight: 18.5,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
       // fontSize: 16,
    },
});