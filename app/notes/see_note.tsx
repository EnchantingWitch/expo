import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Link, Tabs } from 'expo-router';
import DropdownComponent1 from '@/components/list_system';
import DropdownComponent2 from '@/components/list_categories';
import DateInputWithPicker from '@/components/calendar';
import DateInputWithPicker2 from '@/components/calendar+10';
import FormField from '@/components/FormField';

type Props = {
  commentId: number; //id замечания , генерируется на сервере
  serialNumber: string;//номер замечания
  subObject: string;
  systemName: string;
  description: string;
  commentStatus: string;
  commentCategory: string;
  startDate: string;
  endDatePlan: string;
  endDateFact: string;
  commentExplanation: string;//комментарий к замечанию
  //userName: string;//не увидела в бд у Сергея
  iinumber: string;//номер акта ИИ
};

export default function listOfNotes({ commentId, serialNumber, subObject, systemName, description, commentStatus, commentCategory, startDate, endDatePlan, endDateFact, commentExplanation, iinumber }: Props) {
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
            // backgroundColor: 'gray',
            alignItems: 'center',
            width: '80%',
            flexDirection: 'row',
            justifyContent: 'space-between', paddingTop: 10
          }}>
            
            <FormField
              // onChangeText={"W"}
              placeholder="№ замечания"
              keyboardtype="numeric"
              returnKeyType='next'
              theme='min'
              value={commentId}
            />
            

            <FormField
              // onChangeText={"W"}
              placeholder="№ акта ИИ"
              keyboardtype="numeric"
              returnKeyType='next'
              theme='min'
              value={iinumber}
            />
          </View>
          <Text>xnj {commentId}</Text>
          <FormField
            title='Объект'
            returnKeyType='next'
            value={subObject}
          />

          <FormField
            theme='dropdown'
            title='Система'
            returnKeyType='next'
            value={systemName}
          />       
          
          <FormField
            title='Содержание замечания'
            value={description}
          />

          <Link href='/notes/add_photo' asChild>
            <Text style={{ marginBottom: 20, color: '#0000CD' }}>Фото</Text>
          </Link>

          <FormField
          title='Статус'
          value={commentStatus}
          />

          <FormField
          title='Исполнитель'

          />

          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 0 }}>Дата выдачи</Text>
          <DateInputWithPicker keyboardType="number-pad" editable={false} />

          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 0 }}>Плановая дата устранения</Text>
          <DateInputWithPicker2
          />
          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Категория замечания</Text>
          <DropdownComponent2 />


          <View style={{
            width: 272, height: 40, justifyContent: 'center', alignContent: 'center'
            //alignItems: 'center', backgroundColor: 'powderblue',
          }}>
            <Link href='/(tabs)/two' asChild>
              <TouchableOpacity style={{ borderRadius: 8, backgroundColor: '#0072C8', width: 272, height: 40, paddingVertical: 8, alignSelf: 'center', marginBottom: 15 }}>
                <Text style={{ fontSize: 16, fontWeight: '400', color: '#F5F5F5', textAlign: 'center', }}>Сохранить</Text>
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
});
