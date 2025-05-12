import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'Сахалинская область', value: 'Сахалинская область' },
    { label: 'Архангельская область', value: 'Архангельская область' },
    { label: 'Ненецкий автономный округ', value: 'Ненецкий автономный округ' },
    { label: 'Ямало-Ненецкий автономный округ', value: 'Ямало-Ненецкий автономный округ' },
    { label: 'Красноярский край', value: 'Красноярский край' },
    { label: 'Камчатский край', value: 'Камчатский край' },
    { label: 'Чукотский Автономный Округ', value: 'Чукотский Автономный Округ' },
    { label: 'Хабаровский край', value: 'Хабаровский край' },
    { label: 'Республика Саха (Якутия)', value: 'Республика Саха (Якутия)' },
    { label: 'Калининградская область', value: 'Калининградская область' },
    { label: 'г. Севастополь', value: 'г. Севастополь' },
    { label: 'Республика Крым', value: 'Республика Крым' },
    { label: 'Краснодарский край', value: 'Краснодарский край' },
    { label: 'Ставропольский край', value: 'Ставропольский край' },
    { label: 'Республика Калмыкия', value: 'Республика Калмыкия' },
    { label: 'Ростовская область', value: 'Ростовская область' },
    { label: 'Волгоградская область', value: 'Волгоградская область' },
    { label: 'Воронежская область', value: 'Воронежская область' },
    { label: 'Тульская область', value: 'Тульская область' },
    { label: 'Кабардино-Балкарская Республика', value: 'Кабардино-Балкарская Республика' },
    { label: 'Московская область', value: 'Московская область' },
    { label: 'г. Москва', value: 'г. Москва' },
    { label: 'Карачаево-Черкесская Республика', value: 'Карачаево-Черкесская Республика' },
    { label: 'Тамбовская область', value: 'Тамбовская область' },
    { label: 'Саратовская область', value: 'Саратовская область' },
    { label: 'Рязанская область', value: 'Рязанская область' },
    { label: 'Пензенская область', value: 'Пензенская область' },
    { label: 'Владимирская область', value: 'Владимирская область' },
    { label: 'Самарская область', value: 'Самарская область' },
    { label: 'Ярославская область', value: 'Ярославская область' },
    { label: 'Ульяновская область', value: 'Ульяновская область' },
    { label: 'Республика Мордовия', value: 'Республика Мордовия' },
    { label: 'Ивановская область', value: 'Ивановская область' },
    { label: 'Вологодская область', value: 'Вологодская область' },
    { label: 'Костромская область', value: 'Костромская область' },
    { label: 'Нижегородская область', value: 'Нижегородская область' },
    { label: 'Республика Татарстан', value: 'Республика Татарстан' },
    { label: 'Чувашская Республика', value: 'Чувашская Республика' },
    { label: 'Республика Марий Эл', value: 'Республика Марий Эл' },
    { label: 'Кировская область', value: 'Кировская область' },
    { label: 'Оренбургская область', value: 'Оренбургская область' },
    { label: 'Республика Башкортостан', value: 'Республика Башкортостан' },
    { label: 'Курганская область', value: 'Курганская область' },
    { label: 'Республика Коми', value: 'Республика Коми' },
    { label: 'Удмуртская Республика', value: 'Удмуртская Республика' },
    { label: 'Челябинская область', value: 'Челябинская область' },
    { label: 'Пермский край', value: 'Пермский край' },
    { label: 'Свердловская область', value: 'Свердловская область' },
    { label: 'Омская область', value: 'Омская область' },
    { label: 'Тюменская область', value: 'Тюменская область' },
    { label: 'Ханты-Мансийский автономный округ - Югра', value: 'Ханты-Мансийский автономный округ - Югра' },
    { label: 'Томская область', value: 'Томская область' },
    { label: 'Алтайский край', value: 'Алтайский край' },
    { label: 'Республика Алтай', value: 'Республика Алтай' },
    { label: 'Кемеровская область', value: 'Кемеровская область' },
    { label: 'Республика Хакасия', value: 'Республика Хакасия' },
    { label: 'Республика Тыва', value: 'Республика Тыва' },
    { label: 'Псковская область', value: 'Псковская область' },
    { label: 'Мурманская область', value: 'Мурманская область' },
    { label: 'Республика Карелия', value: 'Республика Карелия' },
    { label: 'Республика Дагестан', value: 'Республика Дагестан' },
    { label: 'Белгородская область', value: 'Белгородская область' },
    { label: 'Еврейская автономная область', value: 'влияеЕврейская автономная областьт' },
    { label: 'Астраханская область', value: 'Астраханская область' },
    { label: 'Приморский край', value: 'Приморский край' },
    { label: 'Чеченская Республика', value: 'Чеченская Республика' },
    { label: 'Курская область', value: 'Курская область' },
    { label: 'Ленинградская область', value: 'Ленинградская область' },
    { label: 'г. Санкт-Петербург', value: 'г. Санкт-Петербург' },
    { label: 'Амурская область', value: 'Амурская область' },
    { label: 'Липецкая область', value: 'Липецкая область' },
    { label: 'Калужская область', value: 'Калужская область' },
    { label: 'Тверская область', value: 'Тверская область' },
    { label: 'Республика Северная Осетия', value: 'Республика Северная Осетия' },
    { label: 'Республика Адыгея', value: 'Республика Адыгея' },
    { label: 'Смоленская область', value: 'Смоленская область' },
    { label: 'Новгородская область', value: 'Новгородская область' },
    { label: 'Республика Ингушетия', value: 'Республика Ингушетия' },
    { label: 'Орловская область', value: 'Орловская область' },
    { label: 'Забайкальский край', value: 'Забайкальский край' },
    { label: 'Магаданская область', value: 'Магаданская область' },
    { label: 'Иркутская область', value: 'Иркутская область' },
    { label: 'Республика Бурятия', value: 'Республика Бурятия' },
    { label: 'Луганская Народная Республика', value: 'Луганская Народная Республика' },
    { label: 'Запорожская область', value: 'Запорожская область' },
    { label: 'Донецкая Народная Республика', value: 'влиДонецкая Народная Республикаяет' },
    { label: 'Херсонская область', value: 'Херсонская область' },
  
];

type Props = {
    post?: string;
    onChange: (category: string) => void; // Функция для обновления категории
};

const ListOfRegion = ({ post, onChange }: Props) => {
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
                placeholder={!isFocus ? 'Регион' : 'Не выбрано'}
                searchPlaceholder="Search..."
                value={post? post: value}
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

export default ListOfRegion;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingBottom: 20,
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