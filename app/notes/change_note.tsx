import React, { useState, useEffect } from 'react';
import { Text, View, Image, TextInput, Button, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { router, Link, Tabs, useLocalSearchParams } from 'expo-router';
import DropdownComponent1 from '@/components/ListOfSystem';
import DropdownComponent2 from '@/components/ListOfCategories';
import DateInputWithPicker from '@/components/CalendarOnWrite';
import DateInputWithPicker2 from '@/components/calendar+10';
import FormField from '@/components/FormField';
import { styles } from './create_note';
import * as ImagePicker from 'expo-image-picker';
import ListOfSubobj from '@/components/ListOfSubobj';
import ListOfSystem from '@/components/ListOfSystem';
import Calendar from '@/components/Calendar+';
import { Structure } from '../(tabs)/structure';


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
 
    const [array, setArray] = useState<Structure[]>([]);//данные по структуре
    const listSubObj = [];//список подобъектов из структуры
    const [noteListSubobj, setNoteListSubobj] = useState<boolean>(true);//ограничение на получение листа подобъектов только единожды 
    const listSystem = [];//список систем из структуры на соответствующий выбранный подобъект
    const [noteListSystem, setNoteListSystem] = useState<boolean>(false);//ограничение на отправку листа систем в компонент
    const [exit, setExit] = useState<boolean>(false);//если true нельзя создать замечание, проверка на наличие структуры - работает ли?
    const [statusReq, setStatusReq] = useState(false);//для выпадающих списков, передача данных, когда True
    const [req, setReq] = useState<boolean>(true);//ограничение на получение запроса только единожды 
    const [inputHeight, setInputHeight] = useState(42);
    const [bufsubobj, setBufsubobj] = useState(subobj);
    const [bufsystem, setBufsystem] = useState(system);

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
  const bufCommentStat = status;//хранит статус замечания из бд, чтобы вывести его в случае отмены выбранной даты устранения (изначально пустой)
  
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  if(codeCCS && noteData){
    setNoteData(false);
    setEditedSerialNumber(serialNumb);
    setEditedIinumber(numberii);
    setEditedSubObject(subobj);
    setEditedSystemName(system);
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


  const selectPhoto = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({});
      console.log('res : ' + JSON.stringify(res));
      if (!res.canceled) {
        setSinglePhoto(res.assets[0]);
      }
    } catch (err) {
      setSinglePhoto('');
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


  const handleSaveClick = async () => {
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
        //executor: editedExecut,
      });
      console.log(json);
    try {
      let response = await fetch(`https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/updateComment/`+id, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: json,
      });

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
    }
  };

  useEffect(() => {
      //смена статуса при изменении даты
        if (editedEndDateFact) {
          if(editedEndDateFact != ' '){
            setEditedCommentStatus('Устранено');   
          } else {
            setEditedCommentStatus(bufCommentStat);
          }
      }
    //запрос на структура для получение данных на выпадающие списки и прочее
    if(codeCCS && req){getStructure(); setReq(false); console.log('8'); }//вызов происходит только один раз
    //формирование выпадающего списка для подобъекта
   /* if(subobj && noteListSubobj){//вызов происходит только один раз
      setNoteListSubobj(false);
      
      const buf = array.map(item => ({label: item.subObjectName, value: item.subObjectName}));
      listSubObj.push(...buf);
      setStatusReq(true);
    }*/
    //формирование выпадающего списка для системы после того как выбран подобъект
    /*if (editedSubObject ){

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
    if(subobj){
      const filtered = array.filter(item => item.subObjectName === editedSubObject);
      console.log(filtered.length, 'filtered.length');
      if(filtered.length != 0){
        for (const pnrsystemId in filtered[0].data) {
        
            const buf = filtered.map(item => ({label: item.data[pnrsystemId].systemName, value:  item.data[pnrsystemId].systemName}));
            console.log('listSystem',buf);
            listSystem.push(...buf);
 
        }  
      }
    }
    if(editedSystemName ){
      
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
          }
        // if(filteredS[0].ciwexecutor){
          setNoteListSystem(false);
      }
        //}
      }
      }  
     
    }
      }, [ editedEndDateFact, codeCCS, req, statusReq, noteListSubobj, editedSubObject, editedSystemName]);


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

            <View style={{width: '20%', alignItems: 'center'}}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center'}}>№ АИИ</Text>
            </View>

            <View style={{width: '60%', alignItems: 'center'}}>
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

            <View style={{width: '20%', alignItems: 'flex-end'}}>
            <TextInput
            style={[styles.input, {fontSize: ts(14),marginTop: 6}]}
            placeholderTextColor="#111"
            value={editedIinumber}
            editable={false}
            />
            </View>

            <View style={{width: '60%', alignItems: 'center', paddingTop: 6}}>
            {/*<TextInput
            style={[styles.input, ]}
            placeholderTextColor="#111"
            value={editedSubObject}
            editable={false}
            />*/}
            <ListOfSubobj list={listSubObj} post={editedSubObject} statusreq={statusReq} onChange={(subobj) => {setEditedSubObject(subobj);}}/>
            </View>

          </View>  
            
          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Система</Text>
          <ListOfSystem list={listSystem} post={editedSystemName} onChange={(subobj) => {setEditedSystemName(subobj);}}/>   
          
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

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель</Text>
          <TextInput
            style={[styles.input, {fontSize: ts(14)}]}
            placeholderTextColor="#111"
            value={editedExecut}
            editable={false}
          />

          <View style={{flexDirection: 'row',width: '100%',}}>{/* Объявление заголовков в строку для дат плана и факта ИИ */}
                <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Дата выдачи</Text>
                 </View>
          
                 <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Плановая дата</Text>
                 </View>
          </View>

          <View  style={{flexDirection: 'row', width: '100%'}}>{/* Дата выдачи и Плановая дата устранения */}
            <Calendar theme='min' statusreq={true} post={editedStartDate} onChange={(dateString) => setEditedStartDate(dateString)}/>
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

          

          <View  style={{flexDirection: 'row', width: '100%'}}>
            
            <Calendar theme='min' statusreq={true} post={editedEndDateFact} onChange={(dateString) => setEditedEndDateFact(dateString)}/>
            <View style={{width: '50%'}}>

            </View>

          </View>

{/*}     <View style={{flexDirection: 'row', width: '98%'}}>

            <View style={{width: '50%'}}>
              <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Дата выдачи</Text>
            </View>
            <View style={{width: '50%', }}>
              {singlePhoto ? (
                <Text style={{textAlign: 'center'}}>Фото выбрано</Text>
              ) : (
                 <Text style={{textAlign: 'center'}}>Фото не выбрано</Text>
              )
              }
            </View>

          </View>

          <View style={{flexDirection: 'row', width: '98%'}}>


            <DateInputWithPicker  onChange ={(currentDate) => setStartDate(currentDate)}/>
            
            <View style={{width: '60%'}}>
              {singlePhoto ? (
                <View style={{ paddingVertical: 8, flexDirection: 'row', alignSelf: 'center', width: '50%', paddingTop: 15 }}> 
                  <View > 
                    <Image
                    source={{ uri: singlePhoto }}
                    style={styles.image}
                    />
                  </View>
                  <TouchableOpacity onPress={cancelPhoto}>
                    <Ionicons name='close-outline' size={30} ></Ionicons>
                  </TouchableOpacity>
                </View>
              ) : ( 
                <View style={{ paddingVertical: 8, flexDirection: 'row', alignSelf: 'flex-end', paddingTop: 15,}}>
              <TouchableOpacity onPress={selectPhoto} style={{width: '17%'}}>
                <Ionicons name='image-outline' size={30}></Ionicons>
              </TouchableOpacity>  </View>)
             
              }
            </View>

          </View>

    */}

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