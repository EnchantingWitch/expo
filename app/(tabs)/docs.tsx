import CustomButton from '@/components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { default as React, useEffect, useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

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
  const [nameLink, setNameLink] = useState<any>('');
  const [urlFetch, setUrlFetch] = useState<any>('');
  const [modalStatus, setModalStatus] = useState<boolean>(false);
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

      useEffect(() => {
        if(urlFetch!=='' && nameLink!==''){ setModalStatus(true)}
      }, [urlFetch, nameLink]);
      console.log(urlFetch!=='', 'urlFetch')

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

const modalLinkSave = async () => {
  //прописать фетч здесь, в конце фетч прописать setUrlfetch('');
  //linkFromDB будут прописаны в отдельные переменные из json
  //
  
      try {
      let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/updateCapitalCSInfo/'+codeCCS , {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        workingDocsLink: 'https://drive.google.com/drive/folders/1QPfYxLpGUXH7IjP3QHOR_DDQ7yBZxvsw?usp=sharing', //рабочая документация
        executiveDocsLink: 'https://drive.google.com/drive/folders/1QPfYxLpGUXH7IjP3QHOR_DDQ7yBZxvsw?usp=sharing', // исполнительная док-ция
        operationalDocsLink: 'https://drive.google.com/drive/folders/1QPfYxLpGUXH7IjP3QHOR_DDQ7yBZxvsw?usp=sharing', // эксплуотационная док -ция
        preparatoryDocsLink: 'https://drive.google.com/drive/folders/1QPfYxLpGUXH7IjP3QHOR_DDQ7yBZxvsw?usp=sharing' // подготовительная док-ция
        }),
      });
      console.log('ResponseUpdateObj:', response);
     /* if (response.status == 200){
        Alert.alert('', 'Данные по объекту обновлены.', [
          {text: 'OK', onPress: () => console.log('OK Pressed')}])
      }
      if (response.status == 400) {
        Alert.alert('', 'Данные по объекту не обновлены.', [
               {text: 'OK', onPress: () => console.log('OK Pressed')}])
      };*/
    } catch (error) {
      console.error('Error:', error);
    } finally {
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
              <Text style={{ fontSize: ts(20), color: '#1E1E1E', fontWeight: 500 }}>
                {capitalCSName}
              </Text>
              {"\n"}
              <Text style={{ fontSize: ts(20), color: '#1E1E1E', fontWeight: 500, paddingTop: 15 }}>
                Документация
              </Text>
      </TextInput>
      </View>

    <ScrollView >
    <View style={styles.container}>
        <View style={{flexDirection: 'row',}}>

            <TouchableOpacity onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/1QPfYxLpGUXH7IjP3QHOR_DDQ7yBZxvsw?usp=sharing")}} 
            style={{width: '50%', alignItems: 'center', marginBottom: 15}}>
              <View style={{flexDirection: 'row'}}>
                    <Image 
                    style={{ width: 100, height: 100, marginLeft: '15%' }}
                    source={require('../../assets/images/WorkDocs.svg')} 
                    />
                    <TouchableOpacity style={{ alignItems: 'flex-end', width: 35}} onPress={()=>[setUrlFetch('link'), setNameLink('рабочей')]}>
                        <Ionicons name='link-outline' size={24} color='#0072C8' style={{alignSelf: 'center'}}/>
                      </TouchableOpacity>
              </View>
                      <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center', marginLeft: -7 }}>Рабочая</Text>
                     
            </TouchableOpacity>

            <TouchableOpacity onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/19GtmZhV7ZBnAJFZMAg2P9TXwjrzzEMwB?usp=sharing")}}
             style={{width: '50%', alignItems: 'center', marginBottom: 15}}>
              <View style={{flexDirection: 'row'}}>
                    <Image 
                    style={{ width: 100, height: 100, marginLeft: '15%' }}
                    source={require('../../assets/images/factoryDocs.svg')} 
                    />
                    <TouchableOpacity style={{ alignItems: 'flex-end', width: 35}} onPress={()=>[setUrlFetch('link'), setNameLink('заводской')]}>
                        <Ionicons name='link-outline' size={24} color='#0072C8' style={{alignSelf: 'center'}}/>
                      </TouchableOpacity>
              </View>
                    
                      <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center', marginLeft: -7 }}>Заводская</Text>
                      
            </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row',}}>

            <TouchableOpacity onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/1BFdk1S5iuZl6ySTI48MZYd15jlWuxx_8?usp=sharing")}}
             style={{width: '50%', alignItems: 'center', marginBottom: 15}}>
              <View style={{flexDirection: 'row'}}>
                    <Image 
                    style={{ width: 100, height: 100, marginLeft: '15%' }}
                    source={require('../../assets/images/preparationDocs.svg')} 
                    />
                    <TouchableOpacity style={{ alignItems: 'flex-end',  width: 35}} onPress={()=>[setUrlFetch('link'), setNameLink('подготовительной')]}>
                        <Ionicons name='link-outline' size={24} color='#0072C8' style={{alignSelf: 'center'}}/>
                      </TouchableOpacity>
              </View>
                   
                      <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center', marginLeft: -7 }}>Подготовительная</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/1VGxUo6iSzaisRgOFenGP0ZvqMZdeFaEG?usp=sharing")}}
             style={{width: '50%', alignItems: 'center', marginBottom: 15}}>
              <View style={{flexDirection: 'row'}}>
                    <Image 
                    style={{ width: 100, height: 100, marginLeft: '15%' }}
                    source={require('../../assets/images/executionDocs.svg')} 
                    />
                    <TouchableOpacity style={{ alignItems: 'flex-end', width: 35}} onPress={()=>[setUrlFetch('link'), setNameLink('исполнительной')]}>
                        <Ionicons name='link-outline' size={24} color='#0072C8' style={{alignSelf: 'center'}}/>
                      </TouchableOpacity>
              </View>
                    <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center', marginLeft: -7 }}>Исполнительная</Text>
            </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row',}}>

            <TouchableOpacity onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/14d62EIGcNx4Qre6TYaJ4nDBad9f7ItZq?usp=sharing")}}
             style={{width: '50%', alignItems: 'center', marginBottom: 15}}>
            
                    <Image 
                    style={{ width: 100, height: 100, marginLeft: -7 }}
                    source={require('../../assets/images/standartDocs.svg')} 
                    />
                    
                    <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center', marginLeft: -7 }}>Нормативная</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{width: '50%', alignItems: 'center', marginBottom: 15}}
              onPress={(event) => {handleLink(event, "https://drive.google.com/drive/folders/1JAYL2fHQ5aRSj3t9WPz8xHdaw8EYJ6jS?usp=sharing")}}
            >
              <Image 
                style={{ width: 100, height: 100 , marginLeft: -7 }}
                source={require('../../assets/images/monitoring.svg')} 
              />
              <Text style={{ fontSize: ts(14), color: '#0072C8', fontWeight: '400', textAlign: 'center', marginLeft: -7 }}>
                Мониторинг ПНР
              </Text>
            </TouchableOpacity>
        </View>
    </View>
    </ScrollView>

    <Modal
      animationType="fade" // Можно использовать 'slide', 'fade' или 'none'
      transparent={true} // Установите true, чтобы сделать фон полупрозрачным
      visible={modalStatus}
      onRequestClose={() => setModalStatus(false)} // Для Android
      >
      <View style={{flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
       }}>
                        
        <View style={{
          width: 300,
          height: 190,
          padding: 5,
          backgroundColor: 'white',
          borderRadius: 10,
          justifyContent: 'center',
         }}>
          <TouchableOpacity onPress={() => [setModalStatus(false), setUrlFetch(''), setNameLink('')]} style = {{alignSelf: 'flex-end', }}>
            <Ionicons name='close-outline' size={30} />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center'}}      > 

            <View style={{ paddingVertical: 3, width: '92%', alignSelf: 'center'}}>
              <TextInput 
              multiline
              style={{ textAlign: 'center',  includeFontPadding: false,  textAlignVertical: 'center', lineHeight: ts(12), fontSize: ts(14), color: '#1A4072'}} editable={false}>
                Ссылка для {nameLink} документации </TextInput>
            </View>   

            <View style={{ paddingVertical: 3, paddingBottom: 20, width: '92%', alignSelf: 'center'}}> 
              <TextInput  style={{ borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, paddingBottom: 7, textAlignVertical: 'center', fontSize: ts(14), textAlign: 'center'}}>
                ССЫЛКА ИЗ БД</TextInput>  
            </View>

            <CustomButton title='Сохранить' handlePress={() => [setModalStatus(false), setUrlFetch('hhj'), setNameLink(''), 
              modalLinkSave()
              ]}/>  

          </View>  
        </View>
      </View>

    </Modal>

    </View>
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
