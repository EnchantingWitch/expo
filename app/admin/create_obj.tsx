import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import {  } from '@/components/Themed';
import { Link, Tabs, Redirect, router } from 'expo-router';
import FormField from '@/components/FormField';
import ListTypeObj from '@/components/ListTypeObj';
import React, { Component, useState, useEffect } from 'react';
import CustomButton from '@/components/CustomButton';

type Object = {

};

export default function TabOneScreen() {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Object[]>([]);

  const [oks, setOks] = useState<string>();//наименование окс
  const [key, setKey] = useState<string>();//код ОКС
  const [region, setRegion] = useState<string>();//регион
  const [typeObj, setTypeObj] = useState<string>();//тип окс
  const [charterer, setCharterer] = useState<string>();//заказчик
  const [cuCharterer, setCuCharterer] = useState<string>();//куратор от заказчика
  const [executorPnr, setExecutorPnr] = useState<string>();//исполнитель пнр
  const [dirPnr, setDirPnr] = useState<string>();//руководитель пнр
  const [executorCmr, setExecutorCmr] = useState<string>();//исполнитель смр
  const [cuCmr, setCuCmr] = useState<string>();//куратор смр

  const request = () => {
    router.push('/admin/menu')
  }
   /* const getStructure = async () => {
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
      }, []);*/

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>
      <FormField title='Объект капитального строительства' onChange={(value) => setOks(value)}/>{/** value={} для динамической подгрузки, передавать в компонент и через useEffect изменять, запрос нужен ли? */}
      <FormField title='Код ОКС' onChange={(value) => setKey(value)}/>
      <FormField title='Регион' onChange={(value) => setRegion(value)}/>
      <ListTypeObj onChange = {(value) => setTypeObj(value)}/>
      <FormField title='Заказчик' onChange={(value) => setCharterer(value)}/>
      <FormField title='Куратор от заказчика' onChange={(value) => setCuCharterer(value)}/>
      <FormField title='Исполнитель ПНР' onChange={(value) => setExecutorPnr(value)}/>
      <FormField title='Руководитель ПНР' onChange={(value) => setDirPnr(value)}/>
      <FormField title='Исполнитеь СМР' onChange={(value) => setExecutorCmr(value)}/>
      <FormField title='Куратор СМР' onChange={(value) => setCuCmr(value)}/>
        <CustomButton title='Сохранить' handlePress={request}/>
    </View>
    </ScrollView>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',//alignItems: 'center',
    width: '100%',
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
