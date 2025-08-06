import useDevice from '@/hooks/useDevice';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export type DropdownItem = {
  label: string;
  value: string;
};

type DropdownProps = {
  items?: DropdownItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  isEnabled: boolean;
  placeholder?: string;
  modalTitle?: string;
};

const Dropdown = ({
  items = [],
  selectedValue,
  onValueChange,
  isEnabled,
  placeholder = 'Не выбрано',
  modalTitle = 'Выберите значение',
}: DropdownProps) => {
  const modalContentRef = useRef<View>(null);
  const { isMobile, isDesktopWeb, isMobileWeb, screenWidth, screenHeight } = useDevice();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef<View>(null);

  const fontScale = useWindowDimensions().fontScale;
  const ts = (fontSize: number) => fontSize / fontScale;

  // Find selected item or use raw value if not found
  const selectedItem = items.find(item => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : selectedValue ;

  // Filter items safely
  const filteredItems = searchText
    ? items.filter(item =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : items;

  const handleSelect = (value: string) => {
    // Find the selected item to get its label
    //const selected = items.find(item => item.value === value);
    // Send the label if found, otherwise send the original value
    onValueChange(value ? value : selectedValue);
    setIsOpen(false);
    setSearchText('');
  };

  const handleOpen = () => {
    if (!isEnabled) return;
    setIsOpen(true);
  };

  const handleOverlayPress = (e: any) => {
    if (modalContentRef.current) {
      modalContentRef.current.measureInWindow((x, y, width, height) => {
        const { pageX, pageY } = e.nativeEvent;
        if (
          pageX < x || 
          pageX > x + width || 
          pageY < y || 
          pageY > y + height
        ) {
          setIsOpen(false);
        }
      });
    }
  };

  if (!isEnabled) {
    return (
      <View style={styles.dropdownContent}>
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.selectedText,
              { 
                fontSize: ts(14),
                color: '#B3B3B3',
              }
            ]}
          >
            {displayText}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name='chevron-down' color='#B3B3B3' size={16} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ width: '96%' }}>
      <View style={styles.container}>
        <View ref={dropdownRef}>
          <TouchableOpacity
            onPress={handleOpen}
            style={[
              styles.dropdown,
              isOpen && { borderColor: 'blue' },
            ]}
            disabled={!isEnabled}
          >
            <View style={styles.dropdownContent}>
              <View style={styles.textContainer}>
                <Text 
                  style={[
                    styles.selectedText,
                    { 
                      fontSize: ts(14),
                      color: '#B3B3B3',
                    }
                  ]}
                >
                  {displayText}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                <Ionicons name='chevron-down' color='#B3B3B3' size={16} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
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
                //  width: isMobileWeb ? '100%' : '40%',
                  width: '40%',
                  maxHeight: '100%',
                  right: 0,
                  top: 0,
                  bottom: 0,
                },
              ]}
            >
              <Text style={styles.modalHeaderText}>{modalTitle}</Text>
              
              <Text style={styles.selectedValueText}>
                {selectedItem ? selectedItem.label : selectedValue || 
                  <Text style={[ { fontSize: ts(14), paddingBottom: 2, alignSelf: 'center' }]}>
                    {placeholder}
                  </Text>}
              </Text>

              <TextInput
                placeholder="Поиск..."
                placeholderTextColor={'#B2B3B3'}
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
                autoFocus={isDesktopWeb}
              />

              {filteredItems.length > 0 ? (
                <FlatList
                  data={filteredItems}
                  keyExtractor={item => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => handleSelect(item.label)}
                    >
                      <Text style={{ fontSize: ts(14) }}>{item.label}</Text>
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
  disabled: {
    opacity: 0.5,
  },
  dropdown: {
    height: 42,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    width: '95%',
  },
  iconContainer: {
    width: '5%',
    alignItems: 'flex-end',
  },
  selectedText: {
    textAlign: 'center',
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
    alignSelf: 'center',
  },
  selectedValueText: {
    fontSize: 16,
    paddingBottom: 14,
    alignSelf: 'center',
    color: '#B3B3B3',
  },
  searchInput: {
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
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#B3B3B3',
  },
});

export default Dropdown;