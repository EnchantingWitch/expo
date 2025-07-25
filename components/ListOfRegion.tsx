import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export type DropdownItem = {
  label: string;
  value: string;
};

type DropdownProps = {
  items?: DropdownItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  isEnabled?: boolean;
  placeholder?: string;
  modalTitle?: string;
  label?: string;
};

const DropdownComponent = forwardRef<View, DropdownProps>((
  {
    items = [],
    selectedValue,
    onValueChange,
    isEnabled = true,
    placeholder = 'Не выбрано',
    modalTitle = 'Выберите значение',
    label,
  },
  ref
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const dropdownRef = useRef<View>(null);

  const fontScale = useWindowDimensions().fontScale;
  const ts = (fontSize: number) => fontSize / fontScale;

  const selectedItem = items.find(item => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : '';//placeholder

  const filteredItems = searchText
    ? items.filter(item => 
        item.label.toLowerCase().includes(searchText.toLowerCase()))
    : items;

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
    setSearchText('');
  };

  const handleOpen = () => {
    Keyboard.dismiss(); // Скрываем клавиатуру перед открытием
    if (!isEnabled) return;
    
    if (dropdownRef.current) {
      dropdownRef.current.measureInWindow((x, y, width, height) => {
        const windowHeight = Dimensions.get('window').height;
        const spaceBelow = windowHeight - y - height;
        setDropdownPosition(spaceBelow > 340 ? 'bottom' : 'top');
      });
    }
    setIsOpen(true);
  };

  return (
    <View style={{width: '96%'}}>
      <View style={styles.container}>
        <View ref={dropdownRef}>
          <TouchableOpacity
            onPress={handleOpen}
            style={[
              styles.dropdown, 
              isOpen && { borderColor: 'blue' },
              !isEnabled && { opacity: 0.5 }
            ]}
            disabled={!isEnabled}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
              <View style={{width: '95%'}}>
                <Text style={[styles.selectedTextStyle, { fontSize: ts(14), alignSelf: 'center' }]}>
                  {displayText}
                </Text>
              </View>
              <View style={{width: '5%'}}>
                <Ionicons name='chevron-down' color='#B3B3B3'/>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setIsOpen(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          >
            <Animated.View 
              style={[
                styles.modalContent,
                { 
                  maxHeight: '70%',
                  [dropdownPosition === 'bottom' ? 'bottom' : 'top']: 0,
                  borderTopLeftRadius: dropdownPosition === 'bottom' ? 16 : 0,
                  borderTopRightRadius: dropdownPosition === 'bottom' ? 16 : 0,
                  borderBottomLeftRadius: dropdownPosition === 'top' ? 16 : 0,
                  borderBottomRightRadius: dropdownPosition === 'top' ? 16 : 0,
                }
              ]}
            >
              <Text style={[styles.modalTitle, { fontSize: ts(14) }]}>
                {modalTitle}
              </Text>
              <Text style={[styles.selectedValue, { fontSize: ts(16) }]}>
                {selectedItem ? selectedItem.label : 
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
                data={filteredItems}
                keyExtractor={item => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSelect(item.value)}
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
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 16,
  },
  modalTitle: {
    paddingBottom: 2,
    fontWeight: '500',
    color: '#0072C8',
    alignSelf: 'center',
  },
  selectedValue: {
    paddingBottom: 14,
    alignSelf: 'center',
    color: '#B3B3B3',
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
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});

export default DropdownComponent;