import useDevice from '@/hooks/useDevice';
import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

type Props = {
    post: string;
    status: boolean;
    editable?: boolean;
    title: string;//не помню, вроде типо наименование внутри текстаинпута
    Title?: string;//перед текстинпутом название 
    label?: string;
    data: Array<{label: string, value: string}>;
    width?: string;
    onChange: (value: string) => void;
};

const AdaptiveDropdown = forwardRef(({ post, status, title, Title, editable=true, label, data, onChange, width }: Props, ref) => {
    const { isMobile, isDesktopWeb, isMobileWeb, screenWidth, screenHeight } = useDevice();
    const [value, setValue] = useState(post || '');
    const [isFocus, setIsFocus] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
    const dropdownRef = useRef<View>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [modalWidth, setModalWidth] = useState('40%');
    const modalContentRef = useRef<View>(null);

    const fontScale = useWindowDimensions().fontScale;
    const ts = (fontSize: number) => fontSize / fontScale;

    useEffect(() => {
        if (post !== value && status) {
            setValue(post);
        }
    }, [post, status]);

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
        onChange(selectedValue);
    };

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

    const filteredData = searchText 
        ? data.filter(item => 
            item.label.toLowerCase().includes(searchText.toLowerCase()))
        : data;

    const selectedLabel = value 
        ? data.find(item => item.value === value)?.label 
        : title;

    return (
        <View style={{width: width? width : '96%'}}>
            <View style={styles.container}>
                <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>{Title}</Text>
                {/* Триггер для открытия модального окна */}
                <View ref={dropdownRef}>
                    <TouchableOpacity
                        onPress={handleOpen}  disabled={!editable}
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                            <View style={{width: '95%'}}>
                                <Text style={[styles.selectedTextStyle, { fontSize: ts(14), alignSelf: 'center' }]}>
                                    {post!=='' && post!==' '? post : selectedLabel? selectedLabel : ''}
                                </Text>
                            </View>
                            <View style={{width: '5%', alignItems: 'flex-end'}}>
                                <Ionicons name='chevron-down' color={ '#B3B3B3'} size={16} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Модальное окно с выпадающим списком */}
                <Modal
                    visible={isFocus}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setIsFocus(false)}
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={handleOverlayPress}
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
                            <Text style={styles.modalHeaderText}>{label}</Text>
                            <Text style={styles.selectedValueText}>
                                {value!=='' && value!==' ' && value!==undefined ? selectedLabel : 
                                    <Text style={[styles.selectedTextStyle, { fontSize: ts(14), paddingBottom: 2, alignSelf: 'center' }]}>
                                        Не выбрано
                                    </Text>}
                            </Text>
                            
                            <TextInput
                                placeholder="Поиск..."
                                placeholderTextColor={'#B2B3B3'}
                                value={searchText}
                                onChangeText={setSearchText}
                                style={[
                                    styles.inputSearchStyle, 
                                    { 
                                        height: 42,
                                        fontSize: ts(14),
                                        lineHeight: ts(14) * 1.2,
                                        paddingVertical: 0,
                                    }
                                ]}
                                autoFocus={isDesktopWeb}
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
                                        <Text style={styles.itemText}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                                keyboardShouldPersistTaps="handled"
                            />
                        </Animated.View >
                    </TouchableOpacity>
                </Modal>
            </View>
        </View>
    );
});

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
        alignItems: 'flex-end',
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
        minHeight: 42,
        maxHeight: 42,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 8,
        backgroundColor: '#fff',
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
});

export default AdaptiveDropdown;