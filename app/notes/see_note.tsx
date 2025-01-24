import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Link, Tabs } from 'expo-router';
import DropdownComponent1 from '@/components/list_system';
import DropdownComponent2 from '@/components/list_categories';
import DateInputWithPicker from '@/components/calendar';
import DateInputWithPicker2 from '@/components/calendar+10';
import FormField from '@/components/FormField';
import { styles } from './create_note';


type Props = {

  //iinumber: number;//номер акта ИИ
};
//{ route }: {route: any}
const DetailsScreen = () => {
 // const { variable } = route.params;
 const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};
  
  return (

    <ScrollView>
      <View style={[styles.container]}>
        
        <View style={{flex: 1, alignItems: 'center'}}>
            
            <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>№ замечания</Text>
          <TextInput
            style={styles.input}
            //placeholder="№ акта ИИ"
            placeholderTextColor="#111"
          />
            
            <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>№ акта ИИ</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#111"
          />

  
          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Объект</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#111"
          />

          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Система</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#111"
          />     
          
          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Содержание замечания</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#111"
          />

          <Link href='/notes/add_photo' asChild>
            <Text style={{ marginBottom: 20, color: '#0000CD' }}>Фото</Text>
          </Link>

          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Статус</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#111"
          />

          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#111"
          />

          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: 400, marginBottom: 0 }}>Дата выдачи</Text>
          <DateInputWithPicker keyboardType="number-pad" editable={false} />

          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: 400, marginBottom: 0 }}>Плановая дата устранения</Text>
          <DateInputWithPicker
          />
          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Категория замечания</Text>
          <DropdownComponent2 />


          <View style={{
            width: 272, height: 40, justifyContent: 'center', alignContent: 'center'
            //alignItems: 'center', backgroundColor: 'powderblue',
          }}>
            <Link href='/(tabs)/two' asChild>
              <TouchableOpacity style={{ borderRadius: 8, backgroundColor: '#0072C8', width: 272, height: 40, paddingVertical: 8, alignSelf: 'center', marginBottom: 15 }}>
                <Text style={{ fontSize: ts(16), fontWeight: '400', color: '#F5F5F5', textAlign: 'center', }}>Сохранить</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
    //</SafeAreaView>

  );
}

const AlignContentLayout = () => {
  const [alignContent, setAlignContent] = useState('flex-start');

  const stylHead = StyleSheet.create({
    container: {
      marginLeft: 8,
      marginRight: 8,
      paddingVertical: 8,
      flex: 1,
      //  rowGap: 30,
      //   flexDirection: 'column',
      //   justifyContent: 'flex-start',
      backgroundColor: '#708fff',
      alignItems: 'center',
      // alignContent: 'space-around',
      justifyContent: 'center',
      // minWidth: 120, 
      // flexWrap: 'wrap',
    },
  });
}
/*
const styles = StyleSheet.create({
  container: {
    //display: flattenDiagnosticMessageText,

    flex: 1,
    rowGap: 30,

    backgroundColor: '#fff',
    alignItems: 'center',
    alignContent: 'space-around',
    justifyContent: 'center',
    minWidth: 120,
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
*/
export default DetailsScreen;