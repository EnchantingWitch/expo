import useDevice from '@/hooks/useDevice';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
 
type Reqs = {
  id: number;//айди заявки
  userId: number;
  fullName: string;
  username: string;
  description: string;
  organisation: string;
  role: string;
  creationTime:string; 
  objectToAdd:[{
      capitalCSName: string,
      codeCCS: string,
}],
};

const DirectionLayout = () => {
  const { isMobile, isDesktopWeb, isMobileWeb, screenWidth, screenHeight } = useDevice();
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
        flex: 1, alignSelf: 'center'
        , width: isDesktopWeb && screenWidth>900? 900 : '100%'
        // justifyContent: 'center', flexDirection: 'row', height: 80, padding: 20, alignSelf: 'flex-start', alignItems: 'stretch', justifyContent: 'space-around',
      }}>
          
          <View style={{ flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'space-between' }}>
            <View style={{width: '43%', justifyContent: 'center'}}>
                                  <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>ФИО пользователя</Text>
                                  </View>
                                  <View style={{width: '35%', justifyContent: 'center'}}>
                                  <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>Организация</Text>
                                  </View>
                                  <View style={{width: '22%', justifyContent: 'center'}}>
                                  <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>Дата</Text>
                                  </View>
           {/*} <Text style={{ fontSize: ts(14), color: '#1E1E1E' }}>Дата заявки</Text>*/}
          </View>

          <View style={{ flex: 15, marginVertical: 12, width: '100%', alignItems: 'center'}}>

               { isLoading ? (
              <ActivityIndicator />
            ) : (

              <FlatList
                      style={{width: '96%'}}
                      data={data}
                      keyExtractor={({id}) => id}
                      renderItem={({item}) => (
             
                  <TouchableWithoutFeedback onPress={() =>{ router.push({pathname: '/admin/acpt_req', params: {idReq: item.id }})}  }>
                  <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 42, justifyContent: 'center', marginBottom: 15, borderRadius: 8}}>
          
                      <View style={{width: '43%', justifyContent: 'center', paddingLeft: 5}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }} numberOfLines={2} // ограничивает 2 строками
  ellipsizeMode="tail">{item.fullName}</Text>
                      </View>
          
                      <View style={{width: '35%', marginStart: 0, justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }} numberOfLines={2} // ограничивает 2 строками
  ellipsizeMode="tail">{item.organisation}</Text>
                      </View>
                      
                      <View style={{width: '22%', marginStart: 0, justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{item.creationTime}</Text>
                      
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

