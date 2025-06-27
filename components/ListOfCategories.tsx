import { default as React, useEffect, useRef, useState } from 'react';
import { Dimensions, findNodeHandle, StyleSheet, UIManager, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'Влияет на ИИ', value: 'Влияет на ИИ' },
    { label: 'Влияет на АИИ', value: 'Влияет на АИИ' },
    { label: 'Влияет на КО', value: 'Влияет на КО' },
    { label: 'Влияет на АКО', value: 'Влияет на АКО' },
    { label: 'Влияет на под. ЭЭ', value: 'Влияет на под. ЭЭ' },
    { label: 'Влияет на под. газа', value: 'Влияет на под. газа' },
    { label: 'Влияет', value: 'Влияет' },
    { label: 'Не влияет на ПНР', value: 'Не влияет на ПНР' },
    { label: 'Не влияет', value: 'Не влияет' },
];

type Props = { 
    post?: string;
    onChange: (category: string) => void; // Функция для обновления категории
};

const ListOfCategories = ({ post, onChange }: Props) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [direction, setDirection] = useState<'top' | 'bottom' | 'auto'>('auto');

     const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

    if (value){
        onChange(value);
    }

    useEffect(() => {
        if(isFocus){handleOpen();console.log(1)}
    }, [value, isFocus]);

const dropdownRef = useRef<View>(null);;

    const handleOpen = () => {
    const handle = findNodeHandle(dropdownRef.current);
    console.log('handle', handle);
    if (handle) {
      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        // Вычисляем доступное пространство снизу
        const windowHeight = Dimensions.get('window').height;
        const spaceBelow = windowHeight - pageY - height;
        const spaceAbove = pageY;
        console.log('spaceBelow', spaceBelow);
        console.log('spaceAbove', spaceAbove);
        // Если места снизу меньше, чем высота списка, открываем вверх
        if (spaceBelow > 340 ) { // 200 - примерная высота списка
          setDirection('bottom');
          console.log('directionTOP', direction);
        } else {
          setDirection('top');
        }
      });
    }
  };
 
    return (
       
        <View style={styles.container}>
            <View ref={dropdownRef} style={{width: '100%'}}> {/* Обертка для измерения позиции */}
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue',   }]}
                placeholderStyle={[styles.placeholderStyle, { fontSize: ts(14)}]}
                selectedTextStyle={[styles.selectedTextStyle, { fontSize: ts(14)} ]}
                inputSearchStyle={[styles.inputSearchStyle, { fontSize: ts(14)}]}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                dropdownPosition={direction}
                itemTextStyle={{fontSize: ts(14)}}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Категория замечания' : 'Не выбрано'}
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
        </View>
            
    );
};

export default ListOfCategories;

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