import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'expo-checkbox';
import { router, useLocalSearchParams } from 'expo-router';
import { default as React, useEffect, useState } from 'react';
import { Alert, FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';


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
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

    const [checkedItems, setCheckedItems] = useState({});
    const [data, setData] = useState<Object[]>([]);
    const [idUser, setIdUser] = useState<any>('');
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
      const {accessToken} = useLocalSearchParams();

    const getObjects = async () => {
      try {
        const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/getAll/'+idUser,
          {method: 'GET',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }}
        );
          console.log('responsegetAllObjs',response)
        const json = await response.json();
        setData(json);
        setFilteredData(json); // Инициализируем отфильтрованные данные
        console.log('json', json)
      
      } catch (error) {
        console.error(error);
      } finally {
        //setLoading(false);
      }
    };
 // Фильтрация данных при изменении выбранных фильтров
    useEffect(() => {
      let result = [...data];
     
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(item => 
          item.capitalCSName?.toLowerCase().includes(query)
        );
      }
      
      setFilteredData(result);
    }, [ searchQuery, data]);

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
      getToken('userID', setIdUser);
      if (accessToken && idUser ){getObjects();}
      //if(idUser){handleSubmit();}
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
        <View style={{ borderRadius: 5, backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 37,   marginBottom: '5%',}}>
            <Checkbox
                value={!!checkedItems[item.codeCCS]}
                onValueChange={() => toggleCheckbox(item.codeCCS)}
                color={checkedItems[item.codeCCS] ? '#0072C8' : undefined}
                style={{alignSelf: 'center'}}
            />
            <View style={{justifyContent: 'center'}}>
            <Text style={[styles.label, {fontSize: ts(14), alignSelf: 'center'}]}>{item.capitalCSName}</Text></View>
        </View>
    );

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.container}>
           <TextInput 
                      style={{ marginBottom: 12, borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 8,   }}
                      placeholder="Поиск по объекту строительства"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.codeCCS}
            />

        </View>
        <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 20 }}>
          <CustomButton title='Запросить доступ' handlePress={handleSubmit}/>
        </View>
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
