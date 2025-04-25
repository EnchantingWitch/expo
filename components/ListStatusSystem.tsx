import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type Props = {
    post?: string; // значение из бд статуса для просмотра
    statusreq: boolean; // для обновления значения при получении данных с запроса
    pnrPlan?: string; 
    pnrFact?: string;
    iiPlan?: string;
    iiFact?: string;
    koPlan?: string;
    koFact?: string;
    onChange: (status: string) => void;
};

const data1 = [
    { label: 'Ведутся СМР', value: 'Ведутся СМР' },
    { label: 'Завершены СМР', value: 'Завершены СМР' },
    { label: 'Предъявлено в ПНР', value: 'Предъявлено в ПНР' },
];

const data2 = [
    { label: 'Принято в ПНР', value: 'Принято в ПНР' },
    { label: 'Ведутся ПНР', value: 'Ведутся ПНР' },
    { label: 'Проведены ИИ', value: 'Проведены ИИ' },
    { label: 'Акт ИИ на подписи', value: 'Акт ИИ на подписи' },
];

const data3 = [
    { label: 'Акт ИИ подписан', value: 'Акт ИИ подписан' },
    { label: 'Проводится КО', value: 'Проводится КО' },
    { label: 'Проведено КО', value: 'Проведено КО' },
    { label: 'Акт КО на подписи', value: 'Акт КО на подписи' },
];

const data4 = [
    { label: 'Акт КО подписан', value: 'Акт КО подписан' },
];

const DropdownComponent = ({
    post,
    statusreq, 
    pnrPlan, 
    pnrFact, 
    iiPlan, 
    iiFact, 
    koPlan, 
    koFact, 
    onChange 
}: Props) => {
    const [value, setValue] = useState<string>('');
    const [isFocus, setIsFocus] = useState(false);
    const [swith, setSwith] = useState<number>(1);

    const fontScale = useWindowDimensions().fontScale;
    const ts = (fontSize: number) => fontSize / fontScale;

    // Основной эффект для инициализации значений
    useEffect(() => {
        if (statusreq && post) {
            setValue(post);
            
            // Определяем какой набор данных использовать
            if (pnrFact && pnrFact == " " && iiFact && iiFact == " " && koFact && koFact == " "){setSwith(1); }
            if (pnrFact && pnrFact != " ") {setSwith(2); }
            if (iiFact && iiFact != " ") {setSwith(3); }
            if (koFact && koFact != " ") {setSwith(4); }
        }
    }, [post, statusreq, pnrFact, iiFact, koFact]);

    // Эффект для обработки изменений дат
    useEffect(() => {
        if (pnrFact && pnrFact !== " ") {
            setSwith(2);
            if (!['Принято в ПНР', 'Ведутся ПНР', 'Проведены ИИ', 'Акт ИИ на подписи'].includes(value)) {
                setValue('Принято в ПНР');
            }
        }  if (iiFact && iiFact !== " ") {
            setSwith(3);
            if (!['Проводится КО', 'Проведено КО', 'Акт КО на подписи'].includes(value)) {
                setValue('Акт ИИ подписан');
            }
        }  if (koFact && koFact !== " ") {
            setSwith(4);
            setValue('Акт КО подписан');
        } if(pnrFact === " " && iiFact === " "&& koFact === " ") {
            setSwith(1);
            if (!['Ведутся СМР', 'Завершены СМР', 'Предъявлено в ПНР'].includes(value)) {
                setValue(' ');
            }
        }
    }, [pnrFact, iiFact, koFact]);

    // Передаем изменения наружу
    useEffect(() => {
        if (value) {
            onChange(value);
        }
    }, [value]);

    const getData = () => {
        switch(swith) {
            case 2: return data2;
            case 3: return data3;
            case 4: return data4;
            default: return data1;
        }
    };

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={[styles.placeholderStyle, { fontSize: ts(14) }]}
                selectedTextStyle={[styles.selectedTextStyle, { fontSize: ts(14) }]}
                inputSearchStyle={[styles.inputSearchStyle, { fontSize: ts(14) }]}
                iconStyle={styles.iconStyle}
                data={getData()}
                search
                maxHeight={300}
                itemTextStyle={{ fontSize: ts(14) }}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Не выбрано' : '...'}
                searchPlaceholder="Поиск..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                }}
                disable={!statusreq} // Блокируем если данные не загружены
            />
        </View>
    );
};

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
    placeholderStyle: {
        textAlign: 'center',
        color: '#B3B3B3',
    },
    selectedTextStyle: {
        textAlign: 'center',
        color: '#B3B3B3',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
    },
});

export default DropdownComponent;