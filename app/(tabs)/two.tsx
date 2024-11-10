import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Pressable, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, TouchableHighlight, TouchableNativeFeedback } from 'react-native';
import type {PropsWithChildren} from 'react';
import { Link, Tabs } from 'expo-router';
import tw from 'tailwind-rn'

import EditScreenInfo from '@/components/EditScreenInfo';
//import { Text, View } from '@/components/Themed';

const DirectionLayout = () => {
  const [direction, setDirection] = useState('Объект');

  return (
  <SafeAreaView style = {{flex: 1, backgroundColor: 'white'}}>

    <View style={{flex: 1, alignItems: 'center'
       // justifyContent: 'center', flexDirection: 'row', height: 80, padding: 20, alignSelf: 'flex-start', alignItems: 'stretch', justifyContent: 'space-around',
    }}>
       
      <PreviewLayout
        selectedValue={direction}
        values={['Объект', 'Система']}
        setSelectedValue={setDirection}>

        <View style = {{  flexDirection: 'row', width: '96%', height: 32, paddingTop: 6, justifyContent: 'space-between'}}>
          <Text style = {{fontSize: 16, color: '#1E1E1E'}}>№</Text>
          <Text style = {{fontSize: 16, color: '#1E1E1E'}} >Содержание</Text>
          <Text style = {{fontSize: 16, color: '#1E1E1E'}}>Статус</Text>
        </View>

      

        <View  style = {{  flex: 15}}>
          <Link href='/see_note' asChild>
          <TouchableWithoutFeedback>
            <View style = {{  backgroundColor: '#F8FAFC', flexDirection: 'row', width: '96%', height: 32, paddingTop: 6, justifyContent: 'space-between', marginVertical: 38}}>
              <Text style = {{fontSize: 14, color: '#334155', paddingLeft: 4}}>1</Text>
              <Text style = {{fontSize: 14, color: '#334155'}}>Текст замечания</Text>
              <Text style = {{fontSize: 14, color: '#334155', paddingEnd: 4}}>Статус</Text>
            </View>
            
          </TouchableWithoutFeedback>
          </Link>
            
          <View style = {{  backgroundColor: '#F8FAFC', flexDirection: 'row', width: '96%', height: 32, paddingTop: 6, justifyContent: 'space-between'}}>
            <Text style = {{fontSize: 14, color: '#334155', paddingLeft: 4}}>2</Text>
            <Text style = {{fontSize: 14, color: '#334155'}}>Текст замечания</Text>
            <Text style = {{fontSize: 14, color: '#334155', paddingEnd: 4}}>Статус</Text>
          </View>
        </View> 
          
        <View style={{width: 272, height: 40, justifyContent: 'center',
                //alignItems: 'center', backgroundColor: 'powderblue',
          }}>
          <Link href='/create_note' asChild>
          <TouchableOpacity  style={{ borderRadius: 8, backgroundColor: '#0072C8', width: 272, height: 40, paddingVertical: 8,  alignSelf: 'center', marginBottom: 5}}>
            <Text style={{fontSize: 16, fontWeight: '400', color: '#F5F5F5', textAlign: 'center',}}>Добавить замечание</Text>
          </TouchableOpacity>
          </Link>
        </View>
      </PreviewLayout>  

    </View>  
  </SafeAreaView>

  );
};


type PreviewLayoutProps = PropsWithChildren<{
 // label: string;
  values: string[];
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
  }:PreviewNameProps) => (
    
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
  <View style={{padding: 6, flex: 1}}>
    
    <View style={styles.row}>
      {values.map(value => (
        <TouchableOpacity
          key={value}
          onPress={() => setSelectedValue(value)}
          style={[styles.button, selectedValue === value && styles.selected]}>
          <Text
            style={[
              styles.buttonLabel,
              selectedValue === value && styles.selectedLabel,
            ]}>
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    <View style={[styles.container, ]}>{children}</View>
  </View>
);


const styles = StyleSheet.create({
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
    paddingVertical: 6,
    paddingBottom: 6,
    paddingRight: 8,
    paddingLeft: 8,
    backgroundColor: '#F8FAFC',
    marginHorizontal: '10%',
    marginBottom: 16,
    width: 103,
    height: 32,

  },
  //background: #F8FAFC;

  selected: {
    backgroundColor: '#F8FAFC',
    
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
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
});

export default DirectionLayout;