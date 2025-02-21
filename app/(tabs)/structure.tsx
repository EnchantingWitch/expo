import React, { Component, useState, useEffect } from 'react';
import { SectionList, ScrollView, FlatList, Image, LayoutAnimation, Platform, StyleSheet, Text, TouchableNativeFeedback, TouchableWithoutFeedback, TouchableOpacity, UIManager, View } from 'react-native'
import EditScreenInfo from '@/components/EditScreenInfo';
import { Link, router, useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import MonoSizeText from '@/components/FontSize'
import { useWindowDimensions,  } from 'react-native';

import CustomButton from '@/components/CustomButton';;

export type Structure = {
  id: number;
  numberKO: string; //id замечания , генерируется на сервере
  subObjectName: string;//номер замечания
  comments: number;
  status: string;
  
    data:[{
      numberII: string,
      systemName: string,
      comments: number,
      status: string,
      statusList: [],
      pnrfactDate: string,
      iiplanDate: string,
      iifactDate: string,
      koplanDate: string,
      kofactDate: string,
      ciwexecutor: string,
      cwexecutor: string,
      pnrplanDate: string,
      pnrsystemId: number,
      ccsnumber: string,
}],
};


const Struct = () => {
  const [isSelected, setSelected] = useState(true);
  const router = useRouter();
  const {codeCCS} = useGlobalSearchParams();//получение кода ОКС 
  console.log(codeCCS, 'ID structure');
  
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const [isLoading, setLoading] = useState(true);
  const [data_, setData] = useState<Structure[]>([]);

  const getStructure = async () => {
      try {
        const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/getStructureCommonInf/051-2004430.0012');
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

    const [expandedSections, setExpandedSections] = useState(new Set());

    //для раскрывающего списка
    const handleToggle = (title) => {
      setExpandedSections((expandedSections) => {
        // Using Set here but you can use an array too
        const next = new Set(expandedSections);
        if (next.has(title)) {
          next.delete(title);
        } else {
          next.add(title);
        }
        return next;
      });
    };


    const renderSectionHeader=({ section}: {section: Structure}) => (
      <TouchableWithoutFeedback onPress={() => handleToggle(section.id)}>
      <View style={{flexDirection: 'row', backgroundColor: '#E0F2FE', width: '98%', height: 37,  marginBottom: '5%', alignItems: 'center', borderRadius: 8, alignSelf: 'center'}}>
        
        <View style={{width: '10%', }}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{section.numberKO}</Text>
        </View>

        <View style={{width: '55%'}}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{section.subObjectName}</Text>
        </View>

        <View style={{width: '21%'}}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{section.comments}</Text>
        </View>

        <View style={{width: '14%'}}>
        {/*<Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{status}</Text>*/}

        {(section.status =='Ведутся СМР') ? ( <TouchableWithoutFeedback><View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>СМР</Text></View></TouchableWithoutFeedback>): ''} 
          {(section.status =='Завершены СМР') ? ( <View style={{width: '92%', height: '25',justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>СМР</Text></View>): ''} 

          {(section.status =='Предъявлено в ПНР') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center'  }}>ПНР</Text></View>): ''} 
          {(section.status =='Принято в ПНР') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>ПНР</Text></View>): ''} 
          {(section.status =='Ведутся ПНР') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ПНР</Text></View>): ''} 

          {(section.status =='Проведены ИИ') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>): ''} 
          {(section.status =='Акт ИИ на подписи') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>ИИ</Text></View>): ''} 
          {(section.status =='Акт ИИ подписан') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>): ''} 

          {(section.status =='Проводится КО') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>КО</Text></View>): ''}
          {(section.status =='Проведено КО') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}
          {(section.status =='Акт КО на подписи') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>КО</Text></View>): ''}
          {(section.status =='Акт КО на подписан') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}

        </View>

      </View></TouchableWithoutFeedback>
     );

    const renderItem = ({section, item }: { section: id , item: data }) => {

      const isExpanded = expandedSections.has(section.id);
      if (!isExpanded) return null;

      return(
      <TouchableOpacity onPress={() =>router.push({pathname: '/structures/system', params: { post: item.pnrsystemId, codeCCS: codeCCS}})} style={{width: '99%'}}>
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
        {(item.status =='1') ? ( <TouchableWithoutFeedback><View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>СМР</Text></View></TouchableWithoutFeedback>): ''} 
        {(item.status =='2') ? ( <View style={{width: '92%', height: '25',justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>СМР</Text></View>): ''} 

        {(item.status =='3') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center'  }}>ПНР</Text></View>): ''} 
        {(item.status =='4') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>ПНР</Text></View>): ''} 
        {(item.status =='5') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ПНР</Text></View>): ''} 

        {(item.status =='6') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>): ''} 
        {(item.status =='7') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>ИИ</Text></View>): ''} 
        {(item.status =='8') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>): ''} 

        {(item.status =='9') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>КО</Text></View>): ''}
        {(item.status =='10') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}
        {(item.status =='11') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>КО</Text></View>): ''}
        {(item.status =='12') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}
        </View>

      </View>
      </TouchableOpacity>
    )};

    

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
            sections = {data_}
            extraData={expandedSections}
            keyExtractor={({pnrsystemId}) => pnrsystemId}

            renderItem={renderItem}
                        
             renderSectionHeader={renderSectionHeader}
                  
            
        />
       
      </View>
       <CustomButton
                    title="Загрузить"
                    handlePress={() => router.push({pathname: '/structures/load_registry', params: {ID: ID}})} />
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
