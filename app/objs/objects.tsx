import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback } from 'react-native';
import {  } from '@/components/Themed';
import { Link, Tabs, Redirect, router } from 'expo-router';
import FormForObj from '@/components/FormForObj';
import CustomButton from '@/components/CustomButton';

export default function TabOneScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <Text style={{textAlign: 'center', fontSize: 16, paddingVertical: '4%'}}>Доступные объекты КС</Text>
    <View style={styles.container}>

                        <TouchableWithoutFeedback onPress={() =>{router.push('/(tabs)/object')}}>
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: 41, borderRadius: 8}}>
                
                            <View style={{width: '98%', }}>
                            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'left' }}>Объект 1</Text>
                            </View>
                                           
                        </View>
                        </TouchableWithoutFeedback>
      
                        <TouchableWithoutFeedback onPress={() =>{router.push('/(tabs)/object')}}>
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: 41, borderRadius: 8}}>
                
                            <View style={{width: '98%', }}>
                            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'left' }}>Объект 2</Text>
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
