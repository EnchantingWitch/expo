import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Link, Tabs, Redirect, router, useGlobalSearchParams, useRouter, useLocalSearchParams } from 'expo-router';
import FormForObj from '@/components/FormForObj';
import React, { Component, useState, useEffect } from 'react';



type Object = {
  systemsPNRTotalQuantity: number; //всего систем
  systemsPNRQuantityAccepted: number; //принятых систем
  actsIITotalQuantity: number;//всего ии
  actsIISignedQuantity: number;//подписанные ии
  actsKOTotalQuantity: number;
  actsKOSignedQuantity: number;//подписанные ко
  commentsTotalQuantity: number;//всего замечаний
  commentsNotResolvedQuantity: number;//не устранено замечаний
  defectiveActsTotalQuantity: number;
  defectiveActsNotResolvedQuantity: number;
  busyStaff: number;
};

export default function TabOneScreen() {
  const router = useRouter();
  const {ID} = useGlobalSearchParams();//получение id объекта
 /* console.log(Id, 'Id object');
  const ID = Id;*/
  console.log(ID, 'ID object');
  //router.setParams({ ID: ID });

  const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState<Object[]>([]);
  
    const getStructure = async () => {
        try {
          const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/objectCommonInf/051-2000973.0023');
          const json = await response.json();
          setData(json);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        getStructure();
      }, []);

     

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>
      <FormForObj title='Принято в ПНР' handlePress={() => router.push('./structure')} text1='Всего' text2='Подписано' text3='Динамика' number1={data.systemsPNRTotalQuantity} number2={data.systemsPNRQuantityAccepted} number3={0}></FormForObj>
      <FormForObj title='Акты ИИ' handlePress={() => router.push('./structure')} text1='Всего' text2='Подписано' text3='Динамика' number1={data.actsIITotalQuantity} number2={data.actsIISignedQuantity} number3={0}></FormForObj>
      <FormForObj title='Акты КО' handlePress={() => router.push('./structure')} text1='Всего' text2='Подписано' text3='Динамика' number1={data.actsKOTotalQuantity} number2={data.actsKOSignedQuantity} number3={0}></FormForObj>
      <FormForObj title='Замечания' handlePress={() => router.push('./two')} text1='Всего' text2='Не устранено'  number1={data.commentsTotalQuantity} number2={data.commentsNotResolvedQuantity} ></FormForObj>
      <FormForObj title='Дефекты оборудования' text1='Всего' text2='Не устранено'  number1={data.defectiveActsTotalQuantity} number2={data.defectiveActsNotResolvedQuantity}></FormForObj>
      <FormForObj title='Персонал' text1='Всего' text2='Динамика' number1={data.busyStaff} number2={0} ></FormForObj>
    </View>
    </ScrollView>
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
