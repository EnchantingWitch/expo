import DateInputWithPicker2 from '@/components/Calendar+';
import DateInputWithPicker from '@/components/CalendarOnWrite';
import CustomButton from '@/components/CustomButton';
import ListOfOrganizations from '@/components/ListOfOrganizations';
import ListOfSystem from '@/components/ListOfSystem';
import useDevice from '@/hooks/useDevice';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from "expo-document-picker";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { Structure } from '../(tabs)/structure';

export type ListToDrop = {
  label: string;
  value: string; 
};
const { width, height } = Dimensions.get('window');

export default function CreateNote() {
  const { isDesktopWeb } = useDevice();
  
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const [listSubObj, setListSubObj] = useState<ListToDrop[]>([]);
  const [listSystem, setListSystem] = useState<ListToDrop[]>([]);
  const [upLoading, setUpLoading] = useState(false);
  const [array, setArray] = useState<Structure[]>([]);//данные по структуре
  const [noteListSubobj, setNoteListSubobj] = useState<boolean>(true);//ограничение на получение листа подобъектов только единожды 
  const [noteListSystem, setNoteListSystem] = useState<boolean>(false);//ограничение на отправку листа систем в компонент
  const [exit, setExit] = useState<boolean>(false);//если true нельзя создать замечание, проверка на наличие структуры - работает ли?
  const [statusReq, setStatusReq] = useState(false);//для выпадающих списков, передача данных, когда True
  const [req, setReq] = useState<boolean>(true);//ограничение на получение запроса только единожды 
  const [numberII, setNumber] = useState('');//прописать useEffect
  const [subObject, setSubObject] = useState('');
  const [systemName, setSystemName] = useState(' ');
  const [description, setDescription] = useState('');
  const [execut, setExecut] = useState('');
  const [startDate, setStartDate] = useState('');
  const [equipment, setEquipment] = useState('');//Оборудование
  const [comExp, setComExp] = useState('');
  const [manufacturerNumber, setManufacturerNumber] = useState('');//заводской номер
  const [manufacturer, setManufacturer] = useState(''); // изготовитель
  const [planDate, setPlanDate] = useState(' ');//добавить в json
  const [inputHeight, setInputHeight] = useState(40);
  const [bufsystem, setBufsystem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);//для открытия фото полностью
  const [wayToGetPhoto, setWayToGetPhoto] = useState<number>(0); //2- фото, 1 - камера

  const [accessToken, setAccessToken] = useState<any>('');
  const [organisationFrAsync, setOrganisationFrAsync] = useState<any>('');
  const [fullNameFrAsync, setFullNameFrAsync] = useState<any>('');
  const [disabled, setDisabled] = useState(false); //для кнопки

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)
  };

  console.log(systemName, 'systemName every');

  const {codeCCS} = useLocalSearchParams();//получение codeCCS объекта
  const {capitalCSName} = useLocalSearchParams();
  
  const getToken = async (keyToken, setF) => {
    try {
        const token = await AsyncStorage.getItem(keyToken);
        if (token !== null) {
            console.log('Retrieved token:', keyToken, '-', token);
            setF(token);
        } else {
            console.log('No token found');
            router.push('/sign/sign_in');
        }
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
};

  const TwoFunction = () => {
    submitData();
  };

  const [singlePhoto, setSinglePhoto] = useState<any>('');

  useEffect(() => {
    if (wayToGetPhoto === 1) {
      selectCamera();
    }
    if (wayToGetPhoto === 2) {
      selectPhoto();
    }
  }, [wayToGetPhoto]);

    useEffect(() => {
    if (singlePhoto === '') {
      setWayToGetPhoto(0);
    }
  }, [singlePhoto]);

  const selectPhoto = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
      });
      if (res.assets && res.assets[0].uri) {
        setSinglePhoto(res.assets[0].uri)
      }

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

  const selectCamera = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await ImagePicker.launchCameraAsync({
      });

      // Printing the log realted to the file
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
    setWayToGetPhoto(0);
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
          if (response.status === 200){
            setStatusReq(true);//для выпадающего списка
          }
          if(response.status != 200){setExit(true); }
        } catch (error) {
          console.error(error);
        } finally {
        }
      };



  const selectFile = async () => {
      // Opening Document Picker to select one file
      try {
        const res = await DocumentPicker.getDocumentAsync({
          // Provide which type of file you want user to pick
          //type: "*/*",
          //Ограничение загружаемых типов файлов (mime type)
          type: [
            //'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel' 
            'image/*',// 'image/jpeg'
          ],
          copyToCacheDirectory: true, 
          
        });
        // Printing the log realted to the file
        // Setting the state to show single file attributes
        if (!res.canceled) {
        setSinglePhoto(res.assets[0].uri); }
      } catch (err) {
        setSinglePhoto('');
        // Handling any exception (If any)
       if (DocumentPicker.Cancel(err)) {
          // If user canceled the document selection
          alert('Canceled');
        } else {
          // For Unknown Error
          alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }
    };

  useEffect(() => {
    getToken('accessToken', setAccessToken);
    getToken('userID', setFullNameFrAsync);
    getToken('organisation', setOrganisationFrAsync);
  }, []);

  useEffect(() => {
    //запрос на структура для получение данных на выпадающие списки и прочее
    if(codeCCS && req&& accessToken){getStructure(); getOrganisations(); setReq(false); console.log('8'); }//вызов происходит только один раз

    if (systemName){
      setBufsystem(systemName);
    }

      if(systemName != bufsystem){
        setBufsystem(systemName);
      if (systemName != ' ' ){
        const filtered = array.filter(item => item.subObjectName === subObject);
        const filteredS = filtered[0].data.filter(item => item.systemName === systemName);;
        if(filteredS.length != 0){
          setNumber(filteredS[0].numberII);
          setExecut(filteredS[0].ciwexecutor);
        }
        else{
          setNumber('');
          setExecut('');
          setSystemName(' ');
        }
        setNoteListSystem(false);
      }
      }  
        
  }, [accessToken, codeCCS, req, statusReq, noteListSubobj, subObject, systemName, numberII, execut]);

 // Формирование списка подобъектов
 useEffect(() => {
  if (array.length > 0) {
    const subObjList = array.map(item => ({
      label: item.subObjectName,
      value: item.subObjectName
    }));
    setListSubObj(subObjList);
  }
}, [array]);

// Формирование списка систем при изменении подобъекта
useEffect(() => {
  if (subObject && array.length > 0) {
    const filtered = array.find(item => item.subObjectName === subObject);
    if (filtered) {
      const systemList = filtered.data.map(system => ({
        label: system.systemName,
        value: system.systemName
      }));
      setListSystem(systemList);
      setSystemName(' '); // Сброс выбранной системы при изменении подобъекта
      setNumber('');
      setExecut('');
    }
  }
}, [subObject, array]);

// Обновление номера АИИ и исполнителя при изменении системы
useEffect(() => {
  if (systemName !== ' ' && systemName !== bufsystem && subObject) {
    setBufsystem(systemName);
    const filtered = array.find(item => item.subObjectName === subObject);
    if (filtered) {
      const systemData = filtered.data.find(item => item.systemName === systemName);
      if (systemData) {
        setNumber(systemData.numberII);
        setExecut(systemData.ciwexecutor);
      }
    }
  }
}, [systemName, subObject, array]);

  const handleSubObjectChange = (selectedSubObject: string) => {
    setSubObject(selectedSubObject);
    setSystemName(' '); // Явный сброс системы
    setNumber('');
    setExecut('');
};

  const submitData = async () => {
    setDisabled(true);
    if(subObject ==='' && systemName===' ' &&  description!=='' && manufacturerNumber!=='' && manufacturer!=='' && equipment!==''){
      Alert.alert('', 'Заполните поля подобъекта, системы. Если выпадающий список пустой, загрузите структуру.', [
                              {text: 'OK', onPress: () => console.log('OK Pressed')}])
                 setDisabled(false);
                 return;
               }

    if(subObject ==='' && systemName===' ' &&  description==='' && manufacturerNumber==='' && manufacturer==='' && equipment===''){
       Alert.alert('', 'Заполните поля подобъекта, системы, дефекта, оборудования, заводского номера, изготовителя', [
                               {text: 'OK', onPress: () => console.log('OK Pressed')}])
                  setDisabled(false);
                  return;
                }

    try {
      let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/defectiveActs/createDefAct', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iiNumber: numberII,
          subObject: subObject,
          systemName: systemName,
          equipment: equipment, 
          description: description,
          defectiveActStatus: "Не устранено",
          executor: execut,
          userName: fullNameFrAsync.toString(),
          startDate: startDate,
          codeCCS: codeCCS,
          endDatePlan: planDate,
          endDateFact: ' ',
          defectiveActExplanation: comExp, 
          manufacturer: manufacturer,
          manufacturerNumber : manufacturerNumber
        }),
      });
      console.log('ResponseCreateNote:', response);

      if(response.status === 200){
        Alert.alert('', 'Дефект добавлен', [
             {text: 'OK', onPress: () => console.log('OK Pressed')},
          ])
      }

      const id = await response.text()
     if(singlePhoto!=''){
      const body = new FormData();
      const base64Data = singlePhoto.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteArrays], { type: 'image/jpeg' });
      console.log('byteArrays', byteArrays)

      // 2. Создаем File (если нужно имя файла)
      const file = new File([blob], 'uploaded_photo.jpeg', { type: 'image/jpeg' });

      // 3. Добавляем в FormData
      body.append('photo', file); // Ключевое отличие: передаем File, а не URL

      let str = String('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/defectiveActs/addPhoto/' + id);
      console.log(str);

      let res = await fetch(
        str,
        {
          method: 'post',
          body: body,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            
          }
        }
      );
      console.log('ResponsePhoto:', res);
      }
    } catch (error) {
      setDisabled(false);
      console.error('Error:', error);
    } finally {
      setDisabled(false);
      setUpLoading(false);
      router.replace({pathname: '/(tabs)/defacts', params: { codeCCS: codeCCS, capitalCSName: capitalCSName}});
    }
  }

   //зумирование фото

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);


  const pinchGesture = Gesture.Pinch()
  .onUpdate((e) => {
    scale.value = savedScale.value * e.scale;
  })
  .onEnd(() => {
    savedScale.value = scale.value;
    scale.value = withSpring(Math.min(Math.max(scale.value, 1), 3));
  });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX/3;
      translateY.value = e.translationY/3;
    })
    .onEnd(() => {//возвращает в центр изображение
      if (scale.value <= 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);

      translateX.value = withSpring(clamp(translateX.value, -0.5, 0.5));
      translateY.value = withSpring(clamp(translateY.value, -0.5, 0.5));
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  

     const [statusOrg, setStatusOrg] = useState(false);
       const [listOrganization, setListOrganization] = useState<[]>();

  const getOrganisations = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/organisations/getAll',
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      console.log('responseGetOrganisations', response);
      const json = await response.json();
      const transformedData = json.map(item => ({
            label: item.organisationName,
            value: item.organisationName,
        }));
        setListOrganization(transformedData);
      console.log(json);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  useEffect(() => {
      if (listOrganization) {
        setStatusOrg(true);    
      }
    }, [listOrganization]);


  return (
   <KeyboardAwareScrollView
  style={styles.container}
  enableOnAndroid={true}
  extraScrollHeight={125}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{ flexGrow: 1 }}
>
 <View style={[styles.container, {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
      }]}>
        
        <View style={{flex: 1, alignItems: 'center',
        width: isDesktopWeb? '148%' :'100%'}}>
    <View style={{width: '100%', alignItems: 'center'}}>
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Подобъект</Text>
      <ListOfOrganizations 
        data={listSubObj} 
        post={subObject} 
        status={statusReq} 
        title = {subObject? subObject : 'Не выбрано'}
        label='Подобъект'
        onChange={(subobj) => handleSubObjectChange(subobj)}
      />   
    </View>
    
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, paddingTop: 6 }}>Система</Text>
    <ListOfSystem 
      list={listSystem} 
      buf={bufsystem} 
      post={systemName} 
      onChange={(system) => setSystemName(system)}
    />
    
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Оборудование</Text>
    <TextInput
      style={[styles.input, {fontSize: ts(14)}]}
      placeholderTextColor="#111"
      onChangeText={setEquipment}
      value={equipment} 
    />
    
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Дефект</Text>
     <TextInput
      multiline
      onContentSizeChange={e=>{
        let inputH = Math.max(e.nativeEvent.contentSize.height, 35)
        if(inputH>120) inputH =100
          setInputHeight(inputH)
        }}
      style={[styles.input, 
        {height: Math.max(42, inputHeight),
        fontSize: ts(14),
        lineHeight: ts(22),
        alignContent: 'center',
        textAlignVertical: 'center',
        }
      ]}
      maxLength={250}
      placeholderTextColor="#111"
      onChangeText={setDescription}
      value={description}
      />
      {description.length >=200? 
        <Text style={{ fontSize: ts(11),  color: '#B3B3B3', fontWeight: '400', marginTop: -14.6}}>
          Можете ввести еще {250-description.length}{' '}
          {(250-description.length) % 10 === 1? <Text>символ</Text>
          : (250-description.length) % 10 === 2 || (250-description.length) % 10 === 3 || (250-description.length) % 10 === 4? <Text>символа</Text>
          : <Text>символов</Text>}
        </Text>
      : '' }
    
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Заводской номер</Text>
    <TextInput
      style={[styles.input, {fontSize: ts(14)}]}
      placeholderTextColor="#111"
      onChangeText={setManufacturerNumber}
      value={manufacturerNumber} 
    />
    
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Изготовитель</Text>
    <ListOfOrganizations data={listOrganization} label='Изготовитель' title = {manufacturer? manufacturer : 'Не выбрано'} status={statusOrg} post ={manufacturer} onChange={(value) => setManufacturer(value)}/>
    
    
    {/* Даты */}
    <View style={{flexDirection: 'row', width: '100%'}}>
      <View style={{width: '50%'}}>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Дата выдачи</Text>
      </View>
      <View style={{width: '50%'}}>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Плановая дата</Text>
      </View>
    </View>
    
    <View style={{flexDirection: 'row', width: '96%'}}>
      <View style={{width: '50%',  alignItems: 'center'}}>
        <DateInputWithPicker theme='min' onChange={(dateString) => setStartDate(dateString)}/>
      </View>
      <View style={{width: '50%', }}>
        <DateInputWithPicker2 statusreq={true} post={planDate} theme='min' onChange={(dateString) => setPlanDate(dateString)}/>
      </View>
    </View>
    
    {/* Фото */}
    <View style={{width: '100%'}}>
      {singlePhoto ? (
        <View style={{ marginBottom: 8, flexDirection: 'row', alignSelf: 'center', width: '100%'}}> 
          <View style={{width: '50%', alignSelf: 'center'}}>
            <Text style={{textAlign: 'center', fontSize: ts(14)}}>Фото выбрано</Text>
          </View>
          <View style={{width: '42%',justifyContent: 'flex-end',  flexDirection: 'row'}}>
          <View style={{ width: '78%', backgroundColor: 'red', alignContent: 'center'}}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={{ uri: singlePhoto }}
                style={styles.image}
              />
            </TouchableOpacity>
            
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '100%'}}>
                      <TouchableOpacity 
                        onPress={() => setModalVisible(false)} 
                        style={{alignItems: 'center', width: '50%' }}
                      >
                        <Ionicons name='close-outline' size={30} color={"#57CBF5"} />
                      </TouchableOpacity>
                    </View>
                    
                    <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
                      <Animated.View style={animatedStyle}>
                        <Image
                          source={{uri: singlePhoto}}
                          style={styles.imageModal}
                          contentFit="contain"
                          transition={200}
                        />
                      </Animated.View>
                    </GestureDetector>
                  </View>
                </View>
              </GestureHandlerRootView>
            </Modal>
          </View>
          <View style={{ alignSelf: 'center' }}>
            <TouchableOpacity onPress={cancelPhoto} style={{}}>
              <Ionicons name='close-outline' size={30} />
            </TouchableOpacity>
          </View>
        </View>
        </View>
      ) : (
        <View style={{ marginBottom: 8, flexDirection: 'row'}}>
          <View style={{width: '50%'}}>
            <Text style={{textAlign: 'center', fontSize: ts(14)}}>Фото не выбрано</Text>
          </View>
          <View style={{width: '48%'}}>
            <TouchableOpacity onPress={selectFile} style={{alignSelf: 'flex-end', width: '20%'}}>
              <Ionicons name='image-outline' size={30}></Ionicons>
            </TouchableOpacity> 
          </View>
        </View>
      )}
    </View>
    
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Комментарий</Text>
    <TextInput
      style={[styles.input, {fontSize: ts(14)}]}
      placeholderTextColor="#111"
      onChangeText={setComExp}
      value={comExp} 
    />
  </View>
  
  <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 20 }}>
    <CustomButton
      disabled={disabled}
      title="Добавить дефект"
      handlePress={TwoFunction}
    />
  </View></View>
</KeyboardAwareScrollView> );
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
    height: 42,
    borderRadius: 8,
  },
  imageModal: {
    height: height,
    width: width,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Полупрозрачный фон
  },
  modalContent: {
    width: '100%',
    height: '100%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    
  },
});