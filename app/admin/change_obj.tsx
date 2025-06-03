import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import ListOfOrganizations from '@/components/ListOfOrganizations';
import ListOfRegion from '@/components/ListOfRegion';
import ListTypeObj from '@/components/ListTypeObj';
import { } from '@/components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

type Object = {

};

export default function TabOneScreen() {
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Object[]>([]);

  const {capitalCSId} = useLocalSearchParams(); 
  const {codeCCS} = useLocalSearchParams(); 
  const {capitalCSName} = useLocalSearchParams(); 
  const {ciwexecutor} = useLocalSearchParams(); 
  const {ciwsupervisor} = useLocalSearchParams(); 
  const {customer} = useLocalSearchParams(); 
  const {customerSupervisor} = useLocalSearchParams(); 
  const {cwexecutor} = useLocalSearchParams(); 
  const {cwsupervisor} = useLocalSearchParams();  
  const {locationRegion} = useLocalSearchParams();  
  const {objectType} = useLocalSearchParams();  

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
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    if(codeCCS){setOks(capitalCSName);
    setKey(codeCCS);}
    if(ciwexecutor){
    setRegion(locationRegion);
    setTypeObj(objectType);
    setCharterer(customer);
    setCuCharterer(customerSupervisor);
    setExecutorPnr(ciwexecutor);
    setDirPnr(ciwsupervisor);
    setExecutorCmr(cwexecutor);
    setCuCmr(cwsupervisor);
    setStatus(true);
    }
    
  }, [codeCCS, ciwexecutor]);
  
    
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
    let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/updateCapitalCS/' + capitalCSId, {
      method: 'PUT',
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
    console.log(JSON.stringify({
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
      }));
    console.log('ResponseUpdateObj:', response);
    if (response.status == 200){
      Alert.alert('', 'Данные по объекту обновлены.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
    }
    if (response.status == 400) {
      Alert.alert('', 'Данные по объекту не обновлены.', [
             {text: 'OK', onPress: () => console.log('OK Pressed')}])
    };
  } catch (error) {
    console.error('Error:', error);
  } finally {
    router.replace('./objs');
  }

};

const deleteObject = async () => {
    try {
      let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/deleteCapitalCS/'+capitalCSId, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
      });
    console.log('deleteObject', response);
    if (response.status === 200) {
      Alert.alert('', 'Объект удален.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
    }
    else {
      Alert.alert('', 'Произошла ошибка при удалении.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
    }
  } catch (err) {
  } finally {
    router.replace({pathname: './objs'});
  }
  }

useEffect(() => {
    getToken();  
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <ScrollView>
    <View style={styles.container}>
      {/** value={} для динамической подгрузки, передавать в компонент и через useEffect изменять, запрос нужен ли? */}
       <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Объект капитального строительства</Text>
        <TextInput
            style={[ {fontSize: ts(14),  backgroundColor: '#FFFFFF', borderRadius: 8,borderWidth: 1, borderColor: '#D9D9D9', width: '96%', height: 42, paddingVertical: 'auto', color: '#B3B3B3', textAlign: 'center', marginBottom: 20,}]}
            placeholderTextColor="#111"
            onChangeText={setOks}
            value={oks}
            // editable={false}
        />
        
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Код ОКС</Text>
        <TextInput
            style={[ {fontSize: ts(14),  backgroundColor: '#FFFFFF', borderRadius: 8,borderWidth: 1, borderColor: '#D9D9D9', width: '96%', height: 42, paddingVertical: 'auto', color: '#B3B3B3', textAlign: 'center', marginBottom: 20,}]}
            placeholderTextColor="#111"
            onChangeText={setKey}
            value={key}
            // editable={false}
        />
      <ListOfRegion post={region} onChange={(value) => setRegion(value)}/>
      <ListTypeObj post={typeObj} onChange = {(value) => setTypeObj(value)}/>
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Заказчик</Text>
      <ListOfOrganizations title='' post={charterer} status={status} onChange={(value) => setCharterer(value)}/>
      <FormField title='Куратор от заказчика' post={cuCharterer} onChange={(value) => setCuCharterer(value)}/>
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель ПНР</Text>
      <ListOfOrganizations title='' post={executorPnr} status={status} onChange={(value) => setExecutorPnr(value)}/>
      <FormField title='Руководитель ПНР' post={dirPnr} onChange={(value) => setDirPnr(value)}/>
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель СМР</Text>
      <ListOfOrganizations title='' post={executorCmr} status={status} onChange={(value) => setExecutorCmr(value)}/>
      <FormField title='Куратор СМР' post={cuCmr} onChange={(value) => setCuCmr(value)}/>
    </View>
    </ScrollView>
    <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 20 }}>
        <CustomButton title='Сохранить' handlePress={request}/>
        <CustomButton title='Удалить объект' handlePress={deleteObject}/>
    </View>
    </SafeAreaView>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',//alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    zIndex: 1000,

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
