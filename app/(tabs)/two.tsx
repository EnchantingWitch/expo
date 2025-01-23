import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Button, Pressable, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, TouchableHighlight, TouchableNativeFeedback } from 'react-native';
import type { PropsWithChildren } from 'react';
import {  router } from 'expo-router';
import tw from 'tailwind-rn'
import DropdownComponent from '@/components/list_system_for_listOfnotes';
import CustomButton from '@/components/CustomButton';
import Note from '@/components/Note';
import listOfNotes from '../notes/see_note';
//import { useNavigation } from '@react-navigation/native';


import EditScreenInfo from '@/components/EditScreenInfo';
import { Colors } from 'react-native/Libraries/NewAppScreen';
//import { Text, View } from '@/components/Themed';

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


//{ navigation }: {navigation: any} было в круглых скобках
const DirectionLayout = () => {
  
  //const navigation = useNavigation();

  const [direction, setDirection] = useState('Объект');
  
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Note[]>([]);

  const getNotes = async () => {
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/getAllComments');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

      <View style={{
        flex: 1, alignItems: 'center'
        // justifyContent: 'center', flexDirection: 'row', height: 80, padding: 20, alignSelf: 'flex-start', alignItems: 'stretch', justifyContent: 'space-around',
      }}>

        <PreviewLayout
          selectedValue={direction}
          values={['Объект', <DropdownComponent />]}
          setSelectedValue={setDirection}>

          
          <View style={{ flexDirection: 'row', width: '98%', height: 32, paddingTop: 6, justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, color: '#1E1E1E' }}>№</Text>
            <Text style={{ fontSize: 16, color: '#1E1E1E' }}>Содержание</Text>
            <Text style={{ fontSize: 16, color: '#1E1E1E' }}>Статус</Text>
          </View>



          <View style={{ flex: 15, marginTop: 48}}>

               { isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                style={{width: '100%'}}
                data={data}
                keyExtractor={({commentId}) => commentId}
                renderItem={({item}) => (
/*<TouchableWithoutFeedback onPress={() =>{ navigation.navigate('Details', {variable: {item.commentId}}); router.push('/notes/see_note')}}>*/
                  <TouchableWithoutFeedback onPress={() =>{  router.push('/notes/see_note')}}>
                  <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 32, justifyContent: 'center', marginBottom: 41, borderRadius: 8}}>
          
                      <View style={{width: '15%', justifyContent: 'center'}}>
                      <Text style={{ fontSize: 14, color: '#334155', textAlign: 'left' }}>{item.serialNumber}</Text>
                      </View>
          
                      <View style={{width: '75%', marginStart: 2, justifyContent: 'center'}}>
                      <Text style={{ fontSize: 14, color: '#334155', textAlign: 'left' }}>{item.description}</Text>
                      </View>
                      
                      <View style={{width: '7%', marginStart: 2, justifyContent: 'center'}}>
                      <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center'  }}>{item.commentStatus}</Text>
                      </View>
                  </View>
                  </TouchableWithoutFeedback>

          )}
              />
            )}

            
           
          </View>

          <View style={{
            width: 272, height: 40, justifyContent: 'center',
            //alignItems: 'center', backgroundColor: 'powderblue',
          }}>
            <CustomButton
              title="Добавить замечание"
              handlePress={() => router.push('/notes/create_note')} />
          </View>
        </PreviewLayout >

      </View >
    </SafeAreaView >

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
              styles.buttonLabel,
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

/*
 <Note 
            id={1}
            number={1}
            note='Текст замечания'
            status='-'
            theme='click'
            onPress={() => router.push('/notes/see_note')}
            ></Note>

            */