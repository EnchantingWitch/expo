import { SafeAreaView, StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
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

  const request = async () => {
    try {
    let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/createObject', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        capitalCSName: oks,
        codeCCS: key,
        locationRegion: region,
        objectType: typeObj,
        customer: charterer,//заказчик
        ciwexecutor: executorPnr,//исполнитель СМР
        cwexecutor: executorCmr,//исполнитель ПНР
        customerSupervisor: cuCharterer,// Куратор заказчика
        cwsupervisor: dirPnr, // Куратор ПНР
        ciwsupervisor: cuCmr, // куратор СМР 
      }),
    });
    console.log('Response:', response);
    if (response.status == 200){
      Alert.alert('', 'Объект добавлен.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
    }
    if (response.status == 400) {
      Alert.alert('', 'Объект не добавлен (возможно ОКС с введенным кодом уже существует).', [
             {text: 'OK', onPress: () => console.log('OK Pressed')}])
    };
  } catch (error) {
    console.error('Error:', error);
  } finally {
    router.replace('./menu');
  }

};

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
      <FormField title='Исполнитель СМР' onChange={(value) => setExecutorCmr(value)}/>
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
