//import Calendar from '@/components/Calendar+';
//import CalendarWithoutDel from '@/components/CalendarWithoutDel';
import CustomButton from '@/components/CustomButton';
//import DropdownComponent2 from '@/components/ListOfCategories';
import ListOfSubobj from '@/components/ListOfOrganizations';
//import ListOfSubobj from '@/components/ListOfSubobj';
import ListOfSystem from '@/components/ListOfSystem';
//import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import * as FileSystem from 'expo-file-system';
//import { Image } from 'expo-image';
//import * as ImagePicker from 'expo-image-picker';
//import * as MediaLibrary from 'expo-media-library';
import { router, useLocalSearchParams } from 'expo-router';
//import * as Sharing from 'expo-sharing';
import { default as React, useEffect, useState } from 'react';
import { Alert, Dimensions, Platform, StatusBar, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
//import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
//import DateInputWithPicker from '@/components/Calendar+';
import useDevice from '@/hooks/useDevice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Structure } from '../(tabs)/structure';
import { styles } from '../notes/create_note';

const { width, height } = Dimensions.get('window');

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
  const { isMobile, isDesktopWeb, isMobileWeb, screenWidth } = useDevice();
  
    const {serialNumb} = useLocalSearchParams();
    const {subobj} = useLocalSearchParams();
    const {system} = useLocalSearchParams();
    const {comment} = useLocalSearchParams();
    const {id} = useLocalSearchParams();
    const {codeCCS} = useLocalSearchParams();
    const {capitalCSName} = useLocalSearchParams();
    const {date} = useLocalSearchParams();

    const [accessToken, setAccessToken] = useState<any>('');
 
    const [array, setArray] = useState<Structure[]>([]);//данные по структуре
    const [listSubObj, setListSubObj] = useState<ListToDrop[]>([]);
    const [listSystem, setListSystem] = useState<ListToDrop[]>([]);
   // const listSubObj = [];//список подобъектов из структуры
    const [noteListSubobj, setNoteListSubobj] = useState<boolean>(true);//ограничение на получение листа подобъектов только единожды 
   // const listSystem = [];//список систем из структуры на соответствующий выбранный подобъект
    const [noteListSystem, setNoteListSystem] = useState<boolean>(false);//ограничение на отправку листа систем в компонент
    const [exit, setExit] = useState<boolean>(false);//если true нельзя создать замечание, проверка на наличие структуры - работает ли?
    const [statusReq, setStatusReq] = useState(false);//для выпадающих списков, передача данных, когда True
    const [req, setReq] = useState<boolean>(true);//ограничение на получение запроса только единожды 
    const [inputHeight, setInputHeight] = useState(42);
    const [bufsubobj, setBufsubobj] = useState(subobj);
    const [bufsystem, setBufsystem] = useState('');

  const [data, setData] = useState<Data | undefined>(undefined);
  const [editing, setEditing] = useState<boolean>(false);
  const [editedSerialNumber, setEditedSerialNumber] = useState<number>(0);
  const [editedSubObject, setEditedSubObject] = useState<string>('');
  const [editedSystemName, setEditedSystemName] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [editedIinumber, setEditedIinumber] = useState<string>('');
  const [editedDate, setEditedDate] = useState<string>('');
  const [status, setStatus] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false); //для кнопки

  const [updateCom, setUpdateCom] = useState<boolean>(false);//вызов функции запроса после изменения АИИ и исполнителя
  const bufCommentStat = status;//хранит статус замечания из бд, чтобы вывести его в случае отмены выбранной даты устранения (изначально пустой)

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

    const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

    useEffect(() => {
      if (codeCCS) {
          setEditedSerialNumber(serialNumb);
          setEditedSubObject(subobj);
          setBufsubobj(subobj);
          setEditedSystemName(system);
          setBufsystem(system);
          setEditedDescription(comment);
          setEditedDate(date);
      }
  }, [codeCCS]);

   useEffect(() => {
      if (editedDate) {
          setStatus(true)//для передачи даты
      }
  }, [editedDate]);

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

/*
console.log(JSON.stringify({
          subObject: editedSubObject,
          system: editedSystemName,
        }))*/

  const updateComment = async () => {
    setDisabled(true);
    console.log(JSON.stringify({
          id: id,
          description: editedDescription,
          subObject: editedSubObject,
          system: editedSystemName,
          capitalCS: capitalCSName,
          date: editedDate.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
        }))
    try {
      let response = await fetch(`https://xn----7sbpwlcifkq8d.xn--p1ai:8443/journal/updateEntry`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          description: editedDescription,
          subObject: editedSubObject,
          system: editedSystemName,
          capitalCS: capitalCSName,
          date: editedDate.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
        }),
      });
      console.log('updateComment', response);
      if (response.ok) {
        const jsonData: Data = await response.json();
        setData(jsonData);
        setEditing(false);
        //alert('Данные успешно сохранены!');
         Alert.alert('', 'Данные обновлены', [
                                      {text: 'OK', onPress: () => console.log('OK Pressed')}])
      } else {
        throw new Error('Не удалось сохранить данные.');
      }
    } catch (error) {
      setDisabled(false);
      console.error('Ошибка при сохранении данных:', error);
      Alert.alert('', 'Произошла ошибка при обновлении данных: ' + error, [
                   {text: 'OK', onPress: () => console.log('OK Pressed')},
                ])
    } finally{
      setDisabled(false);
      router.replace({pathname: '/(tabs)/jour', params: {codeCCS: codeCCS, capitalCSName: capitalCSName }});
    }

  };

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
  };

  const deleteNote = async () => {
    setDisabled(true);
    try {
      let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/journal/deleteEntry/'+id, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
      });
    console.log('ResponseDeleteEntry:', response);
    if (response.status === 200) {
      Alert.alert('', 'Запись удалена.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
      }
    } catch (err) {
      Alert.alert('', 'Произошла ошибка при удалении записи: ' + err, [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ])
      setDisabled(false);
    } finally {
      setDisabled(false);
      router.replace({pathname: '/(tabs)/jour', params: {codeCCS: codeCCS, capitalCSName: capitalCSName }});
    }
  }
  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    //запрос на структура для получение данных на выпадающие списки и прочее
    if(codeCCS && req && accessToken){getStructure(); setReq(false);}//вызов происходит только один раз
  }, [ accessToken, codeCCS, req]);

 useEffect(() => {
    if (updateCom){
      updateComment();
    }
  }, [updateCom]);

   useEffect(() => {
    if(editedSystemName){
      setBufsystem(editedSystemName);
    }
  }, [editedSystemName]);
 
 useEffect(() => {
   if (editedSubObject && array.length > 0) {
     const filtered = array.find(item => item.subObjectName === editedSubObject);
     setListSystem(filtered?.data.map(system => ({
       label: system.systemName,
       value: system.systemName
     })) || []);
   } else {
     setListSystem([]);
   }
 }, [editedSubObject, array]);

   // Для подобъектов
useEffect(() => {
  if (array.length > 0) {
    const buf = array.map(item => ({label: item.subObjectName, value: item.subObjectName}));
    setListSubObj(buf);
    setStatusReq(true);
  }
}, [array]);

// Для систем
useEffect(() => {
  if (editedSubObject && array.length > 0) {
    const filtered = array.find(item => item.subObjectName === editedSubObject);
    if (filtered) {
      const systemList = filtered.data.map(system => ({
        label: system.systemName,
        value: system.systemName
      }));
      setListSystem(systemList);
    }
  }
}, [editedSubObject, array]);

  const handleSubObjectChange = (selectedSubObject: string) => {
    setEditedSubObject(selectedSubObject);
    setEditedSystemName(' '); // Явный сброс системы
  }

  const handleSystemChange = (selectedSystem: string) => {
  setEditedSystemName(selectedSystem);
  // Обновляем номер ИИ сразу при выборе системы
  if (selectedSystem && editedSubObject) {
    const filtered = array.find(item => item.subObjectName === editedSubObject);
    if (filtered) {
      const systemData = filtered.data.find(item => item.systemName === selectedSystem);
      setEditedIinumber(systemData?.numberII || '');
    }
  }
};

  return (
     <KeyboardAwareScrollView
      style={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={[styles.container, {alignItems: 'center',
          justifyContent: 'center',
         // width: '50%',
          alignSelf: 'center'
          }]}>
              <View style={{ flex: 1, alignItems: 'center',
                //height: 1,
               width: isDesktopWeb? '188%' :'100%'
               }}>

          <View style={{flexDirection: 'row', width: '98%', marginBottom: 0 }}>
            <View style={{width: '40%', alignItems: 'center'}}>
              <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>№</Text>
            </View>

         

            <View style={{width: '60%', alignItems: 'center'}}>
              <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center'}}>Дата работы</Text>
            </View>
          </View>


          <View style={{flexDirection: 'row', width: '98%', marginBottom: 0 }}>

            <View style={{width: '40%', alignItems: 'center', paddingTop: 4.5}}>
              <TextInput
              style={[styles.input, {fontSize: ts(14),  width: '50%'}]}
              //placeholder="№ акта ИИ"
              placeholderTextColor="#111"
              value={editedSerialNumber.toString()}
              editable={false}
              />
            </View>
             
            <View style={{width: '60%', alignItems: 'center'}}>
            <TextInput
            style={[styles.input, {fontSize: ts(14), marginTop: 6, width: '50%'}]}
            //placeholder="№ акта ИИ"
            placeholderTextColor="#111"
            value={editedDate}
            editable={false}
            />
            </View>
 </View>
{/*}
          <View style={{flexDirection: 'row', width: '96%', justifyContent: 'space-between' }}>
             
            <View style={{width: '40%', alignItems: 'center', paddingTop: 4.5}}>
              <TextInput
              style={[styles.input, {fontSize: ts(14),  width: '50%'}]}
              //placeholder="№ акта ИИ"
              placeholderTextColor="#111"
              value={editedSerialNumber.toString()}
              editable={false}
              />
            </View>

            <View style={{width: '60%',}}>
              <DateInputWithPicker theme='min' diseditable={true} statusReq={true} post={editedDate} onChange={(value)=>setEditedDate(value)}/>
            </View>

          </View>  
          */}

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8 }}>Подобъект</Text>
          <ListOfSubobj 
                data={listSubObj} 
                post={editedSubObject} 
                status={statusReq} 
                title=''
                label={'Подобъект'}
                onChange={(subobj) => handleSubObjectChange(subobj)}
            />
            
          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Система</Text>
          <ListOfSystem
              list={listSystem} 
             /* title=''
              label={'Подобъект'}
              status={statusReq} */
              buf={bufsystem}
              post={editedSystemName} 
              onChange={(system) => handleSystemChange(system)}
          />
          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Краткое описание и условия выполнения работ</Text>
          {/*}  <TextInput
            style={[styles.input,  {flex: 1, height: Math.max(42, inputHeight), fontSize: ts(14) }]} // Минимальная высота 40
                        
            placeholderTextColor="#111"
            value={editedDescription}
            onChangeText={setEditedDescription}
            multiline
            onContentSizeChange={e=>{
              setInputHeight(e.nativeEvent.contentSize.height);}}
          />*/}  
          
          <TextInput
            style={[styles.input, { 
                fontSize: ts(14),
                minHeight: 42, // минимальная высота
                //maxHeight: 100, // максимальная высота (можно увеличить при необходимости)
                height: inputHeight, // динамическая высота
                lineHeight: ts(22),
                alignContent: 'center',
                textAlignVertical: 'center'
            }]}
            maxLength={1000}
            placeholderTextColor="#111"
            value={editedDescription}
            onChangeText={setEditedDescription}
            multiline
            onContentSizeChange={(e) => {
                // Добавляем небольшой отступ к высоте контента
             /*   const newHeight = e.nativeEvent.contentSize.height + 10;
                setInputHeight(Math.min(Math.max(newHeight, 42), ));
                */
               let inputH = Math.max(e.nativeEvent.contentSize.height, 35)
              if(inputH>1000) inputH =1000
              setInputHeight(inputH)
            }}
            />
            {editedDescription.length >=900? 
                        <Text style={{ fontSize: ts(11),  color: '#B3B3B3', fontWeight: '400', marginTop: -14.6, marginBottom: 16}}>
                          Можете ввести еще {1000-editedDescription.length}{' '}
                          {(1000-editedDescription.length) % 10 === 1? <Text>символ</Text>
                          : (1000-editedDescription.length) % 10 === 2 || (1000-editedDescription.length) % 10 === 3 || (1000-editedDescription.length) % 10 === 4? <Text>символа</Text>
                          : <Text>символов</Text>}
                        </Text>
                      : '' }

          
        </View>
      </View>
            <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 20 }}>

                <CustomButton
                  disabled={disabled}
                  title="Сохранить изменения"
                  handlePress={updateComment} />
                  <CustomButton
                  title="Удалить"
                  disabled={disabled}
                  handlePress={deleteNote} />
                </View>


      </KeyboardAwareScrollView>
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