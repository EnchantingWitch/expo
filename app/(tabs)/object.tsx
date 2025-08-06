import Barchart from '@/components/Barchart';
import Linechart from '@/components/Linechart';
import PiechartBig from '@/components/PiechartBig';
import PiechartSmall from '@/components/PiechartSmall';
import useDevice from '@/hooks/useDevice';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Structure } from './structure';


  

type Object = {
  systemsPNRTotalQuantity: number; //всего систем
  systemsPNRQuantityAccepted: number; //принятых систем
  systemsPNRDynamic: number;//динамика по принятых в пнр
  actsIITotalQuantity: number;//всего ии
  actsIISignedQuantity: number;//подписанные ии
  actsIIDynamic: number;// динамика ИИ
  actsKOTotalQuantity: number; //всего ко
  actsKOSignedQuantity: number;//подписанные ко
  actsKODynamic: number; // динамика Ко
  commentsTotalQuantity: number;//всего замечаний
  commentsNotResolvedQuantity: number;//не устранено замечаний
  defectiveActsTotalQuantity: number; //всего дефектов
  defectiveActsNotResolvedQuantity: number; //устраненных дефектов
  busyStaff: number; //персонал
};

export default function TabOneScreen() {
   const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const { isMobile, isDesktopWeb, isMobileWeb, screenWidth } = useDevice();
  const router = useRouter();
  const {codeCCS} = useGlobalSearchParams();//получение код ОКС
  const {capitalCSName} = useGlobalSearchParams();//получение код ОКС
    const [inputHeight, setInputHeight] = useState(40);
 // const {capitalCSName} = useGlobalSearchParams();//получение код ОКС
 /* console.log(Id, 'Id object');
  const ID = Id;*/
  console.log(codeCCS, 'codeCCS object');
  const [accessToken, setAccessToken] = useState<any>('');
  const [lagII, setLegII] = useState<number>(0);//отставание по ИИ
  const [lagKO, setLegKO] = useState<number>(0);//отставание по КО
  const [submitPNR, setSubmitPNR] = useState<number>(0);//предъвлено в ПНР
  const [submitII, setSubmitII] = useState<number>(0);//проведено ИИ или акт ИИ на подписи
  const [submitKO, setSubmitKO] = useState<number>(0);//проведено КО или акт КО на подписи

  const [finishedGetStructure, setFinishedGetStructure] = useState<boolean>(false);
   const [structure, setStructure] = useState<Structure[]>([]);
  //router.setParams({ ID: ID });

  const navigation = useNavigation();
  
  useEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/objs/objects')}>
              <Ionicons name='home-outline' size={25} style={{alignSelf: 'center'}}/>
            </TouchableOpacity>
          ),
        });
  }, [navigation]);

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
        setStructure(json);
        console.log('ResponseSeeStructure:', response);
        setFinishedGetStructure(true);
     //   console.log('json:', json);
        //console.log('ResponseSeeStructure json:', json );
      } catch (error) {
        console.error(error);
      } finally {
        //setLoading(false);
      }
    };
  

  const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState<Object[]>([]);
  
    const getCommonInf= async () => {
        try {
          const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/objectCommonInf/'+codeCCS,
            {method: 'GET',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }}
          );
          const json = await response.json();
          
          console.log('responseCommonInfObj', response);
          console.log('responseCommonInfObj', json);
          setData(json);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        getToken();
        if (accessToken){
          getCommonInf(); 
          getStructure();} 
      }, [accessToken]);

     useEffect(() => {
  if (finishedGetStructure){
    // Подсчет "Предъявлено в ПНР"
    setSubmitPNR(countPresentedInPNR('system', structure, "Предъявлено в ПНР"));
    
    // Подсчет по ИИ (Проведены ИИ или Акт ИИ на подписи)
    setSubmitII(countPresentedInPNR('system', structure, "Проведены ИИ", "Акт ИИ на подписи", 'Акт ИИ подписан', "Проведено КО", "Акт КО на подписи", 'Акт КО подписан' ));
    
    // Подсчет по КО (Проведено КО или Акт КО на подписи)
    setSubmitKO(countPresentedInPNR('subobj', structure, "Проведено КО") + 
               countPresentedInPNR('subobj', structure, "Акт КО на подписи", 'Акт КО подписан'));
    
    // Подсчет просроченных ИИ
   //ы setLegII(countOverdueII(structure));
  } 
}, [finishedGetStructure]);


      const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

const countPresentedInPNR = (forWhat: string, dataArray: Structure[], ...statuses: string[] ) => {
  //forWhat: 'system' or 'subobj' - считать по системам или по объектам
  if (!dataArray || !Array.isArray(dataArray)) {
    console.log('Invalid data array');
    return 0;
  }

  let count = 0;

  for (const item of dataArray) {
    try {
      if (!item.data || !Array.isArray(item.data)) continue;
      
      for (const dataItem of item.data) {
        if (statuses.includes(dataItem.status)) {
          if (forWhat==='subobj'){
          count++;
          break;
        } else {count++;}
        }
      }
    } catch (error) {
      console.error('Error processing item:', item, error);
    }
  }

  console.log(`Total count for statuses [${statuses.join(', ')}]:`, count);
  return count;
};
  

  return (
   <View style={{ flex: 1, backgroundColor: 'white' }}>
     <View style={{flexDirection: 'row', paddingTop: BOTTOM_SAFE_AREA +15 }}>
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
    <View style={{alignSelf: 'center', width: isDesktopWeb&& screenWidth>900? 900 :'98%'}}>
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: 500, marginBottom: 8, textAlign: 'right', marginRight: 5 }}>{codeCCS}</Text>
    </View>
    <View style={{alignSelf: 'center', width: isDesktopWeb&& screenWidth>900? 900 :'98%'}}>
      <ScrollView style={{ }}>
        <View style={styles.container}>
          <View style={{paddingTop: 11}}>
            <PiechartSmall title='Принято в ПНР' submitted={submitPNR} totalQuantity={data.systemsPNRTotalQuantity===''? 0 : data.systemsPNRTotalQuantity} blueQuantity={data.systemsPNRQuantityAccepted} greenQuantity={data.systemsPNRDynamic} redQuantity={Math.abs(data.systemsLag)}/>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>

            <View style={{width: '49.5%'}}>
              <PiechartBig title={'Акты ИИ'} submitted={submitII} totalQuantity={data.actsIITotalQuantity===''? 0 :data.actsIITotalQuantity} blueQuantity={data.actsIISignedQuantity} greenQuantity={data.actsIIDynamic} redQuantity={data.actsIILag}/>
            </View>
            
            <View style={{width: '49.5%'}}>
              {/*<PiechartBig title={'Акты КО'} submitted={submitKO} totalQuantity={32} blueQuantity={24} greenQuantity={2} redQuantity={1}/>
              */} <PiechartBig title={'Акты КО'} submitted={submitKO} totalQuantity={data.actsKOTotalQuantity===''? 0 :data.actsKOTotalQuantity} blueQuantity={data.actsKOSignedQuantity} greenQuantity={data.actsKODynamic} redQuantity={data.actsKOLag}/>
            </View>

          </View>
          <View style={{}}>
            <Barchart totalQuantity={data.commentsTotalQuantity} blueQuantity={data.commentsTotalQuantity-data.commentsNotResolvedQuantity} greenQuantity={data.commentsDynamic} redQuantity={Math.abs(data.commentsLag)} submitted={0} title="Замечания к СМР"/>
          </View>
          <View style={{paddingTop: 11}}>
            <Barchart totalQuantity={data.defectiveActsTotalQuantity} blueQuantity={data.defectiveActsTotalQuantity-data.defectiveActsNotResolvedQuantity} greenQuantity={data.defectiveActsDynamic} redQuantity={data.defectiveActsNotResolvedQuantity} submitted={0} title="Дефекты оборудования"/>
          </View>
          <View style={{paddingTop: 11}}>
            <Linechart blueQuantity={data.busyStaff} dinamic={0} title='Персонал' codeCCS={codeCCS} accessToken={accessToken}/>
          </View>
        </View>
      </ScrollView>
    </View>
  </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '98%',
    justifyContent: 'center',
    paddingBottom: 12,
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
