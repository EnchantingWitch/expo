import { } from '@/components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

type Object = {
  capitalCSName: string;
  codeCCS: string;
};

export default function TabOneScreen() {
const fontScale = useWindowDimensions().fontScale;
const ts = (fontSize: number) => {
        return (fontSize / fontScale)};

const router = useRouter();

const [isLoading, setLoading] = useState(true);
const [accessToken, setAccessToken] = useState('');
const [data, setData] = useState<Object[]>([]);
const {token}=useGlobalSearchParams();

//const [isGetTok, setIsGetTok] = useState(true);
      
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
      console.log('responseGetAllowedObjects',response)
      const json = await response.json();
      setData(json);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>
   
   
    <FlatList
        style={{width: '100%'}}
        data={data}
        keyExtractor={({codeCCS}) => codeCCS}
        renderItem={({item}) => (
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 37,  justifyContent: 'center', marginBottom: '5%', borderRadius: 8}}>
                
                            <View style={{width: '98%', justifyContent: 'center',}}>
                            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.capitalCSName}</Text>
                            </View>
                                           
                        </View>
                        
       )}
       /> 
    </View>
   
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
