import React, {useState} from 'react';
import { StyleSheet, FlatList, Text, View, ScrollView, TouchableOpacity, useWindowDimensions} from 'react-native';
import Checkbox from 'expo-checkbox';
import { Link, Tabs, Redirect, router } from 'expo-router';
import FormForObj from '@/components/FormForObj';
import ListOfRoles from '@/components/ListOfRoles';
import CustomButton from '@/components/CustomButton';
//import CheckBox from '@react-native-community/checkbox';


export default function TabOneScreen() {
    const [isSelected, setSelection] = useState(false);
    const [role, setRole] = useState<string>('');

    const fontScale = useWindowDimensions().fontScale;

    const ts = (fontSize: number) => {
        return (fontSize / fontScale)};

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>

    {/*  <FlatList
        style={{width: '100%'}}
        data={data}
        keyExtractor={({commentId}) => commentId}
        renderItem={({item}) => (   
        */}
                        <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 42,  justifyContent: 'center', marginBottom: 20}}>

                            <View style={{width: '10%', justifyContent: 'center'}}>
                            <Checkbox
                                value={isSelected}
                                onValueChange={setSelection}
                                color={isSelected ? '#0072C8' : undefined}
                            />
                            </View>
                            <View style={{width: '50%', justifyContent: 'center'}}>
                            <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}>Объект 1</Text>
                            </View>

                            <View style={{width: '40%', justifyContent: 'center'}}>
                            <ListOfRoles onChange = {(value) => setRole(value)}/>
                            </View>

                        </View>
   {/*     )}
      />    
      */}
      
    </View>
    <CustomButton title='Запросить доступ' handlePress={() =>{router.push('./objects')}}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '96%',
    //height: '70%',

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
