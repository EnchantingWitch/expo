import Barchart from '@/components/Barchart';
import Linechart from '@/components/Linechart';
import PiechartBig from '@/components/PiechartBig';
import PiechartSmall from '@/components/PiechartSmall';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
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
    setSubmitPNR(countPresentedInPNR(structure, "Предъявлено в ПНР"));
    
    // Подсчет по ИИ (Проведены ИИ или Акт ИИ на подписи)
    setSubmitII(countPresentedInPNR(structure, "Проведены ИИ", "Акт ИИ на подписи"));
    
    // Подсчет по КО (Проведено КО или Акт КО на подписи)
    setSubmitKO(countPresentedInPNR(structure, "Проведено КО") + 
               countPresentedInPNR(structure, "Акт КО на подписи"));
    
    // Подсчет просроченных ИИ
   //ы setLegII(countOverdueII(structure));
  } 
}, [finishedGetStructure]);


      const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

const countPresentedInPNR = (dataArray: Structure[], ...statuses: string[]) => {
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
          count++;
        }
      }
    } catch (error) {
      console.error('Error processing item:', item, error);
    }
  }

  console.log(`Total count for statuses [${statuses.join(', ')}]:`, count);
  return count;
};
  
  const countOverdueII = (dataArray: Structure[]) => {
  if (!dataArray || !Array.isArray(dataArray)) {
    console.log('Invalid data array');
    return 0;
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Убираем время для сравнения только дат
  let overdueCount = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const item = dataArray[i];
    console.log(item);
    
    try {
      // Проверяем объект и его поля
      if (!item || typeof item !== 'object') {
        console.log('Invalid item at index', i, item);
        continue;
      }

      // Проверяем отсутствие даты исполнения (iifactDate)
      const hasNoIIFactDate = 
        item.iifactDate === undefined || 
        item.iifactDate === null || 
        String(item.iifactDate).trim() === '' || 
        String(item.iifactDate).trim().toLowerCase() === 'null';

      // Проверяем наличие плановой даты (iiplanDate)
      if (
        item.iiplanDate === undefined || 
        item.iiplanDate === null || 
        String(item.iiplanDate).trim() === '' || 
        String(item.iiplanDate).trim().toLowerCase() === 'null'
      ) {
        continue;
      }

      // Нормализуем и парсим дату
      const dateStr = String(item.iiplanDate).trim();
      console.log(`Processing item ${i}, date:`, dateStr);

      // Проверяем формат DD.MM.YYYY
      if (!/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateStr)) {
        console.log(`Invalid date format at index ${i}:`, dateStr);
        continue;
      }

      const dateParts = dateStr.split('.');
      console.log(`Item ${i} date parts:`, dateParts);

      if (dateParts.length !== 3) {
        console.log(`Unexpected date parts length at index ${i}:`, dateParts);
        continue;
      }

      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Месяцы 0-11 в JS
      const year = parseInt(dateParts[2], 10);

      // Проверяем валидность числовых значений
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        console.log(`Invalid date components at index ${i}:`, {day, month, year});
        continue;
      }

      // Проверяем логическую корректность даты
      if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900) {
        console.log(`Illogical date at index ${i}:`, {day, month: month + 1, year});
        continue;
      }

      const iiplanDateObj = new Date(year, month, day);
      iiplanDateObj.setHours(0, 0, 0, 0);

      // Проверяем, что дата прошла и нет даты исполнения
      if (hasNoIIFactDate && iiplanDateObj < currentDate) {
        console.log(`Found overdue II at index ${i}:`, item);
        overdueCount++;
      }
    } catch (error) {
      console.error(`Error processing item at index ${i}:`, item, error);
    }
  }

  console.log('Total overdue II count:', overdueCount);
  return overdueCount;
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

    <ScrollView >
      <View style={styles.container}>

        <PiechartSmall title='Принято в ПНР' submitted={submitPNR} totalQuantity={data.systemsPNRTotalQuantity===''? 0 : data.systemsPNRTotalQuantity} blueQuantity={data.systemsPNRQuantityAccepted} greenQuantity={data.systemsPNRDynamic} redQuantity={data.systemsLag}/>
    
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

          <View style={{width: '49.5%'}}>
            <PiechartBig title={'Акты ИИ'} submitted={submitII} totalQuantity={data.actsIITotalQuantity===''? 0 :data.actsIITotalQuantity} blueQuantity={data.actsIISignedQuantity} greenQuantity={data.actsIIDynamic} redQuantity={data.actsIILag}/>
          </View>
          
          <View style={{width: '49.5%'}}>
            <PiechartBig title={'Акты КО'} submitted={submitKO} totalQuantity={data.actsKOTotalQuantity===''? 0 :data.actsIITotalQuantity} blueQuantity={data.actsKOSignedQuantity} greenQuantity={data.actsKODynamic} redQuantity={data.actsKOLag}/>
          </View>

        </View>

        <Barchart totalQuantity={data.commentsTotalQuantity} blueQuantity={data.commentsTotalQuantity-data.commentsNotResolvedQuantity} greenQuantity={data.commentsDynamic} redQuantity={data.commentsLag} submitted={0} title="Замечания к СМР"/>
        <View style={{paddingTop: 11}}>
        <Barchart totalQuantity={0} blueQuantity={0} greenQuantity={0} redQuantity={0} submitted={0} title="Дефекты оборудования"/>
       </View>
       <Linechart/>

      </View>
    </ScrollView>
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
