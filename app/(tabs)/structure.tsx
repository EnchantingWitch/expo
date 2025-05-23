import CustomButton from '@/components/CustomButton';
import MonoSizeText from '@/components/FontSize';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import { default as React, useEffect, useState } from 'react';
import { Modal, Platform, SectionList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';

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
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
    
  const [isSelected, setSelected] = useState(true);
  const router = useRouter();
  const {codeCCS} = useGlobalSearchParams();//получение кода ОКС 
  const {capitalCSName} = useGlobalSearchParams();//получение наименование ОКС 
  console.log(codeCCS, 'codeCCS structure');
  console.log(capitalCSName, 'capitalCSName structure');
  const [inputHeight, setInputHeight] = useState(40);
  const [accessToken, setAccessToken] = useState<any>('');
  const [visible, setVisible] = useState<boolean>(false);
  
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const navigation = useNavigation();
  
  useEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.replace('/objs/objects')} >
            <Ionicons name='home-outline' size={25} />
          </TouchableOpacity>
        ),
      });
  }, [navigation]);

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
     //   console.log('json:', json);
        //console.log('ResponseSeeStructure json:', json );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const getToken = async () => {
      try {
          const token = await AsyncStorage.getItem('accessToken');
          //setAccessToken(token);
          if (token !== null) {
              console.log('Retrieved token:', token);
              setAccessToken(token);
              //вызов getAuth для проверки актуальности токена
              //authUserAfterLogin();
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
      <View style={{flexDirection: 'row', backgroundColor: '#E0F2FE', width: '98%', height: 37,   marginBottom: '3%', marginTop: '2%', alignItems: 'center', borderRadius: 8, alignSelf: 'center'}}>
        
        <View style={{width: '10%', alignItems: 'center' }}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center', lineHeight: ts(18),includeFontPadding: false, }} numberOfLines={2}>{section.numberKO}</Text>
        </View>

        <View style={{width: '55%', }}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center', lineHeight: ts(18),includeFontPadding: false, }} numberOfLines={2}>{section.subObjectName}</Text>
        </View>

        <View style={{width: '21%'}}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center', lineHeight: ts(18),includeFontPadding: false, }} numberOfLines={2}>{section.comments}</Text>
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
          {(section.status =='Акт КО подписан') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}

        </View>

      </View></TouchableWithoutFeedback>
     );

    const renderItem = ({section, item }: { section: id , item: data }) => {

      const isExpanded = expandedSections.has(section.id);
      if (!isExpanded) return null;

      return(
      <TouchableOpacity onPress={() =>router.push({pathname: '/structures/system', params: { post: item.pnrsystemId, codeCCS: codeCCS, capitalCSName: capitalCSName, ii:  item.numberII}})} style={{width: '99%'}}>
      <View style={{flexDirection: 'row',borderWidth: 2, borderColor: '#E0F2FE', alignSelf: 'flex-end',   width: '96%', height: 37, marginBottom: '2.5%', marginLeft: '1%', borderRadius: 8}}>

        <View style={{width: '11%',  justifyContent: 'center',alignSelf: 'center'}}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center', lineHeight: ts(16),includeFontPadding: false,}}  numberOfLines={2} >{item.numberII}</Text>
        </View>
        
        <View style={{width: '53%',  justifyContent: 'center',alignSelf: 'center',  height: 37}}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left', lineHeight: ts(16), includeFontPadding: false, }}  numberOfLines={2}>{item.systemName}</Text>
        </View>
        
        <View style={{width: '22%', justifyContent: 'center',alignSelf: 'center' }}>
        <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center', lineHeight: ts(16), includeFontPadding: false, }}  numberOfLines={2}>{item.comments}</Text>{/**{item.comments} */}
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
        {(item.status =='Акт КО подписан') ? ( <View style={{width: '92%', height: '25', justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8}}>
        <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>): ''}
        </View>
</View>
     
      </TouchableOpacity>
    )};


    return(
      <View style={{ backgroundColor: 'white', flex: 1 }}>
         <View style={{flexDirection: 'row', paddingTop: BOTTOM_SAFE_AREA +15}}>
    <TouchableOpacity onPress={() => router.replace('/objs/objects')}>
              <Ionicons name='home-outline' size={25} style={{alignSelf: 'center'}}/>
            </TouchableOpacity>
    <TextInput
        style={{
          flex: 1,
          paddingTop:  0,
          fontWeight: 500,
          height: Math.max(42,inputHeight), // min: 42, max: 100
          fontSize: ts(20),
          textAlign: 'center',          // Горизонтальное выравнивание.
          textAlignVertical: 'center',  // Вертикальное выравнивание (Android/iOS).
        }}
        multiline
        editable={false}
        onContentSizeChange={e => {
          const newHeight = e.nativeEvent.contentSize.height;
          setInputHeight(Math.max(42, newHeight));
        }}
      >
        {capitalCSName}
      </TextInput>
      </View>
      <View style={styles.container}>

        <View style={{width: '98%', alignSelf: 'center',  flexDirection: 'row', height: 32,}}>
            <View style={{width: '10%', }}>
            <Text style={{ fontSize: MonoSizeText(14), color: '#1E1E1E', textAlign: 'center' }}>№</Text>
            </View>

            <View style={{width: '55%', }}>
            <Text style={{ fontSize: MonoSizeText(14), color: '#1E1E1E', textAlign: 'center' }}>Подобъект</Text>
            </View>

            <View style={{width: '21%', }}>
            <Text style={{ fontSize: MonoSizeText(14), color: '#1E1E1E', textAlign: 'center' }}>Замеч</Text>
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
                    animationType="slide" // Можно использовать 'slide', 'fade' или 'none'
                    transparent={true} // Установите true, чтобы сделать фон полупрозрачным
                    visible={visible}
                    onRequestClose={() => setVisible(false)} // Для Android
                    >
                    <View style={styles.modalContainer}>
                      
                      <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => setVisible(false)} style = {{alignSelf: 'flex-end', }}>
                          <Ionicons name='close-outline' size={30} />
                        </TouchableOpacity>
   <View style={{flexDirection: 'row', justifyContent: 'center'}}      >       
    <View style={{width: '20%'}}>   
          <View style={{width: '80%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>СМР</Text></View>
          <View style={{width: '80%', height: '25',justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>СМР</Text></View>

          <View style={{width: '80%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'center'  }}>ПНР</Text></View>
          <View style={{width: '80%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>ПНР</Text></View>
          <View style={{width: '80%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ПНР</Text></View>

        <View style={{width: '80%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View>
          <View style={{width: '80%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>ИИ</Text></View>
          <View style={{width: '80%', height: '25', justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>ИИ</Text></View> 

          <View style={{width: '80%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: '#0072C8', textAlign: 'center'  }}>КО</Text></View>
          <View style={{width: '80%', height: '25', justifyContent: 'center', backgroundColor: '#0072C8', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>
          <View style={{width: '80%', height: '25', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: '#16a34a', textAlign: 'center'  }}>КО</Text></View>
          <View style={{width: '80%', height: '25', justifyContent: 'center', backgroundColor: '#16a34a', borderRadius: 8, marginBottom: 5}}>
          <Text style={{ fontSize: ts(14), color: 'white', textAlign: 'center'  }}>КО</Text></View>
    </View>  

    <View style={{width: '50%'}}>   
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left', marginBottom: 11.2  }}>Ведутся СМР</Text>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left', marginBottom: 11.2  }}>Завершены СМР</Text>

        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Предъявлено в ПНР</Text>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left', marginBottom: 11.2 }}>Принято в ПНР</Text>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Ведутся ПНР</Text>
        
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Проведены ИИ</Text>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Акт ИИ на подписи</Text>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Акт ИИ подписан</Text>

        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Проводится КО</Text>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left'  , marginBottom: 11.2}}>Проведено КО</Text>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Акт КО на подписи</Text>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', textAlign: 'left' , marginBottom: 11.2 }}>Акт КО подписан</Text>

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