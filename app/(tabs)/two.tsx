import CustomButton from '@/components/CustomButton';
import Note from '@/components/Note';
import SystemsForTwo from '@/components/SystemsForTwo';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import type { Structure } from './structure';

 
type Note = {
  commentId: number; //id замечания , генерируется на сервере
  serialNumber: number;//номер замечания
  subObject: string;
  systemName: string;
  description: string;
  commentStatus: string;
  commentCategory: string;
  startDate: string;
  endDatePlan: string;
  endDateFact: string;
  commentExplanation: string;//комментарий к замечанию
  //userName: string;//не увидела в бд у Сергея
  iinumber: number;//номер акта ИИ
};


const DirectionLayout = () => {
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
    
  const router = useRouter();
  const currentDate = new Date; //console.log(currentDate);
  const [accessToken, setAccessToken] = useState<any>('');
const [inputHeight, setInputHeight] = useState(40);
  const {codeCCS} = useGlobalSearchParams();//получение кода ОКС 
  const {capitalCSName} = useGlobalSearchParams();//получение наименование ОКС 
  const [chooseSubobject, setChooseSubobject] = useState('');
  const [chooseSystem, setChooseSystem] = useState('');
  const [chooseStatus, setChooseStatus] = useState('');
  const [listSubObj, setListSubObj] = useState<ListToDrop[]>([]);
  const [listSystem, setListSystem] = useState<ListToDrop[]>([]);
  const [status, setStatus] = useState(true);
  const [statusStructure, setStatusStructure] = useState(true);

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const navigation = useNavigation();
    
  useEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/objs/objects')}>
              <Ionicons name='home-outline' size={25} style={{alignSelf: 'center'}}/>
            </TouchableOpacity>
          ),
        });
  }, [navigation]);
 
  const [direction, setDirection] = useState('Объект');

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

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Note[]>([]);
  const [originalData, setOriginalData] = useState<Note[]>([]);
  const [structure, setStructure] = useState<Structure[]>([]);

  const getNotes = async () => {
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/getAllComments/'+codeCCS,
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }}
      );
      const json = await response.json();
      setData(json);
      setOriginalData(json);
      console.log('ResponseGetNotes:', response);
      console.log('ResponseGetNotes:', json);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
      setStructure(json);
      console.log('ResponseSeeStructure:', response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if(codeCCS && accessToken && status){
     getNotes();
      //getStructure();
      setStatus(false);
    }
    if(data.length > 0 && statusStructure){
      //getNotes();
      getStructure();
      setStatusStructure(false);
    }
    //формирование выпадающего списка для подобъекта
    if (structure.length > 0) {
      const buf = structure.map(item => ({label: item.subObjectName, value: item.subObjectName}));
      setListSubObj(buf);
      
      const allSystemNames = structure.flatMap(structure => 
        structure.data.map(item => item.systemName)
      );
      const uniqueSystemNames = [...new Set(allSystemNames)];
      const systemList = uniqueSystemNames.map(system => ({
        label: system,
        value: system
      }));     
      setListSystem(systemList);
    }
    
  }, [codeCCS, accessToken, structure, data, status]);

  // Добавление сброса выбранного значения в выпадающий список
  useEffect(() => {
    if (chooseSystem !== '' && chooseSystem !== 'Система' && !listSystem.some(item => item.value === 'Система')) { 
      const item = {label: 'Система', value: 'Система'};
      setListSystem(prev => [...prev, item]);
      console.log('new ListSystem', listSystem);
    }
    if (chooseSubobject !== '' && chooseSubobject !== 'Подобъект' && !listSubObj.some(item => item.value === 'Подобъект')) { 
      const item = {label: 'Подобъект', value: 'Подобъект'};
      setListSubObj(prev => [...prev, item]);
      console.log('new ListSystem', listSubObj);
    }
  }, [chooseSystem, listSystem, chooseSubobject, listSubObj]);

  // 3.1 Используем useMemo для фильтрации данных по подобъекту
  const filteredDataSubobj = useMemo(() => {
    if (chooseSubobject === '' && chooseSystem === '') {
      return originalData; // если фильтр не выбран, возвращаем все данные
    }
    return originalData.filter(item => item.subObject === chooseSubobject);
  }, [originalData, chooseSubobject, chooseSystem]);

  const filteredDataSubobjAndStatus = useMemo(() => {
    if ((chooseStatus === '' || chooseStatus==='Все')) {
      return originalData; // если фильтр не выбран, возвращаем все данные
    }
    return originalData.filter(item => item.commentStatus === chooseStatus);
  }, [originalData, chooseSubobject, chooseSystem, chooseStatus]);

  // 3.2 Используем useMemo для фильтрации данных по системе
  const filteredDataSystem = useMemo(() => {
    if (chooseSubobject === '' && chooseSystem === '') {
      return originalData; // если фильтр не выбран, возвращаем все данные
    }
    return originalData.filter(item => item.systemName === chooseSystem);
  }, [originalData, chooseSystem, chooseSubobject]);

  const filteredDataSystemAndSubobj = useMemo(() => {
    if (chooseSubobject === '' && chooseSystem === '') {
      return originalData; // если фильтр не выбран, возвращаем все данные
    }
    const filteredS = filteredDataSubobj;
    return filteredS.filter(item => item.systemName === chooseSystem);

    
  }, [originalData, chooseSystem, chooseSubobject]);

  // 4. Обновляем data при изменении фильтра
  useEffect(() => {
    
    if ((chooseSubobject === '' || chooseSubobject === 'Подобъект') && chooseSystem !== '' && chooseSystem !== 'Система'){ setData(filteredDataSystem); console.log('только система');}
    if ((chooseSystem === '' || chooseSystem === 'Система') && chooseSubobject !== '' && chooseSubobject !== 'Подобъект'){ setData(filteredDataSubobj); console.log('только подобъект'); }
    if (chooseSystem !== '' && chooseSubobject !== '' && chooseSystem !== 'Система' && chooseSubobject !== 'Подобъект'){ setData(filteredDataSystemAndSubobj); console.log('система и подобъект'); }

    //if (chooseSystem === 'Система' && chooseSubobject === 'Подобъект' || chooseSystem === '' && chooseSubobject === 'Подобъект' || chooseSystem === 'Система' && chooseSubobject === ''){setData(filteredDataSubobjAndStatus);}
 
}, [filteredDataSubobj, chooseSystem, chooseSubobject, filteredDataSystem, filteredDataSystemAndSubobj, filteredDataSubobjAndStatus]);

  console.log('chooseSystem',chooseSystem);
  console.log('listSystem',listSystem);
  console.log('data',data);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <View style={{
        flex: 1, alignItems: 'center'
        // justifyContent: 'center', flexDirection: 'row', height: 80, padding: 20, alignSelf: 'flex-start', alignItems: 'stretch', justifyContent: 'space-around',
      }}>
         <View style={{flexDirection: 'row', paddingTop: BOTTOM_SAFE_AREA +15}}>
            <TouchableOpacity onPress={() => router.replace('/objs/objects')}>
                      <Ionicons name='home-outline' size={25} style={{alignSelf: 'center'}}/>
                    </TouchableOpacity>

            <TextInput
                style={{
                  flex: 1,
                  paddingTop:  0,
                  fontWeight: 500,
                  height: Math.max(42,inputHeight), // min: 42, max: 100
                  fontSize: ts(20),
                  textAlign: 'center',          // Горизонтальное выравнивание.
                  textAlignVertical: 'center',  // Вертикальное выравнивание (Android/iOS).
                }}
                multiline
                editable={false}
                onContentSizeChange={e => {
                  const newHeight = e.nativeEvent.contentSize.height;
                  setInputHeight(Math.max(42, newHeight));
                }}
              >
                <Text style={{ fontSize: ts(20), color: '#1E1E1E', fontWeight: 500 }}>
                {capitalCSName}
              </Text>
              {"\n"}
              <Text style={{ fontSize: ts(20), color: '#1E1E1E', fontWeight: 500, paddingTop: 15 }}>
                Замечания
              </Text>
              </TextInput>
              
    
              </View>
              
<View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%'}}>
        <SystemsForTwo list={listSubObj} nameFilter='Подобъект' onChange={(system) => setChooseSubobject(system)}/>
        <SystemsForTwo list={listSystem} nameFilter='Система' onChange={(system) => setChooseSystem(system)}/>
       {/* <SystemsForTwo list={[{"label": "Все", "value": "Все"}, {"label": "Устранено", "value": "Устранено"}, {"label": "Не устранено", "value": "Не устранено"}]} 
        nameFilter='Все' onChange={(system) => setChooseStatus(system)}/> */}
          
        </View>

          <View style={{ flexDirection: 'row', width: '98%', height: 32, paddingTop: 6, justifyContent: 'space-between' }}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E' }}>№</Text>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E' }}>Содержание</Text>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E' }}>Статус</Text>
          </View>

          <View style={{ flex: 15, marginTop: 12}}>

               { isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                style={{width: '100%'}}
                data={data}
                keyExtractor={({commentId}) => commentId}
                renderItem={({item}) => (
                  <TouchableWithoutFeedback onPress={() =>{ router.push({pathname: '/notes/see_note', params: { capitalCSName: capitalCSName, post: item.commentId, codeCCS: codeCCS }})}  }>
                  <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 37, justifyContent: 'center', marginBottom: '5%', borderRadius: 8}}>
          
                      <View style={{width: '15%', justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.serialNumber}</Text>
                      </View>
          
                      <View style={{width: '75%', marginStart: 2, justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.description}</Text>
                      </View>
                      
                      <View style={{width: '7%', marginStart: 2, justifyContent: 'center'}}>
                      
                       {(item.commentStatus =='Устранено') ? ( <Ionicons name="checkbox" size={25} color="#0072C8" />): ''} 
                       {(item.commentStatus =='Устранено с просрочкой') ? ( <Ionicons name="checkbox" size={25} color="#0072C8" />): ''} 
                       {(item.commentStatus =='Не устранено') ? <Ionicons name="square" size={25} color="#F0F9FF" />:''}
                       {(item.commentStatus =='Не устранено с просрочкой') ? ( <Ionicons name="square" size={25} color="#F59E0B" />):''}
                      
                      {/**checkmark-circle-outline , close-circle-outline, square-outline*/}
                     {/*} <Text style={{ fontSize: ts(16), color: '#334155', textAlign: 'center'  }}>{item.commentStatus} </Text>*/}
                      </View>
                  </View>
                  </TouchableWithoutFeedback>

          )}
              />
            )}

          </View>

          
            <CustomButton
              title="Добавить замечание"
              handlePress={() =>router.push({pathname: '/notes/create_note', params: { codeCCS: codeCCS, capitalCSName: capitalCSName }})} />
         
        
      </View >
    </View >

  );
};


type PreviewLayoutProps = PropsWithChildren<{
  // label: string;
 // values: string[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}>;

type PreviewNameProps = PropsWithChildren<{
  values: string[];
}>;

const PreviewName = (
  {
    //childern,
    values,
  }: PreviewNameProps) => (

  <View style={styles.row}>
    {values.map(value => (
      <Text key={value} style={styles.title}>
        {value}
      </Text>

    ))}
  </View>
);

const PreviewLayout = ({
  //  label,
  children,
  values,
  selectedValue,
  setSelectedValue,
}: PreviewLayoutProps) => (
  <View style={{ padding: 6, flex: 1 }}>

    <View style={styles.row}>
      {values.map(value => (
        <TouchableOpacity
          key={value}
          onPress={() => setSelectedValue(value)}
          style={[styles.button, selectedValue === value && styles.selected]}>
          <Text
            style={[
              styles.buttonLabel , 
              selectedValue === value && styles.selectedLabel,
            ]}>
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    <View style={[styles.container,]}>{children}</View>
  </View>
);


const styles = StyleSheet.create(
  
  
  {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: 'normal',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  separator: {
    marginVertical: 5,

    height: 1,
    width: '100%',
  },
  box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //alignItems: 'center',
  },
  button: {
   /* paddingVertical: 6,
    paddingBottom: 6,
    paddingRight: 8,
    paddingLeft: 8,*/
    backgroundColor: '#E0F2FE',
    marginHorizontal: '10%',
    marginBottom: 16,
    width: 103,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',

  },
  //background: #F8FAFC;

  selected: {
    backgroundColor: '#E0F2FE',
   // justifyContent: 'center',
    borderWidth: 0,
  },
  buttonLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#334155',
    //textAlign: 'center',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
});

export default DirectionLayout;

