import List from '@/components/SystemsForTwo';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';

// Исправляем тип UserInfo - это должен быть объект, а не массив
type UserInfo = {
  id: number;
  organisation: string;
  fullName: string;
  phoneNumber: string;
  registrationDate: string;
};

type Users = {
  username: string;
  id: string;
  isEnabled: boolean;
  role: string;
  userInfo: UserInfo; // Теперь это объект, а не массив
};

const DirectionLayout = () => {
  //const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>('');
  const [chooseOrg, setChooseOrg] = useState<string>('');
  const [chooseAccess, setChooseAccess] = useState<string>('');
  const [statusGetUsers, setStatusGetUsers] = useState(false);
  const [listOrg, setListOrg] = useState<ListToDrop[]>([]);
  const [listAccess, setListAccess] = useState<ListToDrop[]>([
    { label: 'Всего', value: 'Доступ' },
    { label: 'Зарегистрированные', value: 'Зарегистрированные' },
    { label: 'Не зарегистрированные', value: 'Не зарегистрированные' },
  ]);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token !== null) {
        setAccessToken(token);
      } else {
        router.push('/sign/sign_in');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Users[]>([]);
  const [filteredData, setFilteredData] = useState<Users[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fontScale = useWindowDimensions().fontScale;
  const ts = (fontSize: number) => fontSize / fontScale;

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

  const getUsers = async () => {
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/admin/getUsers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      });
      
      const json = await response.json();
      setData(json);
      setFilteredData(json); // Инициализируем отфильтрованные данные
      console.log(json);
      if(response.ok) {
        setStatusGetUsers(true);
        // Собираем уникальные организации
        const organizations = [...new Set(json.map((item: Users) => 
          item.userInfo.organisation || 'Не указано'
        ))].map(org => ({
          label: org,
          value: org
        }));
        
        setListOrg([{ label: 'Все организации', value: 'Все организации' }, ...organizations]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация данных при изменении выбранных фильтров
  useEffect(() => {
    let result = [...data];
    
    if (chooseOrg && chooseOrg !== 'Все организации') {
      result = result.filter(item => 
        item.userInfo.organisation === chooseOrg
      );
    }
    
    if (chooseAccess && chooseAccess !== 'Всего') {
      if (chooseAccess === 'Зарегистрированные') {
        result = result.filter(item => item.isEnabled);
      } else if (chooseAccess === 'Не зарегистрированные') {
        result = result.filter(item => !item.isEnabled);
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.userInfo.fullName?.toLowerCase().includes(query)
      );
    }
    
    setFilteredData(result);
  }, [chooseOrg, chooseAccess, searchQuery, data]);

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      getUsers();
    }
  }, [accessToken]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <TextInput 
            style={{ borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 8,  width: '96%' }}
            placeholder="Поиск по ФИО"
            placeholderTextColor={'#B2B3B3'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between',width: '96%'  }}>
          
          <List 
            list={listOrg} 
            nameFilter='Организация' 
            onChange={setChooseOrg}
             width={120}
          />
          <List 
            list={listAccess} 
            nameFilter='Всего' 
            onChange={setChooseAccess}
            width={120}
          />
        </View>

        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#D9D9D9', paddingVertical: 8 }}>
          <View style={{ width: '40%' }}>
            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>ФИО пользователя</Text>
          </View>
          <View style={{ width: '45%' }}>
            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>Организация</Text>
          </View>
          <View style={{ width: '15%' }}>
            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>Доступ</Text>
          </View>
        </View>

        <View style={{ flex: 1, width: '96%', alignContent: 'center' }}>
          {isLoading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
            style={{width: '100%'}}
            data={filteredData}
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
               role: item.role, 
               registrationDate: userInfo.registrationDate !==''? userInfo.registrationDate : 'Не указано'}})}  }>
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
      </View>
    </SafeAreaView>
  );
};

export default DirectionLayout;