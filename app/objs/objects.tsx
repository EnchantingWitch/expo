import { ActivityIndicator, SafeAreaView, FlatList, StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import {  } from '@/components/Themed';
import { Link, Tabs, Redirect, router, useRouter, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import FormForObj from '@/components/FormForObj';
import CustomButton from '@/components/CustomButton';
import React, {useState, useEffect} from 'react';

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

export default function TabOneScreen() {
const fontScale = useWindowDimensions().fontScale;
const router = useRouter();
//const {roleReq} = useLocalSearchParams();//получение роли
//console.log(roleReq, 'role objects');
const [isLoading, setLoading] = useState(true);
const [data, setData] = useState<Object[]>([]);

    const ts = (fontSize: number) => {
        return (fontSize / fontScale)};
  
  const getObjects = async () => {
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/getAll');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getObjects();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/*<Text style={{textAlign: 'center', fontSize: ts(14), paddingVertical: '4%'}}>Доступные объекты КС</Text>*/}
    <View style={styles.container}>
    <TouchableWithoutFeedback onPress={() =>{router.push({pathname: '/(tabs)/object', params: { codeCCS: '051-2004430.008'}})}}>
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: '5%', borderRadius: 8}}>
                
                            <View style={{width: '98%', }}>
                            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>Объект</Text>
                            </View>
                                           
                        </View>
                        </TouchableWithoutFeedback>
    { isLoading ? (
              <ActivityIndicator />
            ) : (
    <FlatList
        style={{width: '100%'}}
        data={data}
        keyExtractor={({codeCCS}) => codeCCS}
        renderItem={({item}) => (
                        <TouchableWithoutFeedback onPress={() =>{router.push({pathname: '/(tabs)/object', params: { codeCCS: item.codeCCS}})}}>
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: '5%', borderRadius: 8}}>
                
                            <View style={{width: '98%', }}>
                            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>{item.capitalCSName}</Text>
                            </View>
                                           
                        </View>
                        </TouchableWithoutFeedback>
       )}
       /> )}
    </View>
    <CustomButton title='Добавить объект' handlePress={() =>{router.push('/objs/add_obj')}}/>
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
