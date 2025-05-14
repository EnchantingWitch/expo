import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export default function Docs() {
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
  
 /*   const getCommonInf= async () => {
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
      };*/
    
      useEffect(() => {
        getToken();
        //if (accessToken){getCommonInf();} здесь запрос к бд должен быть
      }, [accessToken]);

      const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const handleLink = async (event, link) => {
    try {
       if (Platform.OS !== 'web') {
                  // Предотвращаем стандартное поведение открытия ссылки в браузере по умолчанию на мобильных устройствах
                  event.preventDefault();
                  // Открываем ссылку во встроенном браузере приложения
                  await openBrowserAsync(link);
                } else {
                  // На вебе открываем ссылку в новой вкладке
                  window.open(link, '_blank');
                }
    } catch (error) {
      Alert.alert('Ошибка', `${error}`, [
                                {text: 'OK', onPress: () => console.log('OK Pressed')}])
        console.error('Error retrieving token:', error);
    }
};
     

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
        <View style={{flexDirection: 'row',}}>
            <TouchableOpacity onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/1QPfYxLpGUXH7IjP3QHOR_DDQ7yBZxvsw?usp=sharing")}} 
            style={{width: '50%', alignItems: 'center', marginBottom: 15}}>
                    <Image 
                    style={{ width: 100, height: 100 }}
                    source={require('../../assets/images/WorkDocs.svg')} 
                    />
                    <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center' }}>Рабочая</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/19GtmZhV7ZBnAJFZMAg2P9TXwjrzzEMwB?usp=sharing")}}
             style={{width: '50%', alignItems: 'center', marginBottom: 15}}>
                    <Image 
                    style={{ width: 100, height: 100 }}
                    source={require('../../assets/images/factoryDocs.svg')} 
                    />
                    <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center' }}>Заводская</Text>
            </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row',}}>
            <TouchableOpacity onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/1BFdk1S5iuZl6ySTI48MZYd15jlWuxx_8?usp=sharing")}}
             style={{width: '50%', alignItems: 'center', marginBottom: 15}}>
                    <Image 
                    style={{ width: 100, height: 100 }}
                    source={require('../../assets/images/preparationDocs.svg')} 
                    />
                    <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center' }}>Подготовительная</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/1VGxUo6iSzaisRgOFenGP0ZvqMZdeFaEG?usp=sharing")}}
             style={{width: '50%', alignItems: 'center', marginBottom: 15}}>
                    <Image 
                    style={{ width: 100, height: 100 }}
                    source={require('../../assets/images/executionDocs.svg')} 
                    />
                    <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center' }}>Исполнительная</Text>
            </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row',}}>
            <TouchableOpacity onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/14d62EIGcNx4Qre6TYaJ4nDBad9f7ItZq?usp=sharing")}}
             style={{width: '50%', alignItems: 'center', marginBottom: 15}}>
                    <Image 
                    style={{ width: 100, height: 100 }}
                    source={require('../../assets/images/standartDocs.svg')} 
                    />
                    <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center' }}>Нормативная</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{width: '50%', alignItems: 'center', marginBottom: 15}}
              onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/1JAYL2fHQ5aRSj3t9WPz8xHdaw8EYJ6jS?usp=sharing")}}
            >
              <Image 
                style={{ width: 100, height: 100 }}
                source={require('../../assets/images/monitoring.svg')} 
              />
              <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center' }}>
                Мониторинг ПНР
              </Text>
            </TouchableOpacity>
        </View>
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
