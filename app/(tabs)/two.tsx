import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Button, Pressable, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, TouchableHighlight, TouchableNativeFeedback, useWindowDimensions } from 'react-native';
import type { PropsWithChildren } from 'react';
import {  router, useGlobalSearchParams, useRouter, useNavigation } from 'expo-router';
import DropdownComponent from '@/components/list_system_for_listOfnotes';
import CustomButton from '@/components/CustomButton';
import Note from '@/components/Note';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
type Note = {
  commentId: number; //id замечания , генерируется на сервере
  serialNumber: number;//номер замечания
  subObject: string;
  systemName: string;
  description: string;
  commentStatus: string;
  commentCategory: string;
  startDate: string;
  endDatePlan: string;
  endDateFact: string;
  commentExplanation: string;//комментарий к замечанию
  //userName: string;//не увидела в бд у Сергея
  iinumber: number;//номер акта ИИ
};


const DirectionLayout = () => {
  const router = useRouter();
  const currentDate = new Date; //console.log(currentDate);
  const [accessToken, setAccessToken] = useState<any>('');

  const {codeCCS} = useGlobalSearchParams();//получение кода ОКС 
  const {capitalCSName} = useGlobalSearchParams();//получение наименование ОКС 

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const navigation = useNavigation();
    
  useEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/objs/objects')}>
              <Ionicons name='home-outline' size={25} style={{alignSelf: 'center'}}/>
            </TouchableOpacity>
          ),
        });
  }, [navigation]);
 
  const [direction, setDirection] = useState('Объект');

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

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Note[]>([]);

  const getNotes = async () => {
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/getAllComments/'+codeCCS,
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }}
      );
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
    if(codeCCS && accessToken){getNotes()};
  }, [codeCCS, accessToken]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <View style={{
        flex: 1, alignItems: 'center'
        // justifyContent: 'center', flexDirection: 'row', height: 80, padding: 20, alignSelf: 'flex-start', alignItems: 'stretch', justifyContent: 'space-around',
      }}>

          <View style={{ flexDirection: 'row', width: '98%', height: 32, paddingTop: 6, justifyContent: 'space-between' }}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E' }}>№</Text>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E' }}>Содержание</Text>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E' }}>Статус</Text>
          </View>

          <View style={{ flex: 15, marginTop: 12}}>

               { isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                style={{width: '100%'}}
                data={data}
                keyExtractor={({commentId}) => commentId}
                renderItem={({item}) => (
                  <TouchableWithoutFeedback onPress={() =>{ router.push({pathname: '/notes/see_note', params: { capitalCSName: capitalCSName, post: item.commentId, codeCCS: codeCCS }})}  }>
                  <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 37, justifyContent: 'center', marginBottom: '5%', borderRadius: 8}}>
          
                      <View style={{width: '15%', justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.serialNumber}</Text>
                      </View>
          
                      <View style={{width: '75%', marginStart: 2, justifyContent: 'center'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.description}</Text>
                      </View>
                      
                      <View style={{width: '7%', marginStart: 2, justifyContent: 'center'}}>
                      
                       {(item.commentStatus =='Устранено') ? ( <Ionicons name="checkbox" size={25} color="#0072C8" />): ''} 
                       {(item.commentStatus =='Устранено с просрочкой') ? ( <Ionicons name="checkbox" size={25} color="#0072C8" />): ''} 
                       {(item.commentStatus =='Не устранено') ? <Ionicons name="square" size={25} color="#F0F9FF" />:''}
                       {(item.commentStatus =='Не устранено с просрочкой') ? ( <Ionicons name="square" size={25} color="#F59E0B" />):''}
                      
                      {/**checkmark-circle-outline , close-circle-outline, square-outline*/}
                     {/*} <Text style={{ fontSize: ts(16), color: '#334155', textAlign: 'center'  }}>{item.commentStatus} </Text>*/}
                      </View>
                  </View>
                  </TouchableWithoutFeedback>

          )}
              />
            )}

          </View>

          
            <CustomButton
              title="Добавить замечание"
              handlePress={() =>router.push({pathname: '/notes/create_note', params: { codeCCS: codeCCS, capitalCSName: capitalCSName }})} />
         
        
      </View >
    </View >

  );
};


type PreviewLayoutProps = PropsWithChildren<{
  // label: string;
 // values: string[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}>;

type PreviewNameProps = PropsWithChildren<{
  values: string[];
}>;

const PreviewName = (
  {
    //childern,
    values,
  }: PreviewNameProps) => (

  <View style={styles.row}>
    {values.map(value => (
      <Text key={value} style={styles.title}>
        {value}
      </Text>

    ))}
  </View>
);

const PreviewLayout = ({
  //  label,
  children,
  values,
  selectedValue,
  setSelectedValue,
}: PreviewLayoutProps) => (
  <View style={{ padding: 6, flex: 1 }}>

    <View style={styles.row}>
      {values.map(value => (
        <TouchableOpacity
          key={value}
          onPress={() => setSelectedValue(value)}
          style={[styles.button, selectedValue === value && styles.selected]}>
          <Text
            style={[
              styles.buttonLabel , 
              selectedValue === value && styles.selectedLabel,
            ]}>
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    <View style={[styles.container,]}>{children}</View>
  </View>
);


const styles = StyleSheet.create(
  
  
  {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: 'normal',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  separator: {
    marginVertical: 5,

    height: 1,
    width: '100%',
  },
  box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //alignItems: 'center',
  },
  button: {
   /* paddingVertical: 6,
    paddingBottom: 6,
    paddingRight: 8,
    paddingLeft: 8,*/
    backgroundColor: '#E0F2FE',
    marginHorizontal: '10%',
    marginBottom: 16,
    width: 103,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',

  },
  //background: #F8FAFC;

  selected: {
    backgroundColor: '#E0F2FE',
   // justifyContent: 'center',
    borderWidth: 0,
  },
  buttonLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#334155',
    //textAlign: 'center',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
});

export default DirectionLayout;

