import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type Props = {
    post?: string;//значение из бд статуса для просмотра
    statusreq: boolean;//для обновления значения даты при получении даты с запроса
    pnrPlan?: string; 
    pnrFact?: string;
    iiPlan?: string;
    iiFact?: string;
    koPlan?: string;
    koFact?: string;
    onChange: (status: string) => void; // Функция для обновления статуса
};

const data1 = [
    { label: 'Компрессорная станция', value: '1' },
    { label: 'Дожимная компрессорная станция', value: '2' },
    { label: 'Установка комлексной подготовки газа', value: '3' },
    { label: 'Подземное хранилище газа', value: '4' },
    { label: 'Газовой промысел. Кусты газовых скважин', value: '5' },
    { label: 'Газовой промысел. Газосборные коллекторы', value: '6' },
    { label: 'Магистральный газопровод', value: '7' },
    { label: 'Газопровод-отвод', value: '8' },
    { label: 'Газоизмерительная станция', value: '9' },
    { label: 'Газораспределительная станция', value: '10' },
    { label: 'Комплекс по ПХО СПГ', value: '11' },
    { label: 'Нефтеперекачивающая станция', value: '12' },
    { label: 'Центральный пункт сбора', value: '12' },
    { label: 'Нефтеконденсатопровод', value: '12' },
    { label: 'Газоконденсатное месторождение', value: '12' },
    { label: 'Нефтеперекачивающая станция', value: '12' },
    { label: 'Нефтеперекачивающая станция', value: '12' },
    { label: 'Нефтеперекачивающая станция', value: '12' },
];

const DropdownComponent = ({post, statusreq, pnrPlan, pnrFact, iiPlan, iiFact, koPlan, koFact, onChange }: Props) => {
    const [value, setValue] = useState<string >();
    const [isFocus, setIsFocus] = useState(false);
    const [startD, setStartD] = useState<boolean>(true);//при первом рендеринге поставить значения из бд 
    const [swith, setSwith] = useState<number>(1);

     const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};
   //if (post) {if (pnrFact != null){setValue('4');}//Не работает так..
    //if (iiFact) {if (iiFact ){setValue('8');}}
  /*  useEffect(
        () => {

        //если изменилось значение фактических дат, обновляем выпадающий список
        if (pnrFact) {setSwith(2); console.log(pnrFact);}
        if (iiFact) {setSwith(3); console.log(iiFact);}
        if (koFact) {setSwith(4); console.log(koFact);}
        //условие на выбранное значение в зависимости от дат, проверка на выбранное значение из доступных статуов для соотвествующих дат
        if (pnrFact){ if (value != '5' && value != '6' && value != '7') {setValue('4'); console.log(setValue('4'));}}
        if (iiFact) {if(value != '9' && value != '10' && value != '11') {setValue('8'); console.log(iiFact);}} 
        if (koFact) {setValue('12'); console.log(koFact);}

        }, [pnrFact, iiFact, koFact]
    )*/

    if (statusreq && startD){
        setValue(post);
        setStartD(false);
        console.log(pnrFact != null && post === "  ");
        //setValue(data[1].label);
    
        //ПРОВЕРИТЬ как это работает когда с бэка приходят значения
     //условие на выбор выпадащего списка (должен быть при useEffect еще)
        if (pnrFact) {setSwith(2)}
        if (iiFact) {setSwith(3)}
        if (koFact) {setSwith(4)}
     //условие на выбранное значение в зависимости от дат
        if (post != "  ") {setValue(post);}//значение из бд
        else{
            if (pnrFact) {setValue('4');}
            if (iiFact) {setValue('8');}
            if (koFact) {setValue('12');}
        }
    }

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

export default DropdownComponent;

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