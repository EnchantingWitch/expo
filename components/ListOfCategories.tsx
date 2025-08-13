import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

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
    onChange: (category: string) => void;
};

const ListOfCategories = ({ post, onChange }: Props) => {
    const [value, setValue] = useState(post || '');
    const [isFocus, setIsFocus] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
    const dropdownRef = useRef<View>(null);

    const fontScale = useWindowDimensions().fontScale;
    const ts = (fontSize: number) => fontSize / fontScale;

    useEffect(() => {
        if (value) {
            onChange(value);
        }
    }, [value]);

    const handleOpen = () => {
        if (dropdownRef.current) {
            dropdownRef.current.measureInWindow((x, y, width, height) => {
                const windowHeight = Dimensions.get('window').height;
                const spaceBelow = windowHeight - y - height;
                setDropdownPosition(spaceBelow > 340 ? 'bottom' : 'top');
            });
        }
        setIsFocus(true);
    };

    const handleSelect = (selectedValue: string) => {
        setValue(selectedValue);
        setIsFocus(false);
    };

    const filteredData = searchText 
        ? data.filter(item => 
            item.label.toLowerCase().includes(searchText.toLowerCase()))
        : data;

    const selectedLabel = value 
        ? data.find(item => item.value === value)?.label 
        : 'Не выбрано';

    return (
        <View style={{width: '96%'}}>
            <View style={styles.container}>
                {/* Триггер для открытия модального окна */}
                <View ref={dropdownRef}>
                    <TouchableOpacity
                        onPress={handleOpen}
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                            <View style={{width: '95%'}}>
                                <Text style={[styles.selectedTextStyle, { fontSize: ts(14), alignSelf: 'center' }]}>
                                    {value ? selectedLabel : 'Не выбрано'}
                                </Text>
                            </View>
                            <View style={{width: '5%'}}>
                                <Ionicons name='chevron-down' color={ '#B3B3B3'}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Модальное окно с выпадающим списком */}
                <Modal
                    visible={isFocus}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setIsFocus(false)}
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setIsFocus(false)}
                    >
                        <Animated.View 
                            style={[
                                styles.modalContent,
                                { maxHeight: '70%' }
                            ]}
                        >
                            <Text style={[styles.selectedTextStyle, { fontSize: ts(14), paddingBottom: 2, fontWeight: '500', color: '#0072C8', alignSelf: 'center' }]}>
                                Категория замечания
                            </Text>
                            <Text style={[styles.selectedTextStyle, { fontSize: ts(16), paddingBottom: 14, alignSelf: 'center' }]}>
                                {value ? selectedLabel : 
                                                            <Text style={[styles.selectedTextStyle, { fontSize: ts(14), paddingBottom: 2,  alignSelf: 'center' }]}>
                                                                Не выбрано
                                                            </Text>}
                            </Text>
                            <TextInput
                                placeholder="Поиск..."
                                placeholderTextColor={'#B2B3B3'}
                                value={searchText}
                                onChangeText={setSearchText}
                                style={[styles.inputSearchStyle, { fontSize: ts(14) }]}
                                autoFocus
                            />

                            <FlatList
                                data={filteredData}
                                keyExtractor={item => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            handleSelect(item.value);
                                            onChange(item.value);
                                        }}
                                    >
                                        <Text style={{ fontSize: ts(14) }}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                                keyboardShouldPersistTaps="handled"
                            />
                        </Animated.View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </View>
    );
};

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
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    selectedTextStyle: {
        color: '#B3B3B3',
        textAlign: 'left',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '50%',
        padding: 16,
    },
    dropdownItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalContentBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    inputSearchStyle: {
        height: 40,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 8,
        backgroundColor: '#fff',
    },
});

export default ListOfCategories;