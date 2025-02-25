import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Image, Alert, useWindowDimensions } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import DropdownComponent2 from '@/components/ListOfCategories';
import DateInputWithPicker from '@/components/CalendarOnWrite';
import CustomButton from '@/components/CustomButton';
import { Video } from 'react-native-video';
import ImageViewer from '@/components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import ListOfSystem from '@/components/ListOfSystem';

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
  //const [id, setId] = useState('0');

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)
  };
  console.log(startDate);

  const {codeCCS} = useLocalSearchParams();//получение codeCCS объекта
  const {capitalCSName} = useLocalSearchParams();

  const [form, setForm] = useState({ video: null, image: null });

  const TwoFunction = () => {
    submitData();
    //setTimeout( uploadImage, 1000);
    //uploadImage(id);
  };

  const [singlePhoto, setSinglePhoto] = useState<any>('');


  const selectPhoto = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await ImagePicker.launchImageLibraryAsync({

      });
      // Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      if (res.assets && res.assets[0].uri) {
        setSinglePhoto(res.assets[0].uri)
      }
      // Setting the state to show single file attributes

    } catch (err) {
      setSinglePhoto('');
      // Handling any exception (If any)
      if (ImagePicker.Cancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const cancelPhoto = async () => {
    setSinglePhoto('');
  };

  const submitData = async () => {
    //if(numberII!='' && subObject!='' && systemName!='' && description!='' && userName!='' && category!='')

    try {
      let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/createComment', {
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
          startDate: startDate,
          //startDate: "10.01.2025",
          commentCategory: category,
          //commentCategory: "Влияет",
          commentExplanation: comExp,
          codeCCS: codeCCS,
        }),
      });
      console.log(JSON.stringify({
        iiNumber: numberII,
        subObject: subObject,
        systemName: systemName,
        description: description,
        commentStatus: "Не устранено",
        userName: userName,
        startDate: startDate,
        //startDate: "10.01.2025",
        commentCategory: category,
        //commentCategory: "Влияет",
        commentExplanation: comExp,
        codeCCS: "051-2000973.0023",
      }));
      const id = await response.text()

      // Обработка ответа, если необходимо
      console.log(id);
      let numId = Number(id);
      console.log(numId);
      //setId(id);
      //не выводится в консоль
      console.log('Response:', response);

      //Тут добавила
      const photoToUpload = singlePhoto;
      const body = new FormData();
      //data.append('name', 'Image Upload');
      body.append("photo", {
        uri: photoToUpload.uri,
        type: 'image/*',
        name: 'photoToUpload'
      })
      //body.append("photo", photoToUpload);
      // Please change file upload URL
      alert(id);

      let str = String('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/uploadPhotos/' + id);
      console.log(str);

      let res = await fetch(
        str,
        {
          method: 'post',
          body: body,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log('ResponsePhoto:', res);
      /* let responseJson = await res.json();
       if (responseJson.status == 1) {
         alert('Upload Successful');
       }*/
      //до сюда
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpLoading(false);
      //  alert(id);
      router.replace({pathname: '/(tabs)/two', params: { codeCCS: codeCCS, capitalCSName: capitalCSName}});
    }


    // else{
    //  Alert.alert('Ошибка при создании замечания', 'Для создания замечания должны быть заполнены следующие поля: номер АИИ, объект, система, содержание замечания, исполнитель и категория замечания.', [
    //   {text: 'OK', onPress: () => console.log('OK Pressed')},
    //])
    // }

    /*   try {
         // Check if any file is selected or not
   
         // If file selected then create FormData
         const photoToUpload = singlePhoto;
         const body = new FormData();
         //data.append('name', 'Image Upload');
         body.append("photo", {
           uri: photoToUpload.uri,
           type: 'photo',
           name: 'photoToUpload'
         })
         //body.append("photo", photoToUpload);
         // Please change file upload URL
         alert(id);
   
   
         let res = await fetch(
           'https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/uploadPhotos/' + id,
           {
             method: 'post',
             body: body,
             headers: {
               'Content-Type': 'multipart-form/data'
             }
           }
         );
         console.log('ResponsePhoto:', res);
         let responseJson = await res.json();
         if (responseJson.status == 1) {
           alert('Upload Successful');
         }
       } catch (error) {
         console.error('Error:', error);
       }
       finally { router.push('/(tabs)/two'); 
   
       }*/

  }



  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>№ акта ИИ</Text>
          <TextInput
            style={styles.input}
            //placeholder="№ акта ИИ"
            placeholderTextColor="#111"
            onChangeText={setNumber}
            value={numberII}
          />
          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Объект</Text>
          <TextInput
            style={styles.input}
            //placeholder="Объект"
            placeholderTextColor="#111"
            onChangeText={setSubObject}
            value={subObject}
          />


          <View >
            {singlePhoto ? (
              <View style={{ paddingVertical: 8 }}>

                <View> <Image
                  source={{ uri: singlePhoto }}
                  style={styles.image}
                /></View>

                <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>
                  Выбрано фото: {singlePhoto.fileName}</Text>

                <CustomButton
                  title="Удалить фото"
                  handlePress={cancelPhoto}
                />

              </View>
            ) : (
              <View style={{ paddingVertical: 8 }}>

                <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Фото не выбрано</Text>

                <CustomButton
                  title="Выбрать фото"
                  handlePress={selectPhoto}
                />

              </View>
            )
            }
          </View>

          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, paddingTop: 6 }}>Система</Text>
          <ListOfSystem onChange={(system) => setSystemName(system)}/>
        {/*}  <TextInput
            style={styles.input}
            //placeholder="Система"
            placeholderTextColor="#111"
            onChangeText={setSystemName}
            value={systemName}
          />*/}

          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Содержание замечания</Text>
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

          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель</Text>
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

          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 0 }}>Дата выдачи</Text>

          { /*         <View style={{ flexDirection: 'row', width: '80%', height: 32, paddingTop: 6, }}>
          <TextInput
            style={styles.input}
            //placeholder="Исполнитель"
            placeholderTextColor="#111"
            onChangeText={setUserName}
          />*/}
          <DateInputWithPicker onChange ={(currentDate) => setStartDate(currentDate)}/>
          { /* </View>*/}

          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Категория замечания</Text>
          <DropdownComponent2 onChange ={(category) => setCategory(category)}/>

          { /*         <TextInput
            style={styles.input}
            placeholder="Категория замечания"
            placeholderTextColor="#111"
            onChangeText={setCategory}
            value={category}
          />*/}

          <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Комментарий</Text>
          <TextInput
            style={styles.input}
            // placeholder="Комментарий"
            placeholderTextColor="#111"
            onChangeText={setComExp}
            value={comExp} />

          <View style={{ width: 272, height: 40, justifyContent: 'center', alignContent: 'center' }}>
            <CustomButton
              title="Добавить замечание"
              handlePress={TwoFunction} // Вызов функции отправки данных
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    left: 38
  },
});