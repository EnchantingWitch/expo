import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback } from 'react-native';
import {  } from '@/components/Themed';
import { Link, Tabs, Redirect, router } from 'expo-router';
import FormForObj from '@/components/FormForObj';
import CustomButton from '@/components/CustomButton';

export default function TabOneScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>

                        <TouchableWithoutFeedback onPress={() =>{router.push('./(tabs)/object.tsx')}}>
                        <View style={{ backgroundColor: '#F8FAFC', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: 41}}>
                
                            <View style={{width: '75%', }}>
                            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'left' }}>Объетк 1</Text>
                            </View>
                                           
                        </View>
                        </TouchableWithoutFeedback>
      
                        <TouchableWithoutFeedback onPress={() =>{router.push('./(tabs)/object.tsx')}}>
                        <View style={{ backgroundColor: '#F8FAFC', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: 41}}>
                
                            <View style={{width: '75%', }}>
                            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'left' }}>Объетк 2</Text>
                            </View>
                                           
                        </View>
                        </TouchableWithoutFeedback>
    </View>
    <CustomButton title='Добавить объект' handlePress={() =>{router.push('./objects.tsx')}}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '96%',
    height: '70%',
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
