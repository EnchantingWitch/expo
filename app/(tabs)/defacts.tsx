import CustomButton from '@/components/CustomButton';
import HeaderForTabs from '@/components/HeaderForTabs';
import SystemsForTwo from '@/components/SystemsForTwo';
import useDevice from '@/hooks/useDevice';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import type { Structure } from './structure';

const Defacts = () => {
  const { isDesktopWeb, screenWidth } = useDevice();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<any>('');
  const {codeCCS} = useGlobalSearchParams();//получение кода ОКС 
  const {capitalCSName} = useGlobalSearchParams();//получение наименование ОКС 
  const [chooseSubobject, setChooseSubobject] = useState('');
  const [chooseSystem, setChooseSystem] = useState('');
  const [chooseStatus, setChooseStatus] = useState<string>('Все');
  const [listSubObj, setListSubObj] = useState<ListToDrop[]>([]);
  const [listSystem, setListSystem] = useState<ListToDrop[]>([]);
  const [status, setStatus] = useState(true);
  const [statusStructure, setStatusStructure] = useState(true);
  const statusList = [
  { label: 'Все', value: 'Все' },
  { label: 'Устранено', value: 'Устранено' },
  { label: 'Не устранено', value: 'Не устранено' },
 ];
  
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        //setAccessToken(token);
        if (token !== null) {
            console.log('Retrieved token:', token);
            setAccessToken(token);
        } else {
            console.log('No token found');
            router.push('/sign/sign_in');
        }
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
};

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<[]>([]);
  const [originalData, setOriginalData] = useState<[]>([]);
  const [structure, setStructure] = useState<Structure[]>([]);

  const getNotes = async () => {
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/defectiveActs/getAllDefActs/'+codeCCS,
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }}
      );
      const json = await response.json();
      setData(json);
      setOriginalData(json);
      console.log('ResponseGetDefacts:', response);
      console.log('ResponseGetDefacts:', json);
      
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
      setStatus(false);
    }
    if(data.length > 0 && statusStructure){
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
    if (chooseSystem !== '' && chooseSystem !== 'Все системы' && !listSystem.some(item => item.value === 'Все системы')) { 
      const item = {label: 'Все системы', value: 'Все системы'};
      setListSystem(prev => [...prev, item]);
      console.log('new ListSystem', listSystem);
    }
    if (chooseSubobject !== '' && chooseSubobject !== 'Все подобъекты' && !listSubObj.some(item => item.value === 'Все подобъекты')) { 
      const item = {label: 'Все подобъекты', value: 'Все подобъекты'};
      setListSubObj(prev => [...prev, item]);
      console.log('new ListSystem', listSubObj);
    }
  }, [chooseSystem, listSystem, chooseSubobject, listSubObj]);

  const filteredData = useMemo(() => {
  let result = originalData;

  // Фильтрация по подобъекту
  if (chooseSubobject && chooseSubobject !== 'Все подобъекты') {
    result = result.filter(item => item.subObject === chooseSubobject);
  }

  // Фильтрация по системе
  if (chooseSystem && chooseSystem !== 'Все системы') {
    result = result.filter(item => item.systemName === chooseSystem);
  }

  // Фильтрация по статусу
  if (chooseStatus && chooseStatus !== 'Все') {
    result = result.filter(item => item.defectiveActStatus === chooseStatus);
  }

  return result;
}, [originalData, chooseSubobject, chooseSystem, chooseStatus]);

// Обновление данных при изменении фильтров
  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  return (
<View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <HeaderForTabs capitalCSName={capitalCSName} nameTab='Дефекты'/>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: isDesktopWeb&& screenWidth>900? 900 : '96%',
          }}
        >
          <SystemsForTwo
            list={listSubObj}
            nameFilter="Все подобъекты"
            width={isDesktopWeb? 130: 80}
            onChange={(system) => setChooseSubobject(system)}
          />
          <SystemsForTwo
            list={listSystem}
            nameFilter="Все системы"
            width={isDesktopWeb? 130: 80}
            onChange={(system) => setChooseSystem(system)}
          />
          <SystemsForTwo
            list={statusList}
            nameFilter="Все"
            width={isDesktopWeb? 130: 80}
            onChange={(status) => setChooseStatus(status)}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            width: isDesktopWeb && screenWidth>900? 900 : '95%',
            height: 32,
            paddingTop: 12,
          }}
        >
          <View style = {{width: '12%'}}>
            <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center'}}>№</Text>
          </View>
          <View style = {{width: '73%'}}>
            <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Содержание</Text>
          </View>
          <View style = {{width: '14%' }}>
            <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Статус</Text>
          </View>
        </View>

        <View style={{ flex: 15, marginTop: 12, width: isDesktopWeb&& screenWidth>900? 900 : '96%', }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              style={{ width: "100%" }}
              data={data}
              keyExtractor={({ id }) => id}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() =>{ router.push({pathname: '/defacts/see_defact', params: { capitalCSName: capitalCSName, post: item.id, codeCCS: codeCCS }})}  }>
                  
                  <View
                    style={{
                      backgroundColor: "#E0F2FE",
                      flexDirection: "row",
                      width: "100%",
                      height: 42,
                      justifyContent: "center",
                      marginBottom: 15,
                      borderRadius: 8,
                    }}
                  >
                    <View style={{ width: "12%", justifyContent: "center" }}>
                      <Text
                        style={{
                          fontSize: ts(14),
                          color: "#334155",
                          textAlign: "center",
                        }}
                      >
                        {item.serialNumber}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: "75%",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                      numberOfLines={2}
                        style={{
                          fontSize: ts(14),
                          color: "#334155",
                          textAlign: "left",
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: "12%",
                        justifyContent: "center",
                        alignItems: 'center',
                      }}
                    >
                        {(item.defectiveActStatus =='Устранено') ? ( <Ionicons name="checkbox" size={25} color="#0072C8" />): ''} 
                        
                        {(item.defectiveActStatus =='Не устранено') ? <Ionicons name="square" size={25} color="#F0F9FF" />:''}

                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          )}

        </View>
        <CustomButton
          title="Добавить дефект"
          handlePress={() =>router.push({pathname: '/defacts/create_defact', params: { codeCCS: codeCCS, capitalCSName: capitalCSName }})} />
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

export default Defacts;

