import CustomButton from '@/components/CustomButton';
import MonoSizeText from '@/components/FontSize';
import HeaderForTabs from '@/components/HeaderForTabs';
import useDevice from '@/hooks/useDevice';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { default as React, useEffect, useState } from 'react';
import { Modal, SectionList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';

export type Structure = {
  id: number;
  numberKO: string; //id замечания , генерируется на сервере
  subObjectName: string;
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
      ciwexecutor: string,//смр
      cwexecutor: string,//пнр
      pnrplanDate: string,
      pnrsystemId: number,
      ccsnumber: string,
}],
};


const Struct = () => {
  const { isDesktopWeb, screenWidth } = useDevice();
  const router = useRouter();
  const {codeCCS} = useGlobalSearchParams();//получение кода ОКС 
  const {capitalCSName} = useGlobalSearchParams();//получение наименование ОКС 
  const [accessToken, setAccessToken] = useState<any>('');
  const [visible, setVisible] = useState<boolean>(false);
  
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const [isLoading, setLoading] = useState(true);
  const [data_, setData] = useState<Structure[]>([]);

  const getStructure = async () => {
      try {
        const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/getStructureCommonInf/'+codeCCS,
          {method: 'GET',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }}
        );
        const json = await response.json();
        setData(json);
        console.log('ResponseSeeStructure:', response);
        //console.log('json:', json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const getToken = async () => {
      try {
          const token = await AsyncStorage.getItem('accessToken');
          if (token !== null) {
              console.log('Retrieved token:', token);
              setAccessToken(token);
          } else {
              console.log('No token found');
              router.push('/sign/sign_in');
          }
      } catch (error) {
          console.error('Error retrieving token:', error);
      }
  };
  
    useEffect(() => {
      getToken();
      if (accessToken){getStructure();}
      
    }, [accessToken]);

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
      <TouchableWithoutFeedback onPress={() => handleToggle(section.id)}>{/** E0F2FE */}
      <View style={{flexDirection: 'row', backgroundColor: '#E0F2FE', width: '100%', height: 42,   marginBottom: 9, marginTop: 6, alignItems: 'center', borderRadius: 8, alignSelf: 'center'}}>
        
        <View style={{width: '10%', alignItems: 'center' }}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center', lineHeight: ts(18),includeFontPadding: false, }} numberOfLines={2}>{section.numberKO}</Text>
        </View>

        <View style={{width: '55%', }}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center', lineHeight: ts(18),includeFontPadding: false, }} numberOfLines={2}>{section.subObjectName}</Text>
        </View>

        <View style={{width: '21%'}}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center', lineHeight: ts(18),includeFontPadding: false, }} numberOfLines={2}>{section.comments}</Text>
        </View>

        <View style={{width: '14%', alignItems: 'center', justifyContent: 'center'}}>
        {/*<Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center' }}>{status}</Text>*/}

        {(section.status =='Ведутся СМР') ? ( <TouchableWithoutFeedback><View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>СМР</Text></View></TouchableWithoutFeedback>): ''} 
          {(section.status =='Завершены СМР') ? ( <View style={{width: 40, height: 25,justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>СМР</Text></View>): ''} 

          {(section.status =='Предъявлено в ПНР') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center'  }}>ПНР</Text></View>): ''} 
          {(section.status =='Принято в ПНР') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>ПНР</Text></View>): ''} 
          {(section.status =='Ведутся ПНР') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ПНР</Text></View>): ''} 

          {(section.status =='Проведены ИИ') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>): ''} 
          {(section.status =='Акт ИИ на подписи') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>ИИ</Text></View>): ''} 
          {(section.status =='Акт ИИ подписан') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>): ''} 

          {(section.status =='Проводится КО') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>КО</Text></View>): ''}
          {(section.status =='Проведено КО') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}
          {(section.status =='Акт КО на подписи') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>КО</Text></View>): ''}
          {(section.status =='Акт КО подписан') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}

        </View>

      </View></TouchableWithoutFeedback>
     );

    const renderItem = ({section, item }: { section: id , item: data }) => {

      const isExpanded = expandedSections.has(section.id);
      if (!isExpanded) return null;

      return(
      <TouchableOpacity onPress={() =>router.push({pathname: '/structures/system', params: { post: item.pnrsystemId, codeCCS: codeCCS, capitalCSName: capitalCSName, ii:  item.numberII}})} style={{width: '100%'}}>
      <View style={{flexDirection: 'row',borderWidth: 2, borderColor: '#E0F2FE', alignSelf: 'flex-end',   width: '98%', height: 42, marginLeft: '1%',  marginBottom: 7,  borderRadius: 8}}>{/**/}

        <View style={{width: '11%',  justifyContent: 'center',alignSelf: 'center'}}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center', lineHeight: ts(16),includeFontPadding: false,}}  numberOfLines={2} >{item.numberII}</Text>
        </View>
        
        <View style={{width: '53%',  justifyContent: 'center',alignSelf: 'center',  height: 42}}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left', lineHeight: ts(16), includeFontPadding: false, }}  numberOfLines={2}>{item.systemName}</Text>
        </View>
        
        <View style={{width: '22%', justifyContent: 'center',alignSelf: 'center' }}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center', lineHeight: ts(16), includeFontPadding: false, }}  numberOfLines={2}>{item.comments}</Text>{/**{item.comments} */}
        </View>

        <View style={{width: '14%',  justifyContent: 'center', alignItems: 'center',}}>
       {/*<Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center'  }}>{item.status}</Text>*/}
        {(item.status =='Ведутся СМР') ? ( <TouchableWithoutFeedback><View style={{width: 40, height: 25, justifyContent: 'center', alignContent: 'center',backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>СМР</Text></View></TouchableWithoutFeedback>): ''} 
        {(item.status =='Завершены СМР') ? ( <View style={{width: 40, height: 25,justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>СМР</Text></View>): ''} 

        {(item.status =='Предъявлено в ПНР') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center'  }}>ПНР</Text></View>): ''} 
        {(item.status =='Принято в ПНР') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>ПНР</Text></View>): ''} 
        {(item.status =='Ведутся ПНР') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ПНР</Text></View>): ''} 

        {(item.status =='Проведены ИИ') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>): ''} 
        {(item.status =='Акт ИИ на подписи') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>ИИ</Text></View>): ''} 
        {(item.status =='Акт ИИ подписан') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>): ''} 

        {(item.status =='Проводится КО') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>КО</Text></View>): ''}
        {(item.status =='Проведено КО') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}
        {(item.status =='Акт КО на подписи') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>КО</Text></View>): ''}
        {(item.status =='Акт КО подписан') ? ( <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}
        </View>
</View>
     
      </TouchableOpacity>
    )};

    return(
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <HeaderForTabs capitalCSName={capitalCSName} nameTab='Структура'/>
      <View style={[styles.container, {width: isDesktopWeb&& screenWidth>900? 900 : '98%', alignSelf: 'center'}]}>

        <View style={{width:  '98%', alignSelf: 'center',  flexDirection: 'row', height: 40,}}>
            <View style={{width: '10%', }}>
            <Text style={{ fontSize: MonoSizeText(14), color: '#1E1E1E', textAlign: 'center' }}>№ акта</Text>
            </View>

            <View style={{width: '55%', }}>
            <Text style={{ fontSize: MonoSizeText(14), color: '#1E1E1E', textAlign: 'center' }}>Подобъект/Система</Text>
            </View>

            <View style={{width: '21%', }}>
            <Text style={{ fontSize: MonoSizeText(14), color: '#1E1E1E', textAlign: 'center' }}>{isDesktopWeb? 'Замечания' : 'Замеч'}</Text>
            </View>

            <View style={{width: '14%', flexDirection: 'column'}}>
            <Text style={{ fontSize: MonoSizeText(14), color: '#1E1E1E', textAlign: 'center' }}>Статус</Text>
            <TouchableOpacity onPress={()=>setVisible(true)}>
            <Ionicons name='help-circle-outline' size={20} style={{alignSelf: 'center', width: 22, color: '#0072C8'}} /></TouchableOpacity>
            </View>
        </View>

        <SectionList
            sections = {data_}
            extraData={expandedSections}
            keyExtractor={({pnrsystemId}) => pnrsystemId}
            renderItem={renderItem}          
            renderSectionHeader={renderSectionHeader} 
        />
       

         <Modal
                    animationType="fade" // Можно использовать 'slide', 'fade' или 'none'
                    transparent={true} // Установите true, чтобы сделать фон полупрозрачным
                    visible={visible}
                    onRequestClose={() => setVisible(false)} // Для Android
                    >
                    <View style={styles.modalContainer}>
                      
                      <View style={[styles.modalContent, { height: 480,}]}>
                        <TouchableOpacity onPress={() => setVisible(false)} style = {{alignSelf: 'flex-end', }}>
                          <Ionicons name='close-outline' size={30} />
                        </TouchableOpacity>
   <View style={{flexDirection: 'row', justifyContent: 'center'}}>       
    <View style={{width: '20%'}}>   
          <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>СМР</Text></View>
          <View style={{width: 40, height: 25,justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>СМР</Text></View>

          <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center'  }}>ПНР</Text></View>
          <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>ПНР</Text></View>
          <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ПНР</Text></View>

        <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>
          <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>ИИ</Text></View>
          <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View> 

          <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>КО</Text></View>
          <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>
          <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>КО</Text></View>
          <View style={{width: 40, height: 25, justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8, marginBottom: 11.2}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>
    </View>  

    <View style={{width: '50%'}}>   
        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left', marginBottom: 11.2  }}>Ведутся СМР</Text>
        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left', marginBottom: 11.2  }}>Завершены СМР</Text>

        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Предъявлено в ПНР</Text>
        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left', marginBottom: 11.2 }}>Принято в ПНР</Text>
        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Ведутся ПНР</Text>
        
        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Проведены ИИ</Text>
        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Акт ИИ на подписи</Text>
        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Акт ИИ подписан</Text>

        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Проводится КО</Text>
        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left'  , marginBottom: 11.2}}>Проведено КО</Text>
        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Акт КО на подписи</Text>
        <Text style={{ fontSize: ts(14), height: 25, color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Акт КО подписан</Text>

      </View> 
  </View>  
                      </View>
                    </View>
                  </Modal>



      </View>
       <CustomButton
                    title="Загрузить"
                    handlePress={() => router.push({pathname: '/structures/load_registry', params: {codeCCS: codeCCS, capitalCSName: capitalCSName}})} />
      </View>

      
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
    
  },
  modalContent: {
    width: 300,
    height: 400,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
  },
});

export default Struct;