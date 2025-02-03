import React, { Component, useState, useEffect } from 'react';
import { SectionList, ScrollView, FlatList, Image, LayoutAnimation, Platform, StyleSheet, Text, TouchableNativeFeedback, TouchableWithoutFeedback, TouchableOpacity, UIManager, View } from 'react-native'
import EditScreenInfo from '@/components/EditScreenInfo';
import { Link, router, useNavigation } from 'expo-router';
import MonoSizeText from '@/components/FontSize'
import { useWindowDimensions,  } from 'react-native';

import CustomButton from '@/components/CustomButton';

type Structure = {
  id: number;
  numberKO: string; //id замечания , генерируется на сервере
  subObjectName: string;//номер замечания
  comments: number;
  status: string;
  
    data:[{
      id: number,
      numberII: string,
      systemName: string,
      comments: number,
      status: string
}],
};


const Struct = () => {
  const [isSelected, setSelected] = useState(true);
  const navigation = useNavigation();
  
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Structure[]>([]);

  const getStructure = async () => {
      try {
        const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/getStuctureCommonInf/051-2004430.0012');
        const json = await response.json();
        setData(json);
        console.log('ResponseSeeStructure:', response);
        console.log(typeof(json));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      getStructure();
    }, []);

    

  //const font16 = MonoSizeText(16);
    return(
      <View style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={styles.container}>

        <View style={{width: '98%', alignSelf: 'center',  flexDirection: 'row', height: 32, paddingTop: 6 }}>
            <View style={{width: '10%', }}>
            <Text style={{ fontSize: MonoSizeText(14), color: '#1E1E1E', textAlign: 'center' }}>№</Text>
            </View>

            <View style={{width: '55%', }}>
            <Text style={{ fontSize: MonoSizeText(14), color: '#1E1E1E', textAlign: 'center' }}>Подъобъект</Text>
            </View>

            <View style={{width: '21%', }}>
            <Text style={{ fontSize: MonoSizeText(14), color: '#1E1E1E', textAlign: 'center' }}>Замеч</Text>
            </View>

            <View style={{width: '14%', }}>
            <Text style={{ fontSize: MonoSizeText(14), color: '#1E1E1E', textAlign: 'center' }}>Статус</Text>
            </View>
        </View>

        <SectionList
            sections = {data}
            keyExtractor={({id}) => id}
                        
             renderSectionHeader={({section: {numberKO, subObjectName, comments, status}}) => (
                    <View style={{flexDirection: 'row', backgroundColor: '#E0F2FE', width: '98%', height: 37,  marginBottom: '5%', alignItems: 'center', borderRadius: 8, alignSelf: 'center'}}>
                      
                      <View style={{width: '10%', }}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{numberKO}</Text>
                      </View>

                      <View style={{width: '55%'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{subObjectName}</Text>
                      </View>

                      <View style={{width: '21%'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{comments}</Text>
                      </View>

                      <View style={{width: '14%'}}>
                      <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{status}</Text>
                      </View>

                    </View>
                   )}
                
                  
                    renderItem={({item}) => (
                     
                      <TouchableOpacity onPress={() =>{[navigation.navigate('(tabs)', {screen: 'system'}, {idSystem: item.id}), router.push('/structures/system')]}} style={{width: '99%'}}>
                      <View style={{borderWidth: 2, borderColor: '#E0F2FE', alignSelf: 'flex-end', flexDirection: 'row', width: '95%', height: 37, marginBottom: '5%', borderRadius: 8}}>
            
                        <View style={{width: '7%',  justifyContent: 'center',}}>
                        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{item.numberII}</Text>
                        </View>
                        
                        <View style={{width: '57%',  justifyContent: 'center', }}>
                        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{item.systemName}</Text>
                        </View>
                        
                        <View style={{width: '22%', justifyContent: 'center',}}>
                        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center'  }}>{item.comments}</Text>
                        </View>

                        <View style={{width: '14%',  justifyContent: 'center'}}>
                        {/*<Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center'  }}>{item.status}</Text>*/}
                       {(item.status =='Ведутся СМР') ? ( <TouchableWithoutFeedback><View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>СМР</Text></View></TouchableWithoutFeedback>): ''} 
                        {(item.status =='Завершены СМР') ? ( <View style={{width: '92%', height: '25',justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>СМР</Text></View>): ''} 

                        {(item.status =='Предъявлено в ПНР') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center'  }}>ПНР</Text></View>): ''} 
                        {(item.status =='Принято в ПНР') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>ПНР</Text></View>): ''} 
                        {(item.status =='Ведутся ПНР') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ПНР</Text></View>): ''} 

                        {(item.status =='Проведены ИИ') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>): ''} 
                        {(item.status =='Акт ИИ на подписи') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>ИИ</Text></View>): ''} 
                        {(item.status =='Акт ИИ подписан') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>): ''} 

                        {(item.status =='Проводится КО') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>КО</Text></View>): ''}
                        {(item.status =='Проведено КО') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}
                        {(item.status =='Акт КО на подписи') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>КО</Text></View>): ''}
                        {(item.status =='Акт КО на подписан') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
                        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}
                        </View>

                      </View>
                      </TouchableOpacity>

                    )}
        />
       
      </View>
       <CustomButton
                    title="Загрузить"
                    handlePress={() => router.push('/structures/load_registry')} />
      </View>
    );
  };



const styles = StyleSheet.create({
  container: {
    flex: 1,
    //height: 520,
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

export default Struct;

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
