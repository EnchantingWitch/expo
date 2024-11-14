import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Link, Tabs } from 'expo-router';
import DropdownComponent1 from '@/components/list_system';
import DropdownComponent2 from '@/components/list_categories';


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
            // backgroundColor: 'gray',
            alignItems: 'center',
            width: '80%',
            flexDirection: 'row',
            justifyContent: 'space-between', paddingTop: 10
          }}>

            <TextInput style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 123, height: 40, paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}
              // onChangeText={"W"}
              placeholder="№ замечания"
              keyboardType="numeric"
              returnKeyType='next'
              editable={false}
            />

            <TextInput style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 123, height: 40, paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}
              // onChangeText={"W"}
              placeholder="№ акта ИИ"
              keyboardType="numeric"
              returnKeyType='next'
              editable={false}
            />
          </View>


          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Объект</Text>
          <TextInput style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}

            returnKeyType='next'

          />
          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Система</Text>
          <DropdownComponent1 />

          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Содержание замечания</Text>
          <TextInput style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}

          //  keyboardType="text"
          />
          <Link href='/notes/add_photo' asChild>
            <Text style={{ marginBottom: 20 }}>Фото</Text>
          </Link>

          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Статус</Text>
          <TextInput style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}
          />
          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Исполнитель</Text>
          <TextInput style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}

          />
          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Дата выдачи</Text>
          <TextInput keyboardType="number-pad" style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}
            editable={false} />
          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Плановая дата устранения</Text>
          <TextInput keyboardType="number-pad" style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}
          /><Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Категория замечания</Text>
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
