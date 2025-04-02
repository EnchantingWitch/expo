import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const DropdownComponent = ({ data, selectedValue, onValueChange, isDataLoaded }) => {
  const [value, setValue] = useState(selectedValue);

  const handleValueChange = (itemValue) => {
    setValue(itemValue);
    onValueChange(itemValue); // Вызываем функцию обратного вызова для передачи нового значения
  };

  if (!isDataLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ padding: 16 }}>
      
      <Dropdown
        style={{ height: 50, borderColor: 'gray', borderWidth: 1, borderRadius: 8 }}
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        onChange={item => handleValueChange(item.value)}
        placeholder="Выберите значение"
        placeholderStyle={{ color: 'gray' }}
        selectedTextStyle={{ color: 'black' }}
        dropdownContainerStyle={{ backgroundColor: 'white' }}
      />
    </View>
  );
};

export default DropdownComponent;