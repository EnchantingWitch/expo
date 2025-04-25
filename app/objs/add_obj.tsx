import React, { useEffect, useState } from 'react';
import { useWindowDimensions, View, Text, StyleSheet, FlatList, SafeAreaView, Alert } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Object = {
  capitalCSName: string;
  codeCCS: string;
  locationRegion: string;
  objectType: string;
  customer: string;//заказчик
  CIWExecutor: string;//исполнитель СМР
  CWExecutor: string;//исполнитель ПНР
  customerSupervisor: string;// Куратор заказчика
  CWSupervisor: string; // Куратор ПНР
  CIWSupervisor: string; // куратор СМР 
};

const CheckboxList = () => {
    const [checkedItems, setCheckedItems] = useState({});
    const [data, setData] = useState<Object[]>([]);
    const [accessToken, setAccessToken] = useState<any>('');
    const [idUser, setIdUser] = useState<any>('');

    const getObjects = async () => {
      try {
        const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/getAll',
          {method: 'GET',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }}
        );
          console.log('responsegetAllObjs',response)
        const json = await response.json();
        setData(json);
      
      } catch (error) {
        console.error(error);
      } finally {
        //setLoading(false);
      }
    };

    const getToken = async (key, setF) => {
      try {
          const token = await AsyncStorage.getItem(key);
          //setAccessToken(token);
          if (token !== null) {
              console.log('Retrieved token:', token);
              setF(token);
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

    useEffect(() => {
      getToken('accessToken', setAccessToken);
      if (accessToken){getObjects();}
      if(idUser){handleSubmit();}
  }, [accessToken, idUser]);

    const fontScale = useWindowDimensions().fontScale;

    const ts = (fontSize: number) => {
        return (fontSize / fontScale)};

//что-то делает для отображения чекбоксов для каждого объекта по состоянию
    const toggleCheckbox = (id) => {
        setCheckedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    //выбранные объекты
    const handleSubmit = async ()  => {
      
      const selectedIds = Object.keys(checkedItems).filter((id) => checkedItems[id]);
      if(selectedIds.length === 0){
        Alert.alert('', 'Выберите хотя бы один объект', [
             {text: 'OK', onPress: () => console.log('OK Pressed')}])
        return;
      }
      console.log('Selected IDs:', selectedIds);
      console.log(JSON.stringify({
        objectsToAdd : selectedIds,
        description : 'описание',
      }))
      try {
        //const id = await AsyncStorage.getItem('userID');
        //console.log('isUser', id);
        const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/user/createApplication/'+idUser,
          {method: 'POST',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            },
          body: JSON.stringify({
            objectsToAdd : selectedIds,
            description : 'описание',
          })
        }
          
        );
       
        console.log('responseСreateApplication',response)
        if (response.ok) {
                Alert.alert('', 'Отправлен запрос на доступ', [
                     {text: 'OK', onPress: () => console.log('OK Pressed')}])
        } 
        else{
          Alert.alert('', `Ошибка при отправке запроса`, [
            {text: 'OK', onPress: () => console.log('OK Pressed')}])
        }
      } catch (error) {
        console.error(error);
        
      } finally {
        router.push('./objects')
        //setLoading(false);

      }

      // Здесь вы можете отправить запрос с выбранными ID
    };

    const renderItem = ({ item }) => (
        <View style={{ borderRadius: 5, backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 32,   marginBottom: '5%',}}>
            <Checkbox
                value={!!checkedItems[item.codeCCS]}
                onValueChange={() => toggleCheckbox(item.codeCCS)}
                color={checkedItems[item.codeCCS] ? '#0072C8' : undefined}
                style={{alignSelf: 'center'}}
            />
            <Text style={[styles.label, {fontSize: ts(14), alignSelf: 'center'}]}>{item.capitalCSName}</Text>
        </View>
    );

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.codeCCS}
            />

        </View>
         <CustomButton title='Запросить доступ' handlePress={() =>{[getToken('userID', setIdUser)]}}/>

         </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        padding: '2%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginLeft: 8,
    },
});

export default CheckboxList;
