import React, {useState} from 'react';
import { StyleSheet, Button, Pressable, TouchableOpacity, SafeAreaView } from 'react-native';
import type {PropsWithChildren} from 'react';
import tw from 'tailwind-rn'

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

const DirectionLayout = () => {
  const [direction, setDirection] = useState('Объект');

  return (
  <SafeAreaView style = {{flex: 0.21}}>

    <PreviewLayout
//      label="direction"
    /*  <View
      style={{
      flexDirection: 'row',
      height: 100,
      padding: 20,
      }}>
      <View style={{backgroundColor: 'blue', flex: 0.3}} />
      */
      selectedValue={direction}
      values={['Объект', 'Система']}
    //  <View/>
      setSelectedValue={setDirection}>
      <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
     // flexDirection: 'row',
      //height: 80,
      //padding: 20,
      //alignSelf: 'flex-start',
     // alignItems: 'center',
   // justifyContent: 'flex-end',
      }}>
        <PreviewName
        values={['№', 'Содержание замечания', 'Статус' ]}>
        </PreviewName>
      </View>  
      
    </PreviewLayout>
    <Text>list of notes</Text>

    <View
      style={{
     // flexDirection: 'row',
      //height: 80,
      //padding: 20,
      //alignSelf: 'flex-start',
      //alignItems: 'center',
    //justifyContent: 'flex-end',
      //paddingHorizontal: 12,
      //paddingVertical: 9,
    //  flex: 1.3,
       
       // position: 'absolute', //Here is the trick
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: 'cornflowerblue',
       borderWidth: 0,
       //padding: 1,
      }}>
    <Button style={[styles.buttonLabel]}
        title="Добавить замечание"
    />
    </View>
  </SafeAreaView>


  );
};

/*<View
      style={{
      flexDirection: 'row',
      height: 2,
      padding: 20,
      }}>
      <View style={[styles.box, {backgroundColor: 'powderblue'}]} />
      <View style={[styles.box, {backgroundColor: 'skyblue'}]} />
      <View style={[styles.box, {backgroundColor: 'steelblue'}]} />
      </View>
      */
/*<PreviewName
values={['№', 'Содержание замечания', 'Статус' ]}>
</PreviewName>*/

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
  <View style={{padding: 10, flex: 1}}>
    
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
    justifyContent: 'center',
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
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'aliceblue',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '30%',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: 'cornflowerblue',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'cornflowerblue',
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
});

export default DirectionLayout;