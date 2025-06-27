import CustomButton from '@/components/CustomButton';
import { } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';

type Object = {
  capitalCSName: string;
  codeCCS: string;
 /* locationRegion: string;
  objectType: string;
  customer: string;//заказчик
  CIWExecutor: string;//исполнитель СМР
  CWExecutor: string;//исполнитель ПНР
  customerSupervisor: string;// Куратор заказчика
  CWSupervisor: string; // Куратор ПНР
  CIWSupervisor: string; // куратор СМР */
};

export default function TabOneScreen() {
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const fontScale = useWindowDimensions().fontScale;
const ts = (fontSize: number) => {
        return (fontSize / fontScale)};

const router = useRouter();
//const {roleReq} = useLocalSearchParams();//получение роли
//console.log(roleReq, 'role objects');
const [isLoading, setLoading] = useState(true);
const [accessToken, setAccessToken] = useState('');
const [data, setData] = useState<Object[]>([]);
const {token}=useGlobalSearchParams();

//const [isGetTok, setIsGetTok] = useState(true);


 //const [accessToken, setAccessToken] = useState('');
   
        const navigation = useNavigation();
    
        useEffect(() => {
          if (token){setAccessToken(token);}
          if(accessToken === ''){getToken();}
          if (accessToken){getObjects();}
              navigation.setOptions({
                headerLeft: () => (
                  <TouchableOpacity onPress={handleLogout}>
                    <Ionicons name='exit-outline' size={25} style={{alignSelf: 'center'}}/>
                  </TouchableOpacity>
                ),
               //} headerRight: () => (
                //  <TouchableOpacity onPress={() => router.push('/user/update_user_inf')}>
                //    <Ionicons name='settings-outline' size={25} style={{alignSelf: 'center'}}/>
                //  </TouchableOpacity>
               // ),
                
              });
             // if(accessToken){handleLogout()}
        }, [navigation, accessToken, token]);
        useEffect(() => {
                  if (token){setAccessToken(token);}
                }, [token]);
        
                useEffect(() => {
                    if(accessToken === ''){getToken();}
                    if (accessToken){getObjects();}
                       
                  }, [ accessToken]);

        const getToken = async () => {
          try {
              const token = await AsyncStorage.getItem('accessToken');
              if (token !== null) {
                setAccessToken(token);
                  console.log('Retrieved token from objects.tsx:', token);
              } else {
                  console.log('No token found');
              }
          } catch (error) {
              console.error('Error retrieving token:', error);
          }
      };

      const removeToken = async (tokenKey) => {
        try {
            await AsyncStorage.removeItem(tokenKey);
            console.log('Token - ',tokenKey,'- removed successfully!');
        } catch (error) {
            console.error('Error removing token:', error);
        }
    };

        const handleLogout = async () => {
          try{
            console.log(accessToken);
            if (accessToken!== null){
              const str = `Bearer ${accessToken}`;
              console.log(str);
                  
              let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/logout', {
                   method: 'POST',
                   headers: {
                      'Authorization': str,
                     'Content-Type': 'application/json',
                   },
                   
                 });
                 
                 console.log('ResponseLogout:', response);
                 if(response.status === 200){
                  removeToken('accessToken');
                  removeToken('refreshToken');
                  removeToken('userID');
                  router.push('/sign/sign_in');
                 }
  
              }}catch (error) {
                  console.error('Error:', error);
              }finally{  
  
              }
  
      };
  
  const getObjects = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/user/getAllowedObjects/' + userID,
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }}
      );
      console.log('responseGetAllowedObjects',response)
      const json = await response.json();
      setData(json);
      console.log(json);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/*<Text style={{textAlign: 'center', fontSize: ts(14), paddingVertical: '4%'}}>Доступные объекты КС</Text>*/}
    <View style={styles.container}>
    {/*<TouchableWithoutFeedback onPress={() =>{router.push({pathname: '/(tabs)/object', params: { codeCCS: '051-2004430.008', capitalCSName: 'Тестовый объект'}})}}>
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: '5%', borderRadius: 8}}>
                
                            <View style={{width: '98%', }}>
                            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>Объект</Text>
                            </View>
                                           
                        </View>
                        </TouchableWithoutFeedback>*/}
   
    <FlatList
        style={{width: '100%'}}
        data={data}
        keyExtractor={({codeCCS}) => codeCCS}
        renderItem={({item}) => (
                        <TouchableWithoutFeedback onPress={() =>{router.push({pathname: '/(tabs)/object', params: { codeCCS: item.codeCCS, capitalCSName: item.capitalCSName}})}}>
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 37,  justifyContent: 'center', marginBottom: '5%', borderRadius: 8}}>
                
                            <View style={{width: '98%', justifyContent: 'center',}}>
                            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.capitalCSName}</Text>
                            </View>
                                           
                        </View>
                        </TouchableWithoutFeedback>
       )}
       /> 
    </View>
    <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 20 }}>
    <CustomButton title='Добавить объект' handlePress={() =>{router.push({pathname: '/objs/add_obj', params: { accessToken: accessToken}})}}/>
    {/*}  <CustomButton title='Диаграммы' handlePress={() =>{router.push('/objs/diagrams')}}/>
  <CustomButton title='refresh' handlePress={refreshTok}/>*/}
   {/*} <CustomButton title='admin' handlePress={() =>{router.push('/admin/menu')}}/>*/}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: '10%',
    flex: 1,
    alignSelf: 'center',
    width: '96%',
    height: '100%',
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
