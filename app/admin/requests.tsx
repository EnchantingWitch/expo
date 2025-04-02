import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, FlatList,  TouchableOpacity, TouchableWithoutFeedback,  useWindowDimensions } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
type Reqs = {
  id: number;
  username: string;
  description: string;
  organization:string; 
  date:string; 
  objectToAdd:[{
      capitalCSName: string,
      codeCCS: string,
}],
};

const DirectionLayout = () => {
  const router = useRouter();

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
  const [data, setData] = useState<Reqs[]>([]);

  const getReqs = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/admin/getApplications',
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      console.log('responseGetApplications', response);
      const json = await response.json();
      setData(json);
      console.log(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReqs();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <View style={{
        flex: 1, alignItems: 'center'
        // justifyContent: 'center', flexDirection: 'row', height: 80, padding: 20, alignSelf: 'flex-start', alignItems: 'stretch', justifyContent: 'space-around',
      }}>
          
          <View style={{ flexDirection: 'row', width: '90%', height: 32, paddingTop: 6, justifyContent: 'space-between' }}>
            <View style={{width: '48%', justifyContent: 'center'}}>
                                  <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>Логин пользователя</Text>
                                  </View>
                                  <View style={{width: '48%', justifyContent: 'center'}}>
                                  <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>Организация</Text>
                                  </View>
           {/*} <Text style={{ fontSize: ts(14), color: '#1E1E1E' }}>Дата заявки</Text>*/}
          </View>

          <View style={{ flex: 15, marginTop: 12}}>

               { isLoading ? (
              <ActivityIndicator />
            ) : (

              <FlatList
                      style={{width: '96%'}}
                      data={data}
                      keyExtractor={({id}) => id}
                      renderItem={({item}) => (
             
                  <TouchableWithoutFeedback onPress={() =>{ router.push({pathname: '/admin/acpt_req', params: {idReq: item.id }})}  }>
                  <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 37, justifyContent: 'center', marginBottom: '5%', borderRadius: 8}}>
          
                      <View style={{width: '48%', justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.username}</Text>
                      </View>
          
                      <View style={{width: '48%', marginStart: 2, justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.organization}</Text>
                      </View>
                      
                      <View style={{width: '0%', marginStart: 2, justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.date}</Text>
                      
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

