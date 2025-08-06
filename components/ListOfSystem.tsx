import useDevice from '@/hooks/useDevice';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export type ListToDrop = {
    label: string;
    value: string; 
};

type Props = {
    list: ListToDrop[];
    post: string;
    title?: string;
    buf?: string;
    statusreq?: boolean;
    onChange: (subobj: string) => void;
    onChangeStatus?: (subobj: boolean) => void; 
};

const ListOfSystem = ({ list, post, buf, title, statusreq = true, onChange, onChangeStatus }: Props) => {
    const { isMobile, isDesktopWeb, isMobileWeb, screenWidth, screenHeight } = useDevice();

    const [value, setValue] = useState(post || '');
    const [isFocus, setIsFocus] = useState(false);
    const [searchText, setSearchText] = useState('');
    const dropdownRef = useRef<View>(null);

    const fontScale = useWindowDimensions().fontScale;
    const ts = (fontSize: number) => fontSize / fontScale;

    const [initialized, setInitialized] = useState(false);
    
    const modalContentRef = useRef<View>(null);
    const handleOverlayPress = (e: any) => {
        // Проверяем, было ли нажатие вне контейнера модального окна
        if (modalContentRef.current) {
            modalContentRef.current.measureInWindow((x, y, width, height) => {
                const { pageX, pageY } = e.nativeEvent;
                if (
                    pageX < x || 
                    pageX > x + width || 
                    pageY < y || 
                    pageY > y + height
                ) {
                    setIsFocus(false);
                }
            });
        }
    };
    useEffect(() => {
        if (!initialized && list.length > 0) {
            setInitialized(true);
            return;
        }
        //если вывести в отдельный useEffect тогда будет обнулять значение для системы каждый раз при выборе объекта и даже не нового
        if (initialized) {
            setValue('');
            if (onChange) {
                onChange('');
            }
        }
    }, [list]);

    // ListOfSystem.tsx
useEffect(() => {
    // Устанавливаем значение только если post изменился
    if (post !== value) { 
        setValue(post || '');
    }
}, [post]); // Зависим только от post, а не от list

useEffect(() => {
    // Обновляем родительский компонент только при ручном изменении значения
    if (value && onChange && value !== post) {
        onChange(value);
    }
}, [value]);

    useEffect(() => {
        if (value && onChange) {
            onChange(value);
        }
        if (onChangeStatus) {
            onChangeStatus(!!value);
        }
    }, [value]);

    const handleOpen = () => {
        if (!statusreq) return;
        setIsFocus(true);
    };

    const handleSelect = (selectedValue: string) => {
        setValue(selectedValue);
        setIsFocus(false);
    };

    const filteredData = searchText 
        ? list.filter(item => 
            item.label.toLowerCase().includes(searchText.toLowerCase()))
        : list;

    const selectedLabel = value 
        ? list.find(item => item.value === value)?.label 
        : 'Не выбрано';

    return (
        <View style={{width: '96%'}}>
            <View style={styles.container}>
                <View ref={dropdownRef}>
                    <TouchableOpacity
                        onPress={handleOpen}
                        style={[
                            styles.dropdown, 
                            isFocus && { borderColor: 'blue' },
                            !statusreq && { opacity: 0.5 }
                        ]}
                        disabled={!statusreq}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                            <View style={{width: '95%'}}>
                                <Text style={[styles.selectedTextStyle, { fontSize: ts(14), alignSelf: 'center', lineHeight: ts(22) }]}>
                                    {post!=='' && post!==' ' && post!==undefined? post : 
                                                                <Text style={[styles.selectedTextStyle, { fontSize: ts(14), paddingBottom: 2,  alignSelf: 'center' }]}>
                                                                    Не выбрано
                                                                </Text>}
                                </Text>
                            </View>
                            <View style={{width: '5%'}}>
                                <Ionicons name='chevron-down' color='#B3B3B3' size={16}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                 <Modal
                                    visible={isFocus}
                                    transparent
                                    animationType="fade"
                                    onRequestClose={() => setIsFocus(false)}
                                >
                                    <TouchableOpacity 
                                        style={styles.modalOverlay}
                                        activeOpacity={1}
                                        onPress={handleOverlayPress}
                                    >
                                        <Animated.View 
                                        ref={modalContentRef}
                                            style={[
                                                styles.modalContent,
                                                { 
                                                    width: '40%',
                                                    maxHeight: '100%',
                                                    right: 0,
                                                    top: 0,
                                                    bottom: 0
                                                }
                                            ]}
                                        >
                                            <Text style={styles.modalHeaderText}>{title? title : 'Система'}</Text>
                                            <Text style={styles.selectedValueText}>
                                                {value!=='' && value!==' ' && value!==undefined ? selectedLabel : 
                                                            <Text style={[styles.selectedTextStyle, { fontSize: ts(14), paddingBottom: 2,  alignSelf: 'center' }]}>
                                                                Не выбрано
                                                            </Text>}
                                            </Text>
                                            
                                            <TextInput
                                                placeholder="Поиск..."
                                                placeholderTextColor={'#B2B3B3'}
                                                value={searchText}
                                                onChangeText={setSearchText}
                                                style={styles.inputSearchStyle}
                                                autoFocus={isDesktopWeb}
                                            />
                
                                            {filteredData.length > 0 ? (
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
                                                            <Text style={styles.itemText}>{item.label}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    keyboardShouldPersistTaps="handled"
                                                />
                                            ) : (
                                                <View style={styles.emptyState}>
                                                    <Text style={styles.emptyStateText}>Ничего не найдено</Text>
                                                </View>
                                            )}
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
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        //alignSelf: 'flex-start',
    },
modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        position: 'absolute',
    },
    modalHeaderText: {
        fontSize: 14,
        paddingBottom: 2,
        fontWeight: '500',
        color: '#0072C8',
        alignSelf: 'center'
    },
    selectedValueText: {
        fontSize: 16,
        paddingBottom: 14,
        alignSelf: 'center'
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    emptyStateText: {
        fontSize: 14,
        color: '#B3B3B3'
    },
    itemText: {
        fontSize: 14
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
        height: 42,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 8,
        backgroundColor: '#fff',
    },
});

export default ListOfSystem;