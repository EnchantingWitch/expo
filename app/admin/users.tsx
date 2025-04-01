import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Button, Pressable, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, TouchableHighlight, TouchableNativeFeedback, useWindowDimensions } from 'react-native';
import type { PropsWithChildren } from 'react';
import {  router, useGlobalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

 
type Users = {
  username: string;
  id: string;
  userInfo: [{
    id: number,
    organisation: string,
    fullName: string,
    phoneNumber: string,
  }]
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
  }, [navigation]);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Users[]>([]);

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
      setData(json);
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
          <View style={{ flexDirection: 'row', width: '96%', height: 32, paddingTop: 6, justifyContent: 'space-between' }}>
          <View style={{width: '48%', justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>Логин пользователя</Text>
                      </View>
                      <View style={{width: '48%', justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>Организация</Text>
                      </View>

            
          </View>

          <View style={{ flex: 1, marginTop: 12}}>

               { isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                     style={{width: '100%'}}
                     data={data}
                     keyExtractor={({id}) => id}
                     renderItem={({item}) => (
                      
                  <TouchableWithoutFeedback 
                  style={{}}
                  onPress={() =>{ 
                    const organisation = item.userInfo.length > 0 ? item.userInfo[0].organisation : 'Не указано';
                    const numberPhone = item.userInfo.length > 0 ? item.userInfo[0].phoneNumber : 'Не указано';
                    const fullName = item.userInfo.length > 0 ? item.userInfo[0].fullName : 'Не указано';
                    router.push({pathname: '/admin/change', params: { username: item.username, organisation: organisation, numberPhone: numberPhone, fullName: fullName }})}  }>
                  <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row',   height: 37, alignContent: 'center',  marginBottom: '5%', borderRadius: 8}}>
          
                      <View style={{width: '48%', justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left', marginStart: 3  }}>{item.username}</Text>
                      </View>
          
                      <View style={{width: '48%', justifyContent: 'center'}}>
                      {item.userInfo.length > 0 && ( 
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left', marginStart: 3 }}>{item.userInfo[0].organisation}</Text>
                    )}
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

