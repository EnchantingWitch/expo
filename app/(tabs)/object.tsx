import FormForObj from '@/components/FormForObj';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View, } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


type Object = {
  systemsPNRTotalQuantity: number; //всего систем
  systemsPNRQuantityAccepted: number; //принятых систем
  systemsPNRDynamic: number;
  actsIITotalQuantity: number;//всего ии
  actsIISignedQuantity: number;//подписанные ии
  actsIIDynamic: number;
  actsKOTotalQuantity: number;
  actsKOSignedQuantity: number;//подписанные ко
  actsKODynamic: number;
  commentsTotalQuantity: number;//всего замечаний
  commentsNotResolvedQuantity: number;//не устранено замечаний
  defectiveActsTotalQuantity: number;
  defectiveActsNotResolvedQuantity: number;
  busyStaff: number;
};

export default function TabOneScreen() {
   const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  
  const router = useRouter();
  const {codeCCS} = useGlobalSearchParams();//получение код ОКС
  const {capitalCSName} = useGlobalSearchParams();//получение код ОКС
    const [inputHeight, setInputHeight] = useState(40);
 // const {capitalCSName} = useGlobalSearchParams();//получение код ОКС
 /* console.log(Id, 'Id object');
  const ID = Id;*/
  console.log(codeCCS, 'codeCCS object');
  const [accessToken, setAccessToken] = useState<any>('');
  //router.setParams({ ID: ID });

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
    const [data, setData] = useState<Object[]>([]);
  
    const getCommonInf= async () => {
        try {
          const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/objectCommonInf/'+codeCCS,
            {method: 'GET',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }}
          );
          const json = await response.json();
          setData(json);
          console.log('responseCommonInfObj', response);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        getToken();
        if (accessToken){getCommonInf();}
      }, [accessToken]);

      const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};
     

  return (
   <View style={{ flex: 1, backgroundColor: 'white' }}>
     <View style={{flexDirection: 'row', paddingTop: BOTTOM_SAFE_AREA +15 }}>
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
        {capitalCSName}
      </TextInput>
      </View>
    <ScrollView >
    <View style={styles.container}>
   
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: 400, marginBottom: 8, textAlign: 'right' }}>{codeCCS}</Text>
      <FormForObj title='Принято в ПНР' handlePress={() => router.navigate('./structure')} text1='Всего' text2='Подписано' text3='Динамика' number1={data.systemsPNRTotalQuantity} number2={data.systemsPNRQuantityAccepted} number3={data.systemsPNRDynamic}></FormForObj>
      <FormForObj title='Акты ИИ' handlePress={() => router.navigate('./structure')} text1='Всего' text2='Подписано' text3='Динамика' number1={data.actsIITotalQuantity} number2={data.actsIISignedQuantity} number3={data.actsIIDynamic}></FormForObj>
      <FormForObj title='Акты КО' handlePress={() => router.navigate('./structure')} text1='Всего' text2='Подписано' text3='Динамика' number1={data.actsKOTotalQuantity} number2={data.actsKOSignedQuantity} number3={data.actsKODynamic}></FormForObj>
      <FormForObj title='Замечания' handlePress={() => router.navigate('./two')} text1='Всего' text2='Не устранено'  number1={data.commentsTotalQuantity} number2={data.commentsNotResolvedQuantity} ></FormForObj>
      <FormForObj title='Дефекты оборудования' text1='Всего' text2='Не устранено'  number1={data.defectiveActsTotalQuantity} number2={data.defectiveActsNotResolvedQuantity}></FormForObj>
      <FormForObj title='Персонал' text1='Всего' text2='Динамика' number1={data.busyStaff} number2={0} ></FormForObj>
    </View>
    </ScrollView></View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '98%',
    justifyContent: 'center',

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
