import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, Tabs, Redirect, router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DropdownComponent1 from '@/components/list_system';
import DropdownComponent2 from '@/components/list_categories';
import DateInputWithPicker from '@/components/calendar';
import DateInputWithPicker2 from '@/components/calendar+10';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { ResizeMode, Video } from 'react-native-video';


export default function createNote() {

  const [upLoading, setUpLoading] = useState(false);

  const [numberII, setNumber]=useState('');
  const [subObject, setSubObject]=useState('');
  const [systemName, setSystemName]=useState('');
  const [description, setDescription]=useState('');
  const [userName, setUserName]=useState('');
  const [startDate, setStartDate]=useState('');
  const [category, setCategory]=useState('');
  //const [text, setText]=useState('');

  const [form, setForm] = useState({
    video: null,
    image: null
  })
  const request = fetch('http://188.225.77.195:8080/', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        iiNumer: {numberII},
        subObject: {subObject},
        systemName: {systemName},
        description: {description},
        userName: {userName},
        startDate: {startDate},
        commentCategory: {category},
    })
  });

  //const submit = () => 

  return (

    <ScrollView>
      <View style={[styles.container]}>
        <View style={{
          flex: 1,
          alignItems: 'center',
        }}>


          <View style={{
            alignItems: 'center',
            width: '80%',
            flexDirection: 'row',
            justifyContent: 'space-between', paddingTop: 10
          }}>
            </View>
            <View>
                <TextInput  style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 11, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}

                    placeholder="№ акта ИИ"
                    placeholderTextColor="#111"
                    onChangeText={numberII => setNumber(numberII)}
                    defaultValue={numberII}
              />
            </View>

            <View>
                <TextInput  style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 11, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}

                    placeholder="Объект"
                    placeholderTextColor="#111"
                    
                    onChangeText={subObject => setSubObject(subObject)}
                    defaultValue={subObject}
                  />
            </View>

            <View>
                <TextInput  style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 11, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}

                    placeholder="Система"
                    placeholderTextColor="#111"
                    
                    onChangeText={systemName => setSystemName(systemName)}
                    defaultValue={systemName}
                  />
            </View>

            <View>
                <TextInput  style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 11, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}

                    placeholder="Содержание замечания"
                    placeholderTextColor="#111"
                    
                    onChangeText={description => setDescription(description)}
                    defaultValue={description}
                  />
            </View>


          <Link href='/notes/add_photo' asChild>
            <Text style={{ marginBottom: 20, color: '#0000CD' }}>Фото</Text>
          </Link>

          <TouchableOpacity>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }} />
            ) : (<View>
              <View>
              </View>
            </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity>
            {form.image ? (
              <Image
                source={{ uri: form.image.uri }} />
            ) : (<View>
              <View>
              </View>
            </View>
            )}
          </TouchableOpacity>

          <View>
                <TextInput  style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 11, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}

                    placeholder="Исполнитель"
                    placeholderTextColor="#111"
                    
                    onChangeText={userName => setUserName(userName)}
                    defaultValue={userName}
                  />
            </View>

            <View>
                <TextInput  style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 11, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}

                    placeholder="Дата выдачи"
                    placeholderTextColor="#111"
                    
                    onChangeText={startDate => setStartDate(startDate)}
                    defaultValue={startDate}
                  />
            </View>

            <View>
                <TextInput  style={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D9D9D9', width: 272, height: 40, paddingTop: 11, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, color: '#B3B3B3', textAlign: 'center', marginBottom: 20 }}

                    placeholder="Категория замечания"
                    placeholderTextColor="#111"
                    
                    onChangeText={category => setCategory(category)}
                    defaultValue={category}
                  />
            </View>

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
              handlePress={() =>{request; router.push('/(tabs)/two');}}
            //  isLoading={upLoading} 
            />
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