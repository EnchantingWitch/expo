import CustomButton from '@/components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Platform, StatusBar, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';

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
    const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const router = useRouter();
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/organisations/getAll',
      //const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/organisations/getAll',directories/getRegions
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      console.log('responseGetOrganisations', response);
      const json = await response.json();
      setData(json);
      setFilteredData(json); // Инициализируем отфильтрованные данные
      //console.log(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация данных при изменении выбранных фильтров
    useEffect(() => {
      let result = [...data];
     
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(item => 
          item.organisationName?.toLowerCase().includes(query)
        );
      }
      
      setFilteredData(result);
    }, [ searchQuery, data]);

  useEffect(() => {
    getReqs();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>


          <View style={{ justifyContent: 'center', alignItems: 'center', minHeight: Dimensions.get('window').height-BOTTOM_SAFE_AREA-54}}>
          <TextInput 
            style={{ borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 8,  width: '96%' }}
            placeholder="Поиск по организации"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
               { isLoading ? (
              <ActivityIndicator />
            ) : (

              <FlatList
                      style={{width: '96%', marginTop: 15}}
                      data={filteredData}
                      keyExtractor={({id}) => id}
                      renderItem={({item}) => (
             
                  <TouchableWithoutFeedback onPress={() =>{ router.push({pathname: '/admin/organization', params: {id: item.id, organisation: item.organisationName }})}  }>
                  <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 37, justifyContent: 'center', marginBottom: '5%', borderRadius: 8}}>
          
                      <View style={{width: '100%', justifyContent: 'center', paddingLeft: 5}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.organisationName}</Text>
                      </View>
                      
                  </View>
                  </TouchableWithoutFeedback>
              )}
              />
       
            )}
         <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 150 }}>
          <CustomButton
                      title="Добавить организацию"
                      handlePress={()=>{router.push('./create_organization')}} 
                  //   isLoad={load} // Можно добавить индикатор загрузки, если нужно
        />
          </View>
          
        </View>
      </View >


  );
};

export default DirectionLayout;

