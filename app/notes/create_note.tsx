import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import DropdownComponent2 from '@/components/list_categories';
import DateInputWithPicker from '@/components/calendar';
import CustomButton from '@/components/CustomButton';
import { Video } from 'react-native-video';

export default function CreateNote() {
  const [upLoading, setUpLoading] = useState(false);
  const [numberII, setNumber] = useState('');
  const [subObject, setSubObject] = useState('');
  const [systemName, setSystemName] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [category, setCategory] = useState('');
  const [comExp, setComExp] = useState('');

  const [form, setForm] = useState({ video: null, image: null });

  const submitData = async () => {
    //if(numberII!='' && subObject!='' && systemName!='' && description!='' && userName!='' && category!='')
      { 
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/createComment', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iiNumber: numberII,
          subObject: subObject,
          systemName: systemName,
          description: description,
          commentStatus: "Не устранено",
          userName: userName,
          //startDate: startDate,
          startDate: "10.01.2025",
          //commentCategory: category,
          commentCategory: "Влияет",
          commentExplanation: comExp,
          codeCCS: "051-2000973.0023",
        }),
      });
      // Обработка ответа, если необходимо
      console.log('Response:', response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpLoading(false);
      router.push('/(tabs)/two'); 
    }}
   // else{
    //  Alert.alert('Ошибка при создании замечания', 'Для создания замечания должны быть заполнены следующие поля: номер АИИ, объект, система, содержание замечания, исполнитель и категория замечания.', [
     //   {text: 'OK', onPress: () => console.log('OK Pressed')},
      //])
   // }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>№ акта ИИ</Text>
          <TextInput
            style={styles.input}
            //placeholder="№ акта ИИ"
            placeholderTextColor="#111"
            onChangeText={setNumber}
            value={numberII}
          />

          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Объект</Text>
          <TextInput
            style={styles.input}
            //placeholder="Объект"
            placeholderTextColor="#111"
            onChangeText={setSubObject}
            value={subObject}
          />

          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Система</Text>
          <TextInput
            style={styles.input}
            //placeholder="Система"
            placeholderTextColor="#111"
            onChangeText={setSystemName}
            value={systemName}
          />

          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Содержание замечания</Text>
          <TextInput
            style={styles.input}
            //placeholder="Содержание замечания"
            placeholderTextColor="#111"
            onChangeText={setDescription}
            value={description}
          />
         {/* <Link href='/notes/add_photo' asChild>
            <Text style={{ marginBottom: 20, color: '#0000CD' }}>Фото</Text>
          </Link>
          <TouchableOpacity>
            {form.video ? (
              <Video source={{ uri: form.video.uri }} />
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity>
            {form.image ? (
              <Image source={{ uri: form.image.uri }} />
            ) : null}
          </TouchableOpacity>*/}

          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель</Text>
          <TextInput
            style={styles.input}
            //placeholder="Исполнитель"
            placeholderTextColor="#111"
            onChangeText={setUserName}
            value={userName}
          />
          {/*<TextInput
            style={styles.input}
            placeholder="Дата выдачи"
            placeholderTextColor="#111"
            onChangeText={setStartDate}
            value={startDate}
          />*/}
          
          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 0 }}>Дата выдачи</Text>
          
{ /*         <View style={{ flexDirection: 'row', width: '80%', height: 32, paddingTop: 6, }}>
          <TextInput
            style={styles.input}
            //placeholder="Исполнитель"
            placeholderTextColor="#111"
            onChangeText={setUserName}
          />*/}
          <DateInputWithPicker />
        { /* </View>*/}

          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Категория замечания</Text>
          <DropdownComponent2 />

{ /*         <TextInput
            style={styles.input}
            placeholder="Категория замечания"
            placeholderTextColor="#111"
            onChangeText={setCategory}
            value={category}
          />*/}

          <Text style={{ fontSize: 16, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Комментарий</Text>
          <TextInput
            style={styles.input}
           // placeholder="Комментарий"
            placeholderTextColor="#111"
            onChangeText={setComExp}
            value={comExp}/>

          <View style={{ width: 272, height: 40, justifyContent: 'center', alignContent: 'center' }}>
            <CustomButton
              title="Добавить замечание"
              handlePress={submitData} // Вызов функции отправки данных
             // isLoading={upLoading} // Можно добавить индикатор загрузки, если нужно
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
