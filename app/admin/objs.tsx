import { } from '@/components/Themed';
import useDevice from '@/hooks/useDevice';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

type Object = {
  capitalCSName: string;
  codeCCS: string;
};

export default function TabOneScreen() {
const { isMobile, isDesktopWeb, isMobileWeb, screenWidth, screenHeight } = useDevice();
const fontScale = useWindowDimensions().fontScale;
const ts = (fontSize: number) => {
        return (fontSize / fontScale)};

const router = useRouter();

const [isLoading, setLoading] = useState(true);
const [accessToken, setAccessToken] = useState('');
const [data, setData] = useState<Object[]>([]);
const {token}=useGlobalSearchParams();

//const [isGetTok, setIsGetTok] = useState(true);
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
                  console.log('Retrieved token:', token);
              } else {
                  console.log('No token found');
              }
          } catch (error) {
              console.error('Error retrieving token:', error);
          }
      };

  
  const getObjects = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/getAll',
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }}
      );
      console.log('getAll',response)
      
      const json = await response.json();
      setData(json);
      console.log('getAll json',json)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={[styles.container, {alignSelf: 'center', width: isDesktopWeb && screenWidth>900? 900 : '96%'}]}>
   
   
    <FlatList
        style={{width: '100%'}}
        data={data}
        keyExtractor={({codeCCS}) => codeCCS}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() =>{router.push({pathname: '/admin/change_obj', params: 
          { capitalCSId: item.capitalCSId, 
            codeCCS: item.codeCCS, 
            capitalCSName: item.capitalCSName, 
            ciwexecutor: item.ciwexecutor, 
            ciwsupervisor: item.ciwsupervisor, 
            customer: item.customer,
            customerSupervisor: item.customerSupervisor,
            cwexecutor: item.cwexecutor,
            cwsupervisor: item.cwsupervisor,
            locationRegion: item.locationRegion,
            objectType: item.objectType
          }})}}>
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 42,  justifyContent: 'center', marginBottom: 16, borderRadius: 8}}>
                
                            <View style={{width: '98%', justifyContent: 'center',}}>
                            <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.capitalCSName}</Text>
                            </View>
                                           
                        </View>
          </TouchableOpacity>             
       )}
       /> 
    </View>
   
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //paddingTop: '10%',
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
