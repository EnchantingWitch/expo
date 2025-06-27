import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, findNodeHandle, StyleSheet, UIManager, useWindowDimensions, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';


type Props = {
    post: string;
    status: boolean;
    title: string;
    data: [];
    onChange: (status: string) => void;
};

const ListOfOrganizations = ({ post, status, title, data, onChange }: Props) => {
    const [value, setValue] = useState(post || '');
    const [isFocus, setIsFocus] = useState(false);
    const [direction, setDirection] = useState<'top' | 'bottom' | 'auto'>('auto');

    const fontScale = useWindowDimensions().fontScale;

    const ts = (fontSize: number) => {
        return (fontSize / fontScale);
    };

    useEffect(() => {
        // Устанавливаем значение из props при изменении post или status
        if (post !== value && status) {
            setValue(post);
        }
    }, [post, status]);

    useEffect(() => {
        // Only handle dropdown opening when focused
        if(isFocus) {
            handleOpen();
        }
    }, [isFocus]);

    const dropdownRef = useRef<View>(null);

    const handleOpen = () => {
        const handle = findNodeHandle(dropdownRef.current);
        if (handle) {
            UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                const windowHeight = Dimensions.get('window').height;
                const spaceBelow = windowHeight - pageY - height;
                if (spaceBelow > 340) {
                    setDirection('bottom');
                } else {
                    setDirection('top');
                }
            });
        }
    };

    return (
        <View style={styles.container}>
            <View ref={dropdownRef} style={{width: '100%'}}>
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={[styles.placeholderStyle, { fontSize: ts(14), lineHeight: ts(20), includeFontPadding: false, textAlignVertical: 'center' }]}
                    selectedTextStyle={[styles.selectedTextStyle, { fontSize: ts(14), lineHeight: ts(20), includeFontPadding: false, textAlignVertical: 'center' }]}
                    inputSearchStyle={[styles.inputSearchStyle, { fontSize: ts(14), lineHeight: ts(20), includeFontPadding: false, textAlignVertical: 'center' }]}
                    iconStyle={styles.iconStyle}
                    data={data}
                    search
                    maxHeight={300}
                    mode='default'
                    dropdownPosition={direction}
                    itemTextStyle={{ fontSize: ts(14) }}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? title : 'Не выбрано'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item.value);
                        setIsFocus(false);
                        if (onChange) {
                            onChange(item.value);
                        }
                    }}
                />
            </View>
        </View>
    );
};
export default ListOfOrganizations;

const styles = StyleSheet.create({
    container: {
        paddingBottom: 16,
    },
    dropdown: {
        height: 42,
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
        color: '#B3B3B3',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#B3B3B3',
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