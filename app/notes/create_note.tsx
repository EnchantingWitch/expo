import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Image, Alert, useWindowDimensions } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import DropdownComponent2 from '@/components/ListOfCategories';
import DateInputWithPicker from '@/components/CalendarOnWrite';
import DateInputWithPicker2 from '@/components/Calendar+';
import CustomButton from '@/components/CustomButton';
import { Video } from 'react-native-video';
import ImageViewer from '@/components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import ListOfSystem from '@/components/ListOfSystem';
import { Ionicons } from '@expo/vector-icons';
import { Structure } from '../(tabs)/structure';
import ListOfSubobj from '@/components/ListOfSubobj';

export default function CreateNote() {
  const [upLoading, setUpLoading] = useState(false);
  const [array, setArray] = useState<Structure[]>([]);//данные по структуре
  //const list = [];
  const [statusReq, setStatusReq] = useState(false);//для выпадающих списков, передача данных, когда True
  const [req, setReq] = useState(true);//ограничение на получение запроса только единижды (?)
  const [numberII, setNumber] = useState('');//прописать useEffect
  const [subObject, setSubObject] = useState('');
  const [systemName, setSystemName] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [category, setCategory] = useState('');
  const [comExp, setComExp] = useState('');
  const [planDate, setPlanDate] = useState(' ');//добавить в json
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

  const getStructure = async () => {
        try {
          const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/getStructureCommonInf/'+codeCCS);
          const json = await response.json();
          setArray(json);
          console.log('ResponseSeeStructure:', response);
          console.log(typeof(json));
        } catch (error) {
          console.error(error);
        } finally {
        }
      };
    
      useEffect(() => {
        if(codeCCS && req){getStructure(); setReq(false); }
        
      }, [codeCCS, req]);

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
          commentCategory: category,
          commentExplanation: comExp,
          codeCCS: codeCCS,
        }),
      });
      
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
      //alert(id);

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
      if(response.status === 200){
        Alert.alert('', 'Замечание добавлено', [
             {text: 'OK', onPress: () => console.log('OK Pressed')},
          ])
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpLoading(false);
      //  alert(id);
      router.replace({pathname: '/(tabs)/two', params: { codeCCS: codeCCS, capitalCSName: capitalCSName}});
    }
  }



  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center' }}>

          <View style={{flexDirection: 'row', width: '96%', alignSelf: 'center' }}>
            
            <View style={{width: '20%'}}>
              <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>№ АИИ</Text>
              <TextInput
                style={[styles.input, {alignContent: 'center'}]}
                //placeholder="№ акта ИИ"
                placeholderTextColor="#111"
                value={numberII}
                editable={false}
              />
            </View>

            <View style={{width: '83%'}}>
              <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Подобъект</Text>
              {/*<ListOfSubobj list={array}/>*/}
              <TextInput
                style={[styles.input, {justifyContent: 'center'}]}
                //placeholder="Объект"
                placeholderTextColor="#111"
                onChangeText={setSubObject}
                value={subObject}
              />
            </View>

          </View>

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, paddingTop: 6 }}>Система</Text>
          <ListOfSystem onChange={(system) => setSystemName(system)}/>

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Содержание замечания</Text>
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

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель</Text>
          <TextInput
            style={styles.input}
            //placeholder="Исполнитель"
            placeholderTextColor="#111"
            onChangeText={setUserName}
            value={userName}
          />

          <View style={{flexDirection: 'row',width: '100%',}}>{/* Объявление заголовков в строку для дат плана и факта передачи в ПНР */}
                <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Дата выдачи</Text>
                </View>

                <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Плановая дата</Text>
                </View>
          </View>

          <View style={{flexDirection: 'row',}}>
          <DateInputWithPicker theme = 'min' onChange={(dateString) => setStartDate(dateString)}/>{/* Дата выдачи*/}
          <DateInputWithPicker2 statusreq={true} post=' ' theme = 'min' onChange={(dateString) => setPlanDate(dateString)}/>{/* Дата плановая устранения*/}
          </View>

          
 
            <View style={{width: '100%', }}>
              {singlePhoto ? (
                <View style={{ marginBottom: 8, flexDirection: 'row', alignSelf: 'center'}}> 
                  <View style={{width: '50%'}}>
                    <Text style={{textAlign: 'center'}}>Фото выбрано</Text>
                  </View>
                  <View style={{width: '40%'}}>
                    <View > 
                      <Image
                      source={{ uri: singlePhoto }}
                      style={styles.image}
                      />
                    </View>
                  </View>
                  <View style={{width: '10%'}}>
                    <TouchableOpacity onPress={cancelPhoto}>
                      <Ionicons name='close-outline' size={30} ></Ionicons>
                    </TouchableOpacity>
                  </View>
                  
              </View>
              ) : (
              <View style={{ marginBottom: 8,  flexDirection: 'row'}}>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'center'}}>Фото не выбрано</Text>
                </View>
                <View style={{width: '48%'}}>
                  <TouchableOpacity onPress={selectPhoto} style={{alignSelf: 'flex-end', width: '20%'}}>
                    <Ionicons name='image-outline' size={30}></Ionicons>
                  </TouchableOpacity> 
                  </View>
              </View>
              )
              }
            </View>

           

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Категория замечания</Text>
          <DropdownComponent2 onChange ={(category) => setCategory(category)}/>


          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Комментарий</Text>
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
    
    height: 40,
    borderRadius: 4,
    //justifyContent: 'center'
    //alignItems: 'center',
    //left: 38
  },
});