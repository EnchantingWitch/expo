import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import {  } from '@/components/Themed';
import { Link, Tabs, Redirect, router, useRouter } from 'expo-router';
import FormForObj from '@/components/FormForObj';
import CustomButton from '@/components/CustomButton';
import React from 'react';


export default function TabOneScreen() {
const fontScale = useWindowDimensions().fontScale;
const router = useRouter();

    const ts = (fontSize: number) => {
        return (fontSize / fontScale)};

        const ID1 = 101;
        const ID2 = 201;
        const ID3 = 301;
  //router.setParams({ ID: '101' });
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      {/*<Text style={{textAlign: 'center', fontSize: ts(14), paddingVertical: '4%'}}>Доступные объекты КС</Text>*/}
    <View style={styles.container}>

                        <TouchableWithoutFeedback onPress={() =>{router.push({pathname: '/(tabs)/object', params: { ID: ID1}})}}>
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: 41, borderRadius: 8}}>
                
                            <View style={{width: '98%', }}>
                            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>Объект 1</Text>
                            </View>
                                           
                        </View>
                        </TouchableWithoutFeedback>
      
                        <TouchableWithoutFeedback onPress={() =>{router.push({pathname: '/(tabs)/object', params: { ID: ID2}})}}>
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: 41, borderRadius: 8}}>
                
                            <View style={{width: '98%', }}>
                            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>Объект 2</Text>
                            </View>
                                           
                        </View>
                        </TouchableWithoutFeedback>
                        

                        <TouchableWithoutFeedback onPress={() =>{router.push({pathname: '/(tabs)/object', params: { ID: ID3}})}}>
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: 41, borderRadius: 8}}>
                
                            <View style={{width: '98%', }}>
                            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>Тест для передачи значения</Text>
                            </View>
                                           
                        </View>
                        </TouchableWithoutFeedback>
    </View>
    <CustomButton title='Добавить объект' handlePress={() =>{router.push('/objs/add_obj')}}/>
    </ScrollView>
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
