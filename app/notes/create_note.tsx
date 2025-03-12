import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Image, Alert, useWindowDimensions, Modal } from 'react-native';
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
import { setSeconds } from 'date-fns';

export type ListToDrop = {
  label: string;
  value: string; 
};

export default function CreateNote() {
  const [upLoading, setUpLoading] = useState(false);
  const [array, setArray] = useState<Structure[]>([]);//данные по структуре
  const listSubObj = [];//список подобъектов из структуры
  const [noteListSubobj, setNoteListSubobj] = useState<boolean>(true);//ограничение на получение листа подобъектов только единожды 
  const listSystem = [];//список систем из структуры на соответствующий выбранный подобъект
  const [noteListSystem, setNoteListSystem] = useState<boolean>(false);//ограничение на отправку листа систем в компонент
  const [exit, setExit] = useState<boolean>(false);//если true нельзя создать замечание, проверка на наличие структуры - работает ли?
  const [statusReq, setStatusReq] = useState(false);//для выпадающих списков, передача данных, когда True
  const [req, setReq] = useState<boolean>(true);//ограничение на получение запроса только единожды 
  const [numberII, setNumber] = useState('');//прописать useEffect
  const [subObject, setSubObject] = useState('');
  const [systemName, setSystemName] = useState(' ');
  const [description, setDescription] = useState('');
  const [execut, setExecut] = useState('');
  const [userName, setUserName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [category, setCategory] = useState('');
  const [comExp, setComExp] = useState('');
  const [planDate, setPlanDate] = useState(' ');//добавить в json
  //const [id, setId] = useState('0');
  const [inputHeight, setInputHeight] = useState(40);
  const [bufsubobj, setBufsubobj] = useState('');
  const [bufsubobjS, setBufsubobjS] = useState('');
  const [bufsystem, setBufsystem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);//для открытия фото полностью
  const [click, setClick] = useState(false);//

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)
  };

  console.log(systemName, 'systemName every');

  const {codeCCS} = useLocalSearchParams();//получение codeCCS объекта
  const {capitalCSName} = useLocalSearchParams();
  

  const [form, setForm] = useState({ video: null, image: null });

  const TwoFunction = () => {

      if(systemName != bufsystem){
        setBufsystem(systemName);
      console.log(systemName, 'systemName: use if(systemName )');
      if (systemName != ' ' ){
        const filtered = array.filter(item => item.subObjectName === subObject);
        console.log(filtered[0].data);
        const filteredS = filtered[0].data.filter(item => item.systemName === systemName);
       // console.log(filteredS[0].numberII, 'filteredS[0].numberII');
        console.log(filteredS.length, 'filteredS.length');
        console.log(filteredS, 'filteredS');
        if(filteredS.length != 0){
          console.log('1');
          setNumber(filteredS[0].numberII);
          setExecut(filteredS[0].ciwexecutor);
        }
        else{
          setNumber('');
          setExecut('');
          setSystemName(' ');
        }
       // if(filteredS[0].ciwexecutor){
        setNoteListSystem(false);
        //}
      }
      }  
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
  //console.log(noteListSystem);
 // console.log(noteListSystem);
  const getStructure = async () => {
        try {
          const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/getStructureCommonInf/'+codeCCS);
          const json = await response.json();
          setArray(json);
          console.log('ResponseSeeStructure:', response);
          console.log(typeof(json));
          console.log('array of subobj',array);
          if (response.status === 200){
            setStatusReq(true);//для выпадающего списка
          }
          if(response.status != 200){setExit(true); }
        } catch (error) {
          console.error(error);
        } finally {
          
          {/*if(exit){Alert.alert('', 'Необходимо загрузить данные в структуру', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
         ]); 
         router.replace({pathname: '/(tabs)/two', params: { codeCCS: codeCCS, capitalCSName: capitalCSName}});
        }*/}
        }
      };
     
  //console.log('noteListSubobj', noteListSubobj);

  useEffect(() => {
    //запрос на структура для получение данных на выпадающие списки и прочее
    if(codeCCS && req){getStructure(); setReq(false); console.log('8'); }//вызов происходит только один раз
    //формирование выпадающего списка для подобъекта
    if(statusReq && noteListSubobj){//вызов происходит только один раз
      setNoteListSubobj(false);
      const buf = array.map(item => ({label: item.subObjectName, value: item.subObjectName}));
      listSubObj.push(...buf);
      //console.log('listSubObj', listSubObj);
     // setNoteListSystem(false); //ограничение на отправку листа систем в компонент
    }
    //формирование выпадающего списка для системы после того как выбран подобъект
    if (subObject ){
      //setSystemName(' '); //setExecut(''); setNumber(''); 
     // console.log('noteListSystem',noteListSystem);
    // setNoteListSystem(false);
      const filtered = array.filter(item => item.subObjectName === subObject);
      console.log(filtered[0].data);
      for (const pnrsystemId in filtered[0].data) {
       
          const buf = filtered.map(item => ({label: item.data[pnrsystemId].systemName, value:  item.data[pnrsystemId].systemName}));
          console.log('listSystem',buf);

          listSystem.push(...buf);
         // console.log('listSystem',listSystem);
         // console.log('noteListSystem map',noteListSystem);
          //setNoteListSystem(true);
         // setSystemName(' ');
      }  

      if(subObject != bufsubobj){ //это работает, но после каждого обновления subObject в systemName попадает с кеша(?) последнее значение
        console.log('2');
        setSystemName('');
        setNumber('');
        setExecut('');
        setBufsubobj(subObject);
      }
      //если была выбран другой подобъект очистить значение у системы, АИИ, исполнителя
      //if(listSystem){setSystemName(''); setExecut(''); setNumber('');     }

      //setNoteListSystem(true);//передаем статус true в компонент для рендеринга после формирования списка
    }
    if (numberII && execut){
      submitData();
    }
    
    /*if(click === true && systemName!= ' ' && subObject != '' ){
      
      if(systemName != bufsystem){
        setBufsystem(systemName);
      console.log(systemName, 'systemName: use if(systemName )');
      if (systemName != ' ' ){
        const filtered = array.filter(item => item.subObjectName === subObject);
        console.log(filtered[0].data);
        const filteredS = filtered[0].data.filter(item => item.systemName === systemName);
       // console.log(filteredS[0].numberII, 'filteredS[0].numberII');
        console.log(filteredS.length, 'filteredS.length');
        console.log(filteredS, 'filteredS');
        if(filteredS.length != 0){
          console.log('1');
          setNumber(filteredS[0].numberII);
          setExecut(filteredS[0].ciwexecutor);
        }
        else{
          setNumber('');
          setExecut('');
          setSystemName(' ');
        }
       // if(filteredS[0].ciwexecutor){
        setNoteListSystem(false);
        //}
      }
      }  

      if (numberII != '' && execut != ''){
        submitData();
      }
     
    }*/
        
  }, [codeCCS, req, statusReq, noteListSubobj, subObject, systemName, numberII, execut]);

  const submitData = async () => {

    try {
      let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/createComment', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //iiNumber: '1',
          iiNumber: numberII,
          subObject: subObject,
          //systemName: 'Сети связи',
          systemName: systemName,
          description: description,
          commentStatus: "Не устранено",
          executor: execut,
          userName: 'userName',
          startDate: startDate,
          commentCategory: category,
          commentExplanation: comExp,
          codeCCS: codeCCS,
          endDatePlan: planDate,
          endDateFact: ' '
        }),
      });
      
      const id = await response.text()

      // Обработка ответа, если необходимо
      console.log(id);
      let numId = Number(id);
      console.log(numId);
      //setId(id);
      //не выводится в консоль
      console.log('ResponseCreateNote:', response);
      
      //Тут добавила
      const photoToUpload = singlePhoto;
      const body = new FormData();
      //data.append('name', 'Image Upload');
      body.append("photo", {
        uri: photoToUpload,
        type: 'image/*',
        name: 'photoToUpload'
      })
      console.log(body);
      for (let [key, value] of body) {
        console.log(key);
        console.log(value);
    }
    console.log(singlePhoto.uri, 'singlePhoto');
    console.log(photoToUpload.uri, 'photoToUpload');
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

           {/*}   <View style={{flexDirection: 'row', width: '96%', alignSelf: 'center' }}>
        
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

            <View style={{width: '83%'}}>*/}
            <View style={{width: '100%', alignItems: 'center'}}>
              <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Подобъект</Text>
              <ListOfSubobj post = {subObject} list={listSubObj} statusreq={statusReq} onChange = {(subObj) => setSubObject(subObj)}/>
             
            </View>

          {/*</View>*/}

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, paddingTop: 6 }}>Система</Text>
          <ListOfSystem post = {systemName} subobj={subObject} list={listSystem} statusreq={noteListSystem} onChange = {(subObj) => setSystemName(subObj)}/>
          {/*<ListOfSystem onChange={(system) => setSystemName(system)}/>*/}

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Содержание замечания</Text>
          <TextInput
            style={[styles.input,  {flex: 1, height: Math.max(42, inputHeight) }]} // Минимальная высота 40
            multiline
            onContentSizeChange={e=>{
              let inputH = Math.max(e.nativeEvent.contentSize.height, 35)
              if(inputH>120) inputH =100
              setInputHeight(inputH)
          }}
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

         {/*} <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель</Text>
          <TextInput
            style={styles.input}
            //placeholder="Исполнитель"
            placeholderTextColor="#111"
            onChangeText={setExecut}
            value={execut}
            editable={false}
          />*}

          
          {/* Объявление заголовков в строку для дат плана и факта передачи в ПНР */}
                <View style={{flexDirection: 'row',width: '100%',}}>
                  <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Дата выдачи</Text>
                </View>

                <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Плановая дата</Text>
                </View>
          </View>

          <View style={{flexDirection: 'row',}}>
          <DateInputWithPicker theme = 'min' onChange={(dateString) => setStartDate(dateString)}/>{/* Дата выдачи*/}
          <DateInputWithPicker2 statusreq={true} post={planDate} theme = 'min' onChange={(dateString) => setPlanDate(dateString)}/>{/* Дата плановая устранения*/}
          </View>

          
 
            <View style={{width: '100%', }}>
              {singlePhoto ? (
                <View style={{ marginBottom: 8, flexDirection: 'row', alignSelf: 'center'}}> 
                  <View style={{width: '48%', alignSelf: 'center'}}>
                    <Text style={{textAlign: 'center'}}>Фото выбрано</Text>
                  </View>
                  <View style={{width: '33%'}}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}> 
                      <Image
                      source={{ uri: singlePhoto }}
                      style={styles.image}
                      />
                    </TouchableOpacity>

                    <Modal
                    animationType="slide" // Можно использовать 'slide', 'fade' или 'none'
                    transparent={true} // Установите true, чтобы сделать фон полупрозрачным
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)} // Для Android
                    >
                    <View style={styles.modalContainer}>
                      
                      <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style = {{alignSelf: 'flex-end', }}>
                          <Ionicons name='close-outline' size={30} />
                        </TouchableOpacity>
                        <Image
                        source={{ uri: singlePhoto }}
                      style={styles.imageModal}
                      />
                      </View>
                    </View>
                  </Modal>

                  </View>
                  <View style={{width: '10%', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={cancelPhoto}  style = {{alignSelf: 'flex-end', width: '70%', }}>
                      <Ionicons name='close-outline' size={30} />
                    </TouchableOpacity>
                  </View>
                  
              </View>
              ) : (
              <View style={{ marginBottom: 8,  flexDirection: 'row'}}>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'center'}}>Фото не выбрано</Text>
                </View>
                <View style={{width: '46%'}}>
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
            
          </View>
        </View><CustomButton
              title="Добавить замечание"
              handlePress={TwoFunction} // Вызов функции отправки данных
            // isLoading={upLoading} // Можно добавить индикатор загрузки, если нужно
            />
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
    //width: '100%',
    height: 42,
    borderRadius: 8,
    //justifyContent: 'center'
    //alignItems: 'center',
    //left: 38
  },
  imageModal: {
    height: '90%',
    width: '90%',
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
    
  },
  modalContent: {
    width: 300,
    height: 430,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    
  },
});