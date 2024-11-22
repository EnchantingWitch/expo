import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Link, Tabs, Redirect, router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DropdownComponent1 from '@/components/list_system';
import DropdownComponent2 from '@/components/list_categories';
import DateInputWithPicker from '@/components/calendar';
import DateInputWithPicker2 from '@/components/calendar+10';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';


export default function listOfNotes() {
  return (

    <ScrollView>
      <View style={[styles.container]}>
        <View style={{
          flex: 1,
          //marginLeft: 60.5,
          //marginRight: 60.5,
          alignItems: 'center',
        }}>


          <View style={{
            //backgroundColor: 'gray',
            alignItems: 'center',
            width: '80%',
            flexDirection: 'row',
            justifyContent: 'space-between', paddingTop: 10
          }}>

            <FormField
              // onChangeText={"W"}
              theme='min'
              placeholder="№ замечания"
              keyboardtype="numeric"
              returnKeyType='next'
              editable='false'
            />

            <FormField
              // onChangeText={"W"}
              theme='min'
              placeholder="№ акта ИИ"
              keyboardtype="numeric"
              returnKeyType='next'
            />
          </View>

          <FormField
            title='Объект'
            returnKeyType='next'
          />

          <FormField
            theme='dropdown'
            title='Система'
            returnKeyType='next'
          />       
          
          <FormField
            title='Содержание замечания'
          />

          <Link href='/notes/add_photo' asChild>
            <Text style={{ marginBottom: 20, color: '#0000CD' }}>Фото</Text>
          </Link>

         

          <FormField
          title='Исполнитель'
          />
          
          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 0 }}>Дата выдачи</Text>
          <DateInputWithPicker />

          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Категория замечания</Text>
          <DropdownComponent2 />
          

          <View style={{
            width: 272, height: 40, justifyContent: 'center', alignContent: 'center'
            //alignItems: 'center', backgroundColor: 'powderblue',
          }}>
            <CustomButton
              title="Добавить замечание"
              handlePress={() => router.push('/(tabs)/two')} />
          </View>
        </View>
      </View>
    </ScrollView >
    //</SafeAreaView>

  );
}

const AlignContentLayout = () => {
  const [alignContent, setAlignContent] = useState('flex-start');

  const stylHead = StyleSheet.create({
    container: {
      marginLeft: 0,
      marginRight: 0,
      paddingVertical: 4,
      flex: 1,
      rowGap: 3,
    },
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

})