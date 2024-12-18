import React, { Component, useState } from 'react';
import { ScrollView, FlatList, Image, LayoutAnimation, Platform, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, UIManager, View } from 'react-native'
import EditScreenInfo from '@/components/EditScreenInfo';
import { router } from 'expo-router';

import CustomButton from '@/components/CustomButton';

const structure = [
  {
    id: "1",
    numberKO: "12",
    subobj: "ГПА-1",
    numberofnotes: "2",
    status: "Снято"
  },

];

const Structure = () => {
  const [isSelected, setSelected] = useState(true);
  
    return(
      <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={styles.container}>

        <View style={{   flexDirection: 'row', width: '100%', height: 32, paddingTop: 6, justifyContent: 'space-between' }}>
            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#1E1E1E', textAlign: 'center' }}>№ АКО</Text>
            </View>

            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#1E1E1E', textAlign: 'center' }}>Объект</Text>
            </View>

            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#1E1E1E', textAlign: 'center' }}>Замечания</Text>
            </View>

            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#1E1E1E', textAlign: 'center' }}>Статус</Text>
            </View>
          </View>

        <FlatList
            data = {structure}
            renderItem={({item, index})=>(
              <View  >
                {isSelected ? (
                  <TouchableOpacity 
                  onPress={() => setSelected(false)}
                  >
                    <Text style={{ fontSize: 16, color: '#334155', paddingStart: '2%' }}>Объект</Text>
                   </TouchableOpacity> 
                ) : (
                  <TouchableOpacity 
                  onPress = {() => setSelected(true)}
                  >
                    <Text style={{ fontSize: 16, color: '#334155', textAlign: 'left', paddingStart: '2%'  }}>Объект </Text>

                    <TouchableOpacity onPress={() =>{ router.push('./structures/system')}}>
                    <View style={{ alignSelf: 'center',   backgroundColor: '#F8FAFC', flexDirection: 'row', width: '96%', height: 32, paddingTop: 6, justifyContent: 'center', marginBottom: 41}}>
          
                    
                      <View style={{width: '25%', }}>
                      <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>{item.numberKO}</Text>
                      </View>
          
                      <View style={{width: '25%', marginStart: 2}}>
                      <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>{item.subobj}</Text>
                      </View>
                      
                      <View style={{width: '25%', marginStart: 2}}>
                      <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center'  }}>{item.numberofnotes}</Text>
                      </View>

                      <View style={{width: '25%', marginStart: 2}}>
                      <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center'  }}>{item.status}</Text>
                      </View>
                  

                  </View></TouchableOpacity>
 
                  </TouchableOpacity>
                )}
              </View>  
            )}
            keyExtractor={item => item.id}
        />
      </View>
       <CustomButton
                    title="Загрузить"
                    handlePress={() => router.push('./structures/load_registry')} />
      </ScrollView>
    );
  };



const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '80%',
   // alignItems: 'center',
    //justifyContent: 'center',
    
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

export default Structure;

/*export default function TabOneScreen() {
  const [menuIndex, setMenuIndex] = useState(-1);

  

   
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={styles.container}>


      <TouchableOpacity activeOpacity={0.8} key={menuIndex}
            style={[ { backgroundColor: 'lithblue' }]}
            onPress={() => {
              // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
              LayoutAnimation.configureNext(LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'))
              setMenuIndex(menuIndex === menuIndex ? -1 : menuIndex)
            }}>
            
           <View style={{ backgroundColor: '#F8FAFC', flexDirection: 'row', width: '100%', height: 48, paddingTop: 6, justifyContent: 'center', marginBottom: 41,}}>

            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>№ АКО</Text>
            </View>

            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>Подъобъект</Text>
            </View>

            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>Замечания</Text>
            </View>

            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>Статус</Text>
            </View>
            </View>

            <View style={{ backgroundColor: '#F8FAFC', flexDirection: 'row', width: '100%', height: 48, paddingTop: 6, justifyContent: 'center', }}>

            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>3</Text>
            </View>

            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>КС</Text>
            </View>

            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>0</Text>
            </View>

            <View style={{width: '25%', }}>
            <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>Статус1</Text>
            </View>
            </View> 



            {menuIndex === menuIndex && <View style={{ backgroundColor: 'white'}}>
          <View style={{width: '92%', alignSelf: 'flex-end'}}>
                <TouchableNativeFeedback style={{width: '100%'}}>
                  <View style={{ backgroundColor: 'white', borderRadius: '4', borderColor: 'blue',  flexDirection: 'row', width: '100%', height: 48, paddingTop: 6, justifyContent: 'center', marginBottom: 41,}}>

                <View style={{width: '15%', }}>
                <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>3</Text>
                </View>

                <View style={{width: '25%', }}>
                <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>КС</Text>
                </View>

                <View style={{width: '25%', }}>
                <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>0</Text>
                </View>

                <View style={{width: '25%', }}>
                <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>Статус1</Text>
                </View>
                </View> 
                </TouchableNativeFeedback>
            </View>
            </View>}
          </TouchableOpacity>

        <CustomButton title='Загрузить' handlePress={() => router.push('../structures/load_registry')} />

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});*/
