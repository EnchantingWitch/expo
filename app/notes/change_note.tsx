import React, { useState, useEffect } from 'react';
import { Text, View, Image, TextInput, Button, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert, useWindowDimensions } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { router, Link, Tabs, useLocalSearchParams } from 'expo-router';
import DropdownComponent2 from '@/components/ListOfCategories';
import { styles } from './create_note';
import * as ImagePicker from 'expo-image-picker';
import ListOfSubobj from '@/components/ListOfSubobj';
import ListOfSystem from '@/components/ListOfSystem';
import Calendar from '@/components/Calendar+';
import CalendarWithoutDel from '@/components/CalendarWithoutDel';
import { Structure } from '../(tabs)/structure';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Data {
  commentId: number;
  serialNumber: number;
  subObject: string;
  systemName: string;
  description: string;
  commentStatus: string;
  commentCategory: string;
  startDate: string;
  endDatePlan: string;
  endDateFact: string;
  commentExplanation: string;
  iinumber: number;
  UserName: string
}

const EditDataScreen: React.FC = () => {
    const {serialNumb} = useLocalSearchParams();
    const {numberii} = useLocalSearchParams();
    const {subobj} = useLocalSearchParams();
    const {system} = useLocalSearchParams();
    const {comment} = useLocalSearchParams();
    const {status} = useLocalSearchParams();
    const {executor} = useLocalSearchParams();
    const {startD} = useLocalSearchParams();
    const {planD} = useLocalSearchParams();
    const {factD} = useLocalSearchParams();
    const {category} = useLocalSearchParams();
    const {explan} = useLocalSearchParams();
    const {id} = useLocalSearchParams();
    const {codeCCS} = useLocalSearchParams();
    const {capitalCSName} = useLocalSearchParams();

    const [accessToken, setAccessToken] = useState<any>('');
 
    const [array, setArray] = useState<Structure[]>([]);//данные по структуре
    const listSubObj = [];//список подобъектов из структуры
    const [noteListSubobj, setNoteListSubobj] = useState<boolean>(true);//ограничение на получение листа подобъектов только единожды 
    const listSystem = [];//список систем из структуры на соответствующий выбранный подобъект
    const [noteListSystem, setNoteListSystem] = useState<boolean>(false);//ограничение на отправку листа систем в компонент
    const [exit, setExit] = useState<boolean>(false);//если true нельзя создать замечание, проверка на наличие структуры - работает ли?
    const [statusReq, setStatusReq] = useState(false);//для выпадающих списков, передача данных, когда True
    const [statusReqPhoto, setStatusReqPhoto] = useState(false);//для определения метода put или delete для фото, было ли фото уже в бд или нет
    const [changePhoto, setChangePhoto] = useState(false);//для определения метода post на фото, равен true, если было выбрано фото через selectPhoto
    const [req, setReq] = useState<boolean>(true);//ограничение на получение запроса только единожды 
    const [statusDel, setStatusDel] = useState<boolean>(false);//
    const [inputHeight, setInputHeight] = useState(42);
    const [bufsubobj, setBufsubobj] = useState(subobj);
    const [bufsystem, setBufsystem] = useState('');
    const [idPhoto, setIdPhoto] = useState();

  const [data, setData] = useState<Data | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [editedSerialNumber, setEditedSerialNumber] = useState<number>(0);
  const [editedSubObject, setEditedSubObject] = useState<string>('');
  const [editedSystemName, setEditedSystemName] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [editedCommentStatus, setEditedCommentStatus] = useState<string>('');
  const [editedCommentCategory, setEditedCommentCategory] = useState<string>('');
  const [editedStartDate, setEditedStartDate] = useState<string>('');
  const [editedEndDatePlan, setEditedEndDatePlan] = useState<string>('');
  const [editedEndDateFact, setEditedEndDateFact] = useState<string>('');
  const [editedCommentExplanation, setEditedCommentExplanation] = useState<string>('');
  const [editedUserName, setEditedUserName] = useState<string>('editedUserName');
  const [editedIinumber, setEditedIinumber] = useState<string>('');
  const [editedExecut, setExecut] = useState<string>('');//исполнитель
  const [noteData, setNoteData] = useState<boolean>(true);
  const [updateCom, setUpdateCom] = useState<boolean>(false);//вызов функции запроса после изменения АИИ и исполнителя
  const bufCommentStat = status;//хранит статус замечания из бд, чтобы вывести его в случае отмены выбранной даты устранения (изначально пустой)
  
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);//для открытия фото полностью
  
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  if(codeCCS && noteData){
    setNoteData(false);
    setEditedSerialNumber(serialNumb);
    setEditedIinumber(numberii);
    setEditedSubObject(subobj);
    setBufsubobj(subobj);
    setEditedSystemName(system);
    setBufsystem(system);
    setEditedDescription(comment);
    setEditedCommentStatus(status);
    setExecut(executor);
    setEditedStartDate(startD);
    setEditedEndDatePlan(planD);
    setEditedEndDateFact(factD);
    setEditedCommentCategory(category);
    setEditedCommentExplanation(explan);
  }
  const [singlePhoto, setSinglePhoto] = useState<any>('');

  const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        //setAccessToken(token);
        if (token !== null) {
            console.log('Retrieved token:', token);
            setAccessToken(token);
            //вызов getAuth для проверки актуальности токена
            //authUserAfterLogin();
        } else {
            console.log('No token found');
            router.push('/sign/sign_in');
        }
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
};

  const selectPhoto = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({});
      console.log('res : ' + JSON.stringify(res));
      if (!res.canceled && res.assets[0].uri) {
        setSinglePhoto(res.assets[0].uri);
        setChangePhoto(true);
      }
    } catch (err) {
      setSinglePhoto('');
      setChangePhoto(false);
      if (ImagePicker.Cancel(err)) {
        alert('Canceled');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const cancelPhoto = async () => {
    setSinglePhoto('');
  };

  console.log(statusReqPhoto === false && singlePhoto != '', 'statusReqPhoto === false && singlePhoto != ');
  console.log(statusReqPhoto === true && singlePhoto === '', 'statusReqPhoto === true && singlePhoto === ');
  console.log(changePhoto === true && statusReqPhoto === true, 'changePhoto === true && statusReqPhoto === true');
  console.log(statusDel === true, 'statusDel === true');
  console.log(updateCom, 'UpdateCom');

  const handleSaveClick = async () => {
   // if(editedSystemName && editedSubObject){
      
    //  if(editedSystemName != bufsystem){
      //  setBufsystem(editedSystemName);
      //console.log(editedSystemName, 'systemName: use if(systemName )');
     /* if (editedSystemName != ' ' ){
        const filtered = array.filter(item => item.subObjectName === editedSubObject);
        //console.log(filtered[0].data);
        if(filtered.length != 0){
          const filteredS = filtered[0].data.filter(item => item.systemName === editedSystemName);
        // console.log(filteredS[0].numberII, 'filteredS[0].numberII');
          console.log(filteredS.length, 'filteredS.length');
          console.log(filteredS, 'filteredS');
          if(filteredS.length != 0){
            console.log('1');
            setEditedIinumber(filteredS[0].numberII);
            setExecut(filteredS[0].ciwexecutor);
            setUpdateCom(true);
          }
          else{
            setEditedIinumber('');
            setExecut('');
            setEditedSystemName(' ');
            setEditedSubObject(' ');
          }
        // if(filteredS[0].ciwexecutor){
         // setNoteListSystem(false);
      }
        //}
     // }
   //   }  
     
    }*/

    updateComment();
    if (statusReqPhoto === false && singlePhoto != ''){postPhoto();}
    if (statusReqPhoto === true && singlePhoto === ''){deletePhoto();}
    if (changePhoto === true && statusReqPhoto === true){
        deletePhoto;
        if (statusDel === true){postPhoto;}//скорее всего надо в useEffect перенести
    }
    
  }

const json = JSON.stringify({
        commentId: parseInt(id, 10),
        serialNumber: parseInt(editedSerialNumber, 10),
        subObject: editedSubObject,
        systemName: editedSystemName,
        description: editedDescription,
        commentStatus: editedCommentStatus,
        commentCategory: editedCommentCategory,
        startDate: editedStartDate,
        endDatePlan: editedEndDatePlan,
        endDateFact: editedEndDateFact,
        commentExplanation: editedCommentExplanation,
        iiNumber: editedIinumber,
        executor: editedExecut,
      });
      console.log(json);
  const updateComment = async () => {
    
    try {
      let response = await fetch(`https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/updateComment/`+id, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: json,
      });
      console.log('updateComment', response);
      if (response.ok) {
        const jsonData: Data = await response.json();
        setData(jsonData);
        setEditing(false);
        alert('Данные успешно сохранены!');
      } else {
        throw new Error('Не удалось сохранить данные.');
      }
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    } finally{
      router.replace({pathname: '/(tabs)/two', params: {codeCCS: codeCCS, capitalCSName: capitalCSName }});
    }

  };

  /*if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }*/

  const getStructure = async () => {
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/getStructureCommonInf/'+codeCCS,
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }}
      );
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
    }

    //getPhoto
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/downloadPhoto/' + id,
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }}
      );
      const json = await response.json();
      console.log('ResponseGetPhoto:', response);
      console.log('ResponseGetPhoto json:', json);
      //setBytes(json.bytes);
      //setContentType(json.contentType);
      //setStatusReqPhoto(true);
      setSinglePhoto(`data:${json.contentType};base64,${json.bytes}`);
      console.log(singlePhoto);
      setStatusReqPhoto(true);
      setIdPhoto(json.id);
      console.log('json.id', json.id);
    } catch (error) {
      console.error('Ошибка при получении фото:', error);
      //setStatusReq(false);
    } finally {

    }
  };

  const putPhoto = async () => {
    try{
      const photoToUpload = singlePhoto;
      const body = new FormData();
      body.append("photo", {
        uri: photoToUpload,
        type: 'image/*',
        name: 'photoToUpload'
      })
      let str = String('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/uploadPhotos/' + id);
      console.log(str);
      let res = await fetch(
        str,
        {
          method: 'PUT',
          body: body,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log('ResponsePhoto:', res);
      } catch (error) {
        console.error('Error:', error);
      }
  }

  const deletePhoto = async () => {
    try {
      let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/delePhotoById/'+idPhoto, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          //без headers 404
           // 'Content-Type': 'application/json', //404
            //'Content-Type': 'multipart/form-data' //500
            //'Content-Type': 'text/plain' //404
        },
      });
    console.log('deletePhoto', response);
    if (response.status === 200) {setStatusDel(true);}
  } catch (err) {
  }
}

  const postPhoto = async () => {
    try{
    const photoToUpload = singlePhoto;
    const body = new FormData();
          //data.append('name', 'Image Upload');
    body.append("photo", {
      uri: photoToUpload,
      type: 'image/*',
      name: 'photoToUpload'
    })
   /* console.log(body);
    for (let [key, value] of body) {
       console.log(key);
      console.log(value);
    }
    console.log(singlePhoto.uri, 'singlePhoto');
    console.log(photoToUpload.uri, 'photoToUpload');
*/
    let str = String('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/uploadPhotos/' + id);
    console.log(str);
    
    let res = await fetch(
      str,
      {
        method: 'post',
        body: body,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    console.log('postPhoto:', res);
          
          //до сюда
          /*if(response.status === 200){
            Alert.alert('', 'Замечание добавлено', [
                 {text: 'OK', onPress: () => console.log('OK Pressed')},
              ])
          }*/
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    getToken();
      //смена статуса при изменении даты
        if (editedEndDateFact) {
          if(editedEndDateFact != ' '){
            setEditedCommentStatus('Устранено');   
          } else {
            setEditedCommentStatus(bufCommentStat);
          }
      }
    //запрос на структура для получение данных на выпадающие списки и прочее
    if(codeCCS && req && accessToken){getStructure(); setReq(false); console.log('8'); }//вызов происходит только один раз
    //формирование выпадающего списка для подобъекта
    if(statusReq && noteListSubobj){//вызов происходит только один раз
      setNoteListSubobj(false);
      setIsDataLoaded(false); 
      
      const buf = array.map(item => ({label: item.subObjectName, value: item.subObjectName}));
      listSubObj.push(...buf);
      //setStatusReq(true);
      console.log(buf, 'listSubObj');
      setIsDataLoaded(true);
    }
    //формирование выпадающего списка для системы после того как выбран подобъект
     if (editedSubObject ){

      const filtered = array.filter(item => item.subObjectName === editedSubObject);
      console.log(filtered.length, 'filtered.length');
      if(filtered.length != 0){
        for (const pnrsystemId in filtered[0].data) {
        
            const buf = filtered.map(item => ({label: item.data[pnrsystemId].systemName, value:  item.data[pnrsystemId].systemName}));
            console.log('listSystem',buf);
            listSystem.push(...buf);

        }  
      }

      if(editedSubObject != bufsubobj){ //это работает, но после каждого обновления subObject в systemName попадает с кеша(?) последнее значение
        console.log('2');
        setEditedSystemName('');
        setEditedIinumber('');
        setExecut('');
        setBufsubobj(editedSubObject);
      }
      
    }
    if (updateCom){
      updateComment();
    }
    if(editedSystemName){
      setBufsystem(editedSystemName);
    }
    
  /*  if(editedSubObject){
      const filtered = array.filter(item => item.subObjectName === editedSubObject);
      console.log(filtered.length, 'filtered.length');
      if(filtered.length != 0){
        for (const pnrsystemId in filtered[0].data) {
        
            const buf = filtered.map(item => ({label: item.data[pnrsystemId].systemName, value:  item.data[pnrsystemId].systemName}));
            console.log('listSystem',buf);
            listSystem.push(...buf);
 
        }  
      }
      if(editedSubObject != bufsubobj){ //это работает, но после каждого обновления subObject в systemName попадает с кеша(?) последнее значение
        console.log('2');
        setEditedSystemName('');
        setEditedIinumber('');
        setExecut('');
        setBufsubobj(editedSubObject);
      }
    }*/
   /* if (editedSystemName!= ' ' && editedSubObject!= ''){
      const filtered = array.filter(item => item.subObjectName === editedSubObject);
        //console.log(filtered[0].data);
        if(filtered.length != 0){
          const filteredS = filtered[0].data.filter(item => item.systemName === editedSystemName);
        // console.log(filteredS[0].numberII, 'filteredS[0].numberII');
          console.log(filteredS.length, 'filteredS.length');
          console.log(filteredS, 'filteredS');
          if(filteredS.length != 0){
            console.log('1');
            setEditedIinumber(filteredS[0].numberII);
            setExecut(filteredS[0].ciwexecutor);
            setEditedSystemName(filteredS[0].systemName);
          }
        }
    }*/
    if(editedSystemName!= ' ' && editedSubObject!= '' ){
      
      if(editedSystemName != bufsystem){
        setBufsystem(editedSystemName);
      console.log(editedSystemName, 'systemName: use if(systemName )');
      if (editedSystemName != ' ' ){
        const filtered = array.filter(item => item.subObjectName === editedSubObject);
        //console.log(filtered[0].data);
        if(filtered.length != 0){
          const filteredS = filtered[0].data.filter(item => item.systemName === editedSystemName);
        // console.log(filteredS[0].numberII, 'filteredS[0].numberII');
          console.log(filteredS.length, 'filteredS.length');
          console.log(filteredS, 'filteredS');
          if(filteredS.length != 0){
            console.log('1');
            setEditedIinumber(filteredS[0].numberII);
            setExecut(filteredS[0].ciwexecutor);
          }
          else{
            setEditedIinumber('');
            setExecut('');
            setEditedSystemName(' ');
            setEditedSubObject('');
          }
        // if(filteredS[0].ciwexecutor){
          setNoteListSystem(false);
      }
        //}
      }
      }  
     
    }
      }, [ accessToken, editedEndDateFact, codeCCS, req, statusReq, noteListSubobj, editedSubObject, editedSystemName, updateCom, editedSystemName]);


  return (
    <ScrollView style={[styles.container]}>
      <SafeAreaView>
        <View style={[styles.container]}>


          <>
            <View style={[styles.container]}>

              <View style={{ flex: 1, alignItems: 'center' }}>

              <View style={{flexDirection: 'row', width: '98%', marginBottom: 0 }}>
            <View style={{width: '20%', alignItems: 'center'}}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>№</Text>
            </View>

           {/*} <View style={{width: '20%', alignItems: 'center'}}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center'}}>№ АИИ</Text>
            </View>*/}

            <View style={{width: '80%', alignItems: 'center'}}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center'}}>Подобъект</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', width: '98%', marginBottom: 0 }}>
             
            <View style={{width: '20%', alignItems: 'center'}}>
            <TextInput
            style={[styles.input, {fontSize: ts(14), marginTop: 6}]}
            //placeholder="№ акта ИИ"
            placeholderTextColor="#111"
            value={editedSerialNumber.toString()}
            editable={false}
            />
            </View>

           {/*} <View style={{width: '20%', alignItems: 'flex-end'}}>
            <TextInput
            style={[styles.input, {fontSize: ts(14),marginTop: 6}]}
            placeholderTextColor="#111"
            value={editedIinumber}
            editable={false}
            />
            </View>*/}

            <View style={{width: '80%', alignItems: 'center', paddingTop: 6}}>
            {/*<TextInput
            style={[styles.input, ]}
            placeholderTextColor="#111"
            value={editedSubObject}
            editable={false}
            />*/}
           {/*} <ListOfSubobj list={listSubObj} post={editedSubObject} statusreq={statusReq} onChange={(subobj) => {setEditedSubObject(subobj);}}/>*/}
            <ListOfSubobj
              data={listSubObj}
              selectedValue={editedSubObject}
              onValueChange={(subobj) => {setEditedSubObject(subobj);}}
              isDataLoaded={isDataLoaded}
            />

            </View>

          </View>  
            
          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Система</Text>
          <ListOfSystem list={listSystem} buf={bufsystem} post={editedSystemName} onChange={(subobj) => {setEditedSystemName(subobj);}}/>   
          
          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Содержание замечания</Text>
          <TextInput
            style={[styles.input,  {flex: 1, height: Math.max(42, inputHeight), fontSize: ts(14) }]} // Минимальная высота 40
                        
            placeholderTextColor="#111"
            value={editedDescription}
            onChangeText={setEditedDescription}
            multiline
            onContentSizeChange={e=>{
              let inputH = Math.max(e.nativeEvent.contentSize.height, 35)
              if(inputH>120) inputH =100
              setInputHeight(inputH)}}
          />

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Статус</Text>
          <TextInput
            style={[styles.input, {fontSize: ts(14)}]}
            placeholderTextColor="#111"
            value={editedCommentStatus}
            editable={false}
          />

          {/*<Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель</Text>
          <TextInput
            style={[styles.input, {fontSize: ts(14)}]}
            placeholderTextColor="#111"
            value={editedExecut}
            editable={false}
          />*/}

          <View style={{flexDirection: 'row',width: '100%',}}>{/* Объявление заголовков в строку для дат плана и факта ИИ */}
                <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Дата выдачи</Text>
                 </View>
          
                 <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Плановая дата</Text>
                 </View>
          </View>

          <View  style={{flexDirection: 'row', width: '100%'}}>{/* Дата выдачи и Плановая дата устранения */}
            <CalendarWithoutDel theme='min' statusreq={true} post={editedStartDate} onChange={(dateString) => setEditedStartDate(dateString)}/>
            <Calendar theme='min' statusreq={true} post={editedEndDatePlan} onChange={(dateString) => setEditedEndDatePlan(dateString)}/>
          </View>

          <View style={{flexDirection: 'row',width: '100%',}}>{/* Объявление заголовков в строку для дат плана и факта ИИ */}
                <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Дата устранения</Text>
                 </View>
          
                 <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Фото</Text>
                 </View>
          </View>

          

          <View  style={{flexDirection: 'row', width: '100%'}}>{/* Дата факта устранения и фото */}
            
            <Calendar theme='min' statusreq={true} post={editedEndDateFact} onChange={(dateString) => setEditedEndDateFact(dateString)}/>
            <View style={{width: '50%', paddingTop: 12}}>
            {singlePhoto  ? (
                <View style={{ flexDirection: 'row', marginBottom: 8, alignSelf: 'center', width: '90%'}}> 
                  <View style={{width: '73%'}}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}> 
                      <Image
                      source={{ uri: singlePhoto }}
                      style={{
                        height: 42,
                        borderRadius: 8,}}
                      //style={styles.image}
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
                  <View style={{width: '24%' ,alignSelf: 'center'}}>
                    <TouchableOpacity onPress={cancelPhoto} style={{alignItems: 'flex-end'}}>
                      <Ionicons name='close-outline' size={30} />
                    </TouchableOpacity>
                  </View>
                
              </View>
              ) : (
              <View style={{ marginBottom: 8}}>
                <View style={{width: '100%'}}>
                  <TouchableOpacity onPress={selectPhoto} style={{alignSelf: 'flex-end', width: '20%'}}>
                    <Ionicons name='image-outline' size={30}></Ionicons>
                  </TouchableOpacity> 
                  </View>
              </View>
              )
              }
            </View>

          </View>

                <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Категория замечания</Text>
                <DropdownComponent2 post = {editedCommentCategory} onChange={(category) => setEditedCommentCategory(category)}/>

          
                <CustomButton
                  title="Сохранить изменения"
                  handlePress={handleSaveClick} />
                <View>
                  <CustomButton
                    title="Отмена"
                    handlePress ={() => router.replace({pathname: '/(tabs)/two', params: {codeCCS: codeCCS, capitalCSName: capitalCSName }})}  />
                </View>
              </View>
            </View>
          </>

        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
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

export default EditDataScreen;