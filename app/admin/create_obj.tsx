//import SmartKeyboardView from '@/components/SmartKeyboardView';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import ListOfOrganizations from '@/components/ListOfOrganizations';
import ListOfRegion from '@/components/ListOfRegion';
import { } from '@/components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Object = {

};

export default function TabOneScreen() {
  
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Object[]>([]);

  const [oks, setOks] = useState<string>('');//наименование окс
  const [key, setKey] = useState<string>('');//код ОКС
  const [region, setRegion] = useState<string>();//регион
  const [typeObj, setTypeObj] = useState<string>();//тип окс
  const [charterer, setCharterer] = useState<string>();//заказчик
  const [cuCharterer, setCuCharterer] = useState<string>();//куратор от заказчика
  const [executorPnr, setExecutorPnr] = useState<string>();//исполнитель пнр
  const [dirPnr, setDirPnr] = useState<string>();//руководитель пнр
  const [executorCmr, setExecutorCmr] = useState<string>();//исполнитель смр
  const [cuCmr, setCuCmr] = useState<string>();//куратор смр
  const [accessToken, setAccessToken] = useState<any>('');
  const [disabled, setDisabled] = useState(false); //для кнопки
  
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

console.log (oks, 'oks');
console.log (key, 'key');

console.log('oks === || key===', oks ==='' || key==='')

const request = async () => {
    setDisabled(true);
    if(oks ==='' || key===''){
          Alert.alert('', 'Заполните поля наименования объекта и кода ОКС.', [
                                  {text: 'OK', onPress: () => console.log('OK Pressed')}])
                     setDisabled(false);
                     return;
                   }
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
  /*  if (response.status == 400) {
      Alert.alert('', 'Объект не добавлен (возможно ОКС с введенным кодом уже существует).', [
             {text: 'OK', onPress: () => console.log('OK Pressed')}])
    };*/
  } catch (error) {
    Alert.alert('', 'Произошла ошибка при создании объекта: ' + error, [
                 {text: 'OK', onPress: () => console.log('OK Pressed')},
              ])
    setDisabled(false);
    console.error('Error:', error);
  } finally {
    setDisabled(false);
    router.replace('./menu');
  }

};

  useEffect(() => {
    getToken();  
  }, []);
  
  const [statusOrg, setStatusOrg] = useState(false);
  const [statusTypeObj, setStatusTypeObj] = useState(false);
  const [statusRegion, setStatusRegion] = useState(false);

  const [listOrganization, setListOrganization] = useState<[]>();
  const [listTypeObj, setListTypeObj] = useState<[]>();
  const [listRegion, setListRegion] = useState<[]>();

  useEffect(() => {
      if (accessToken) {
        getOrganisations();
        getRegions();
        getTypeObjs();
      }
    }, [accessToken]);

  useEffect(() => {
    if (listOrganization) {
      setStatusOrg(true);    
    }
    if (listTypeObj) {
      setStatusTypeObj(true);    
    }
    if (listRegion) {
      setStatusRegion(true);    
    }
  }, [listOrganization, listTypeObj, listRegion]);



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

  const getTypeObjs = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/directories/getObjectTypes',
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      console.log('responseGetOrganisations', response);
      const json = await response.json();
      const transformedData = json.map(item => ({
            label: item,
            value: item,
        }));
        setListTypeObj(transformedData);
        
      console.log(json);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  
  const getRegions = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/directories/getRegions',
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      console.log('responseGetOrganisations', response);
      const json = await response.json();
      console.log(json);
     const result = Object.entries(json).map(([value, label]) => ({
        label,
        value
      }));
        setListRegion(result);
        console.log('transformedData', result)
      
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <KeyboardAwareScrollView
         style={{ flex: 1, backgroundColor: 'white' }}
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
       //enableAutomaticScroll={false}
      contentContainerStyle={{ 
        flexGrow: 1,
        alignItems: 'center',  // ← Перенесено сюда
        justifyContent: 'center',  // ← Перенесено сюда
      }}
            >
{/*</KeyboardAwareScrollView>    <KeyboardAwareScrollView
  style={{ flex: 1 }}
  enableOnAndroid={true}
  extraScrollHeight={100}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{ 
    flexGrow: 1,
    //paddingBottom: 100, // Добавляем отступ снизу
  }}
  enableResetScrollToCoords={false} // Отключаем автоматический скролл
  //extraHeight={200} // Дополнительное пространство для клавиатуры
>*/}
    <View style={styles.container}>
      <FormField title='Объект капитального строительства' onChange={(value) => setOks(value)}/>{/** value={} для динамической подгрузки, передавать в компонент и через useEffect изменять, запрос нужен ли? */}
      <FormField title='Код ОКС' onChange={(value) => setKey(value)}/>
{/*         <AdaptiveDropdown
          data={countries}
          value={selectedCountry}
          onChange={setSelectedCountry}
          placeholder="Выберите страну"
          style={styles.input}
        />*/}
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Регион</Text>
      <ListOfRegion items={listRegion} modalTitle='Регион'  selectedValue={region} isEnabled={true} onValueChange={(value) => setRegion(value)}/>
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Тип объекта</Text>
      <ListOfOrganizations data={listTypeObj} title='Тип объекта' label={`Тип объекта`} post={typeObj} status={statusTypeObj} onChange={(value) => setTypeObj(value)}/>
      {/*<FormField title='Заказчик' onChange={(value) => setCharterer(value)}/>*/}
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Заказчик</Text>
      <ListOfOrganizations data={listOrganization} title='' label={`Заказчик`} post={charterer} status={statusOrg} onChange={(value) => setCharterer(value)}/>
      <FormField title='Куратор от заказчика' onChange={(value) => setCuCharterer(value)}/>
      {/*<FormField title='Исполнитель ПНР' onChange={(value) => setExecutorPnr(value)}/>*/}
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель ПНР</Text>
      <ListOfOrganizations data={listOrganization} label={`Исполнитель ПНР`} title='' post={executorPnr} status={statusOrg} onChange={(value) => setExecutorPnr(value)}/>
      <FormField title='Руководитель ПНР' onChange={(value) => setDirPnr(value)}/>
      {/*<FormField title='Исполнитель СМР' onChange={(value) => setExecutorCmr(value)}/>*/}
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель СМР</Text>
      <ListOfOrganizations data={listOrganization} label={`Исполнитель СМР`} title='' post={executorCmr} status={statusOrg} onChange={(value) => setExecutorCmr(value)}/>
      <FormField title='Куратор СМР' onChange={(value) => setCuCmr(value)}/>
      <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 20 }}>
        <CustomButton title='Сохранить' disabled={disabled} handlePress={request}/>
    </View>
    </View>
    </KeyboardAwareScrollView>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',//alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'white',

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
