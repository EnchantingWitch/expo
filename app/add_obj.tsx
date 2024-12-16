import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import {  } from '@/components/Themed';
import { Link, Tabs, Redirect, router } from 'expo-router';
import FormForObj from '@/components/FormForObj';
import DropdownComponent from '@/components/list';
import CustomButton from '@/components/CustomButton';
import CheckBox from '@react-native-community/checkbox';

export default function TabOneScreen() {
    const [isSelected, setSelection] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>

                        <TouchableOpacity onPress={() =>{router.push('./(tabs)/object.tsx')}}>
                        <View style={{ backgroundColor: '#F8FAFC', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: 41}}>

                            <View style={{width: '10%'}}>
                            <CheckBox
                                value={isSelected}
                                onValueChange={setSelection}
                            />
                            </View>
                            <View style={{width: '50%', }}>
                            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'left' }}>Объетк 1</Text>
                            </View>

                            <View style={{width: '40%', }}>
                            <DropdownComponent/>
                            </View>

                        </View>
                        </TouchableOpacity>
      
                        <TouchableOpacity onPress={() =>{router.push('./(tabs)/object.tsx')}}>
                        <View style={{ backgroundColor: '#F8FAFC', flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: 41}}>
                        
                            <View style={{width: '10%'}}>

                            <CheckBox
                                value={isSelected}
                                onValueChange={setSelection}
                            />
                            </View>

                            <View style={{width: '50%', }}>
                            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'left' }}>Объетк 2</Text>
                            </View>

                            <View style={{width: '40%', }}>
                            <DropdownComponent/>
                            </View>
                                           
                        </View>
                        </TouchableOpacity>
    </View>
    <CustomButton title='Запросить доступ' handlePress={() =>{router.push('./objects.tsx')}}/>
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
