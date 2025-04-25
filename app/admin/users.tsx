import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Button, Pressable, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, TouchableHighlight, TouchableNativeFeedback, useWindowDimensions } from 'react-native';
import type { PropsWithChildren } from 'react';
import {  router, useGlobalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserInfo = {
  id: number;
  organisation: string;
  fullName: string;
  phoneNumber: string;
};

type Users = {
  username: string;//почта
  id: string;
  isEnabled: boolean;
  role: string;
  userInfo: UserInfo[];
};

const DirectionLayout = () => {
  const router = useRouter();
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
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Users[]>([]);

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const navigation = useNavigation();
    
  useEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/admin/menu')}>
              <Ionicons name='home-outline' size={25} style={{alignSelf: 'center'}}/>
            </TouchableOpacity>
          ),
        });
        //if(data){console.log(data[0].userInfo)}
  }, [navigation, data]);


  const getUsers = async () => {
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/admin/getUsers',
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
          },}
      );
      console.log('responseGetUsers',response);
      const json = await response.json();
      console.log(json);
      setData(json);
      //console.log(json.userInfo[1]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getToken();
    if(accessToken){getUsers();}
  }, [accessToken]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <View style={{
        flex: 1, alignItems: 'center'
        // justifyContent: 'center', flexDirection: 'row', height: 80, padding: 20, alignSelf: 'flex-start', alignItems: 'stretch', justifyContent: 'space-around',
      }}>      
          <View style={{ flexDirection: 'row'   }}>
          <View style={{width: '40%', justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>ФИО пользователя</Text>
                      </View>
                      <View style={{width: '45%', justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>Организация</Text>
                      </View>
                      <View style={{width: '15%', justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>Доступ</Text>
                      </View>
            
          </View>

          <View style={{ flex: 1, marginTop: 12}}>

               { isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                     style={{width: '96%'}}
                     data={data}
                     keyExtractor={({id}) => id}
                     renderItem={({item}: {item: Users}) => (
                      
                      
                  <TouchableWithoutFeedback 
                  style={{}}
                  onPress={() =>{ 
                    //console.log(data[parseInt(item.id, 10)].userInfo.fullName, 'item.userInfo');
                    const userInfo = item.userInfo;
                   console.log(userInfo.organisation, 'userInfo.organisation');
                    router.push({pathname: '/admin/user', params: 
                      { username: item.username, 
                        organisation: userInfo.organisation!==''? userInfo.organisation : 'Не указано',  
                        fullName: userInfo.fullName!==''? userInfo.fullName : 'Не указано',  
                        id: item.id, 
                        role: item.role }})}  }>
                  <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row',   height: 37, alignContent: 'center',  marginBottom: '5%', borderRadius: 8}}>
          
                      <View style={{width: '40%', justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left', marginStart: 3  }}>{item.userInfo.fullName}</Text>
                      </View>
          
                      <View style={{width: '45%', justifyContent: 'center'}}>
                  
                     {/*} {item.userInfo.map((detail, organisation) => (
              <Text key={organisation}>{detail.organisation}</Text>
            ))}
              */}
              <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center', marginStart: 3 }}> {item.userInfo.organisation}</Text>
                 
                     {/*} <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left', marginStart: 3 }}> {item.userInfo[parseInt(item.id, 10)]?.organisation || 'Не указано'}</Text>
                 */}
                
                      </View>    

                      <View style={{width: '15%', justifyContent: 'center', alignItems: 'flex-end'}}>
                     
                      {(item.isEnabled ===true) && ( <Ionicons name="checkbox" size={25} color="#0072C8" />)}
                      {(item.isEnabled ===false) &&  <Ionicons name="square" size={25} color="#F0F9FF" />}
                   
                      </View>
                  </View>
                  </TouchableWithoutFeedback>
              )}
              />
            )}
        
          </View>

      </View >
    </View >

  );
};

export default DirectionLayout;
