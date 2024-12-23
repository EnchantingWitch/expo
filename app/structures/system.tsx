import { StyleSheet, Text, View, ScrollView, TextInput  } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { } from '@/components/Themed';
import { Dropdown } from 'react-native-element-dropdown';
import DateInputWithPicker from '@/components/calendar';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import DropdownComponent from '@/components/list_system';
import React from 'react';


export default function TabOneScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>

      <View style={styles.separator}/>
      <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 8  }}>Статус системы</Text>
      <DropdownComponent/>

       <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400' }}>План передачи в ПНР</Text>
      <DateInputWithPicker/>

      <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400'}}>Факт передачи в ПНР</Text>
      <DateInputWithPicker/>

      <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400'}}>План ИИ</Text>
      <DateInputWithPicker/>

      <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400'}}>Факт ИИ</Text>
      <DateInputWithPicker/>

      <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400'}}>План КО</Text>
      <DateInputWithPicker/>

      <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400' }}>Факт КО</Text>
      <DateInputWithPicker/>

      <View style={{ alignSelf: 'center',  flexDirection: 'row', width: '96%', paddingTop: 6,  marginBottom: 8}}>
          
                      <View style={{width: '50%', marginStart: 2}}>
                      <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Не устранено замечаний</Text>
                      <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                />
                      </View>

                      <View style={{width: '50%', marginStart: 2}}>
                      <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Не устранено дефектов</Text>
                      <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                />
                      
                      </View>
      </View>
      

       <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель СМР</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                />

      <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель ПНР</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                />
 
      <CustomButton title='Подтвердить'  handlePress={() => router.push('/(tabs)/structure')} />
      <CustomButton title='Отменить'  handlePress={() => router.push('/(tabs)/structure')} />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {

    height: 1,
    width: '80%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    width: '96%',
    height: 42,
    paddingVertical: 'auto',
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 20,
  },
});
