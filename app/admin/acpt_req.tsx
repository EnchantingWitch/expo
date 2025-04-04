import { TextInput, StyleSheet, Text, View, ScrollView, useWindowDimensions, FlatList, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'expo-checkbox';

type Req = {
  id: number;
  username: string;
  description: string;
  userId: string;
  objectsToAdd:[ {
    capitalCSName: string;
    codeCCS: string;
    locationRegion: string;
    objectType: string;
    customer: string; // заказчик
    CIWExecutor: string; // исполнитель СМР
    CWExecutor: string; // исполнитель ПНР
    customerSupervisor: string; // Куратор заказчика
    CWSupervisor: string; // Куратор ПНР
    CIWSupervisor: string; // куратор СМР 
  }];
};

export default function TabOneScreen() {
  const [data, setData] = useState<Req[]>([]);
  const { idReq } = useLocalSearchParams();
   const [checkedItems, setCheckedItems] = useState({});
   const [accessToken, setAccessToken] = useState<any>('');
  const fontScale = useWindowDimensions().fontScale;
  const ts = (fontSize: number) => {
    return (fontSize / fontScale);
  };

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

  const getReq = async () => {
    try {
      
      let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/admin/getApplication/' + idReq, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      setData(json);
      console.log(json);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //что-то делает для отображения чекбоксов для каждого объекта по состоянию
  const toggleCheckbox = (id) => {
    setCheckedItems((prev) => ({
        ...prev,
        [id]: !prev[id],
    }));
};

const handleSubmit = async ()  => {
  const selectedIds = Object.keys(checkedItems).filter((id) => checkedItems[id]);
  console.log('Selected IDs:', selectedIds);
  try {
    //const id = await AsyncStorage.getItem('userID');
    const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/admin/set_objects',
      {method: 'POST',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        },
      body: JSON.stringify({
        id : data.id,
        objects : selectedIds,
      })
    }
      
    );
    console.log('responseSetObjects',response)
     if (response.status == 200){
      Alert.alert('', 'Пользователю предоставлен доступ к выбранным объектам.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
    }
  } catch (error) {
    console.error(error);
  } finally {
    router.push('/admin/requests');
    //setLoading(false);

  }

  // Здесь вы можете отправить запрос с выбранными ID
};

  useEffect(() => {
    getToken();
    if (idReq && accessToken) { getReq(); }
  }, [idReq, accessToken]);

  const renderItem = ({ item }) => (
    <View style={{ borderRadius: 5, backgroundColor: '#E0F2FE', flexDirection: 'row', height: 32,marginBottom: '5%',}}>
                <Checkbox
                    value={!!checkedItems[item.codeCCS]}
                    onValueChange={() => toggleCheckbox(item.codeCCS)}
                    color={checkedItems[item.codeCCS] ? '#0072C8' : undefined}
                    style={{alignSelf: 'center'}}
                />
                <Text style={[ { marginLeft: 8,fontSize: ts(14), alignSelf: 'center'}]}>{item.capitalCSName}</Text>
            </View>
  );


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Пользователь</Text>
      <TextInput
      style={{width: '96%',fontSize: ts(14),backgroundColor: '#FFFFFF',borderRadius: 8,borderWidth: 1,borderColor: '#D9D9D9',height: 42,color: '#B3B3B3',textAlign: 'center',marginBottom: 20,}}
      placeholderTextColor="#111"
      editable={false}
      value={data.username}
    />
    {/*<Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Организация</Text>
      <TextInput
      style={{width: '96%',fontSize: ts(14),backgroundColor: '#FFFFFF',borderRadius: 8,borderWidth: 1,borderColor: '#D9D9D9',height: 42,color: '#B3B3B3',textAlign: 'center',marginBottom: 20,}}
      placeholderTextColor="#111"
      editable={false}
      value='{item.organization}'
    />
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Дата заявки</Text>
      <TextInput
      style={{width: '96%',fontSize: ts(14),backgroundColor: '#FFFFFF',borderRadius: 8,borderWidth: 1,borderColor: '#D9D9D9',height: 42,color: '#B3B3B3',textAlign: 'center',marginBottom: 20,}}
      placeholderTextColor="#111"
      editable={false}
      value='{item.date}'
    />*/}
     <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', paddingBottom: '4%', textAlign: 'center' }}>Запрашиваемые объекты на доступ</Text>
     
        <FlatList
          style={{ width: '96%' }}
          data={data.objectsToAdd}
          keyExtractor={(item, index) => index.toString()} // Используйте уникальное значение для ключа
          renderItem={renderItem}
        />
      </View>
      <CustomButton title='Акцептовать заявку' handlePress={handleSubmit}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
});
