import Barchart from '@/components/Barchart';
import HeaderForTabs from '@/components/HeaderForTabs';
import Linechart from '@/components/Linechart';
import PiechartBig from '@/components/PiechartBig';
import PiechartSmall from '@/components/PiechartSmall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
  const router = useRouter();
  const {codeCCS} = useGlobalSearchParams();//получение код ОКС
  const {capitalCSName} = useGlobalSearchParams();//получение код ОКС
  const [accessToken, setAccessToken] = useState<any>('');
  const [submitPNR, setSubmitPNR] = useState<number>(0);//предъвлено в ПНР
  const [submitII, setSubmitII] = useState<number>(0);//проведено ИИ или акт ИИ на подписи
  const [submitKO, setSubmitKO] = useState<number>(0);//проведено КО или акт КО на подписи

  const [finishedGetStructure, setFinishedGetStructure] = useState<boolean>(false);
  const [structure, setStructure] = useState<Structure[]>([]);

  const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        //setAccessToken(token);
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
      } catch (error) {
        console.error(error);
      } finally {
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
    <HeaderForTabs capitalCSName={capitalCSName}/>
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: 500, marginBottom: 8, textAlign: 'right', marginRight: 5 }}>{codeCCS}</Text>
    <ScrollView >
      <View style={styles.container}>

        <PiechartSmall title='Принято в ПНР' submitted={submitPNR} totalQuantity={data.systemsPNRTotalQuantity===''? 0 : data.systemsPNRTotalQuantity} blueQuantity={data.systemsPNRQuantityAccepted} greenQuantity={data.systemsPNRDynamic} redQuantity={Math.abs(data.systemsLag)}/>
    
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

          <View style={{width: '49.5%'}}>
            <PiechartBig title={'Акты ИИ'} submitted={submitII} totalQuantity={data.actsIITotalQuantity===''? 0 :data.actsIITotalQuantity} blueQuantity={data.actsIISignedQuantity} greenQuantity={data.actsIIDynamic} redQuantity={data.actsIILag}/>
          </View>
          
          <View style={{width: '49.5%'}}>
            {/*<PiechartBig title={'Акты КО'} submitted={submitKO} totalQuantity={32} blueQuantity={24} greenQuantity={2} redQuantity={1}/>
            */} <PiechartBig title={'Акты КО'} submitted={submitKO} totalQuantity={data.actsKOTotalQuantity===''? 0 :data.actsKOTotalQuantity} blueQuantity={data.actsKOSignedQuantity} greenQuantity={data.actsKODynamic} redQuantity={data.actsKOLag}/>
         </View>

        </View>

        <Barchart totalQuantity={data.commentsTotalQuantity} blueQuantity={data.commentsTotalQuantity-data.commentsNotResolvedQuantity} greenQuantity={data.commentsDynamic} redQuantity={Math.abs(data.commentsLag)} submitted={0} title="Замечания к СМР"/>
        <View style={{paddingTop: 11}}>
          <Barchart totalQuantity={data.defectiveActsTotalQuantity} blueQuantity={data.defectiveActsTotalQuantity-data.defectiveActsNotResolvedQuantity} greenQuantity={data.defectiveActsDynamic} redQuantity={data.defectiveActsNotResolvedQuantity} submitted={0} title="Дефекты оборудования"/>
        </View>
        <View style={{paddingTop: 11}}>
          <Linechart blueQuantity={data.busyStaff} dinamic={0} title='Персонал' codeCCS={codeCCS} accessToken={accessToken}/>
        </View>
      </View>
    </ScrollView>
  </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '96%',
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
