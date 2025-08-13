import React, { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  setReadOnlyToFrame: (value: boolean) => void;//переключение между режимом редактирования и просмотра
  visible: boolean; //открытие модального окна триггер
  onRequestClose: (value: boolean) => void; //закрытие модального окна
  onValuesChange: (values: any[], index?: number) => void; // колбеки
  inputTitles: string[]; //наименования тайтлов для тексинпутов
  arrayToReadOnly: boolean[];//массив булевый для каждого индекса с указанием невозможности редактирования, возможно придется править так как не подружила с initiallyReadOnly
  inputValues: any[];//значения с бека
  additionalComponents?: Array<{
    component: React.ReactNode;
    key: string;
    readOnly?: boolean;
  }>;
  componentOrder?: number[];
  initiallyReadOnly: boolean; //режим чтения онли
  func;
};

export default function CustomModal({
  setReadOnlyToFrame,
  initiallyReadOnly,
  visible,
  onRequestClose,
  onValuesChange,
  inputTitles,
  arrayToReadOnly,
  inputValues,
  additionalComponents,
  componentOrder,
  func
}: Props) {
  const [readOnly, setReadOnly] = useState(initiallyReadOnly);
  const [currentValues, setCurrentValues] = useState(inputValues);

  useEffect(() => {
    setCurrentValues(inputValues);
  }, [inputValues]);

  useEffect(() => {
    setReadOnlyToFrame(readOnly);
  }, [readOnly]);

  const handleValueChange = (index: number, value: any) => {
    const newValues = [...currentValues];
    newValues[index] = value;
    setCurrentValues(newValues);
    
    // Вызываем onValuesChange с полным массивом значений и индексом измененного поля
    if (onValuesChange) {
      onValuesChange(newValues, index);
    }
  };

  const handleComponentValueUpdate = (newValues: any[]) => {
    setCurrentValues(newValues);
    
    // Для компонентов передаем только полный массив значений
    if (onValuesChange) {
      onValuesChange(newValues);
    }
  };

  const toggleEditMode = () => {
    setReadOnly(!readOnly);
  };

  const modalContentRef = useRef<View>(null);
  const inputsCount = inputTitles.length;
  
  // Валидация теперь проще, так как onChangeValueCallbacks больше нет
  const isValid = inputValues.length === inputsCount;

  if (!isValid) {
    console.error('Количество заголовков и значений должно совпадать');
    return null;
  }

  const allElements: Array<{
    type: 'input' | 'component';
    index?: number;
    order: number;
    component?: React.ReactNode;
    key?: string;
    readOnly?: boolean;
  }> = [];

  // Добавляем TextInput
  inputTitles.forEach((title, index) => {
    allElements.push({
      type: 'input',
      index,
      order: index,
    });
  });

  // Добавляем дополнительные компоненты
  if (additionalComponents) {
    additionalComponents.forEach((componentObj, index) => {
      const order = componentOrder && componentOrder[index] !== undefined 
        ? componentOrder[index] 
        : inputsCount + index;
      allElements.push({
        type: 'component',
        component: componentObj.component,
        key: componentObj.key || `component-${index}`,
        order,
        readOnly: componentObj.readOnly,
      });
    });
  }

  // Сортируем элементы
  allElements.sort((a, b) => a.order - b.order);

  const handleOverlayPress = (e: any) => {
    if (modalContentRef.current) {
      modalContentRef.current.measureInWindow((x, y, width, height) => {
        const { pageX, pageY } = e.nativeEvent;
        if (pageX < x || pageX > x + width || pageY < y || pageY > y + height) {
          setReadOnly(true);
          onRequestClose(false);
          
        }
      });
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      transparent={true}
      animationType="fade"
    >
      <TouchableOpacity 
        style={styles.rowContainer}
        activeOpacity={1}
        onPressOut={handleOverlayPress}
      >
        <View 
          ref={modalContentRef} 
          style={[styles.container, {
            width: 450,
            maxHeight: '100%',
            right: 0,
            top: 0,
            bottom: 0
          }]}
        >
          {!readOnly ? (
            <TouchableOpacity onPress={toggleEditMode}>
              <Text style={{color: '#0072C8'}}>Перейти в режим просмотра</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={toggleEditMode}>
              <Text style={{color: '#0072C8'}}>Перейти в режим редактирования</Text>
            </TouchableOpacity>
          )}
          
          <ScrollView>
            {allElements.map((element) => {
              if (element.type === 'input' && element.index !== undefined) {
                const inputIndex = element.index;
                return (
                  <View key={`input-${inputIndex}`} style={styles.inputContainer}>
                    <Text style={styles.label}>{inputTitles[inputIndex]}</Text>
                    {readOnly ? (
                      <Text style={styles.readOnlyValue}>
                        {currentValues[inputIndex] || 'Не указано'}
                      </Text>
                    ) : (
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleValueChange(inputIndex, text)}
                        value={currentValues[inputIndex]}
                        editable={arrayToReadOnly[inputIndex] }// !readOnly
                      />
                    )}
                  </View>
                );
              } else if (element.type === 'component' && element.key) {
                const componentWithProps = React.cloneElement(
                  element.component as React.ReactElement,
                  { 
                    readOnly,
                    currentValues,
                    onValueUpdate: handleComponentValueUpdate
                  }
                );
                
                return (
                  <View key={element.key} style={styles.componentContainer}>
                    {componentWithProps}
                  </View>
                );
              }
              return null;
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
  },
  readOnlyValue: {
    height: 42,
    paddingVertical: 11,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 8,
    textAlign: 'center',
    color: '#B3B3B3',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    alignSelf: 'center',
  },
  input: {
    height: 42,
    fontSize: 14,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
    color: '#B3B3B3',
  },
  componentContainer: {
    marginVertical: 10,
  },
});