import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import {  } from '@/components/Themed';
import { Link, Tabs, Redirect, router } from 'expo-router';
import FormField from '@/components/FormField';
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
      <FormField title='Объект капитального строительства' value={}/>
      <FormField title='Код ОКС' value={}/>
      <FormField title='Регион' value={}/>
        
      <FormField title='Заказчик' value={}/>
      <FormField title='Куратор от заказчика' value={}/>
      <FormField title='Исполнитель ПНР' value={}/>
      <FormField title='Исполнитеь СМР' value={}/>
      <FormField title='Куратор СМР' value={}/>
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
