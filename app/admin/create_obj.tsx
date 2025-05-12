import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import ListOfRegion from '@/components/ListOfRegion';
import ListTypeObj from '@/components/ListTypeObj';
import { } from '@/components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

type Object = {

};

export default function TabOneScreen() {
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
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
  const [accessToken, setAccessToken] = useState<any>('');
  
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
  const request = async () => {
    try {
    let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/createObject', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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

useEffect(() => {
    getToken();  
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>
      <FormField title='Объект капитального строительства' onChange={(value) => setOks(value)}/>{/** value={} для динамической подгрузки, передавать в компонент и через useEffect изменять, запрос нужен ли? */}
      <FormField title='Код ОКС' onChange={(value) => setKey(value)}/>
      <ListOfRegion onChange={(value) => setRegion(value)}/>
      <ListTypeObj onChange = {(value) => setTypeObj(value)}/>
      <FormField title='Заказчик' onChange={(value) => setCharterer(value)}/>
      <FormField title='Куратор от заказчика' onChange={(value) => setCuCharterer(value)}/>
      <FormField title='Исполнитель ПНР' onChange={(value) => setExecutorPnr(value)}/>
      <FormField title='Руководитель ПНР' onChange={(value) => setDirPnr(value)}/>
      <FormField title='Исполнитель СМР' onChange={(value) => setExecutorCmr(value)}/>
      <FormField title='Куратор СМР' onChange={(value) => setCuCmr(value)}/>
      <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 20 }}>
        <CustomButton title='Сохранить' handlePress={request}/>
    </View>
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
