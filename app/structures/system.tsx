import { StyleSheet, Text, View, ScrollView, TextInput, useWindowDimensions, Alert  } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { } from '@/components/Themed';
import { Dropdown } from 'react-native-element-dropdown';
import DateInputWithPicker from '@/components/Calendar+';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { router, useGlobalSearchParams, useLocalSearchParams, useNavigation } from 'expo-router';
import DropdownComponent from '@/components/ListStatusSystem';
import React, {useEffect, useState} from 'react';


export type SystemPUT = {
  pnrsystemStatus: string;
  ciwexecutor: string;//исполнитель СМР
  cwexecutor: string;//исполнитель ПНР
  pnrplanDate: string; 
  pnrfactDate: string;
  iiplanDate: string;
  iifactDate: string;
  koplanDate: string;
  kofactDate: string;
};

export type SystemGET = {
  numberII: string;
  systemName: string;
  comments: number;
  status: string;
  PNRPlanDate: string; 
  PNRFactDate: string;
  pnrsystemId: number;
  KOFactDate: string;
  CIWExecutor: string;//исполнитель СМР
  IIFactDate: string;
  KOPlanDate: string;
  IIPlanDate: string;
  CWExecutor: string;//исполнитель ПНР
}

export default function TabOneScreen() {
  const {post} = useLocalSearchParams();//получение id замечания
 // const post = 256;
  console.log(post);
  const {codeCCS} = useLocalSearchParams();//получение id объекта
 // console.log(codeCCS, 'ID system');

  const [click, setclick] = useState<boolean>(false);
  const [data, setData] = useState<SystemPUT | undefined>(undefined);
  const [systemStat, setSystemStat] = useState<string>('');
  const [ciwexecut, setCiwexecut] = useState<string>('');
  const [cwexecut, setCwexecut] = useState<string>('');
  const [pnrplan, setPnrplan] = useState<string | null>('');
  const [pnrfact, setPnrfact] = useState<string | null>('');
  const [iiplan, setIiplan] = useState<string | null>('');
  const [iifact, setIifact] = useState<string | null>('');
  const [koplan, setKoplan] = useState<string | null>('');
  const [kofact, setKofact] = useState<string | null>('');
  const [comment, setComments] = useState<string>('');
  const [statusRequest, setstatusRequest] = useState<boolean>(false);//ограничение на передачу дат пока запрос не выполнен

  const putSystem = async () => {
    

    try {
    const js = JSON.stringify({ 
      pnrsystemStatus: systemStat,
      ciwexecutor: ciwexecut,
      cwexecutor: cwexecut,
      pnrplanDate: pnrplan,
      pnrfactDate: pnrfact,
      iiplanDate: iiplan,
      iifactDate: iifact,
      koplanDate: koplan,
      kofactDate: kofact,
    });
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/systems/updateSystemInfo/'+post, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: js
      }
      );
        console.log(js);
      if (response.ok) {
        Alert.alert('', 'Данные по системе обновлены', [
             {text: 'OK', onPress: () => console.log('OK Pressed')}])
      } else {
        throw new Error('Не удалось сохранить данные.');
      }
      console.log('ResponseUpdateSystem:', response);
    } catch (error) {
      console.error(error);
    } finally {
      router.push('/(tabs)/structure');
    }
  };

  const getSystem = async () => {
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/getSystemCommonInfo/'+post);
      const json = await response.json();
      setSystemStat(json.status);
      setCiwexecut(json.ciwexecutor);
      setCwexecut(json.cwexecutor);
      setPnrplan(json.pnrplanDate);
      setPnrfact(json.pnrfactDate);
      setIiplan(json.iiplanDate);
      setIifact(json.iifactDate);
      setKoplan(json.koplanDate);
      setKofact(json.kofactDate);
      setComments(''+json.comments.toString());
      console.log('ResponseSeeSystem:', response)
      setstatusRequest(true);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      setstatusRequest(false);
    } finally {
     // setLoading(false);
    }
  };

  useEffect(() => {
    if (post) {
      //putSystem();
      getSystem();//вызов функции при получении значения post
    }
  }, [post]);

  useEffect(() => {
    if (click) {
      putSystem();
     
    }
  }, []);

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>

      <View style={styles.separator}/>
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8  }}>Статус системы</Text>
      <DropdownComponent post = {systemStat} statusreq={statusRequest} pnrPlan={pnrplan} pnrFact={pnrfact} iiPlan={iiplan} iiFact={iifact} koPlan={koplan} koFact={kofact} onChange={(status) => setSystemStat(status)}/>

<View style={{flexDirection: 'row',width: '100%',}}>{/* Объявление заголовков в строку для дат плана и факта передачи в ПНР */}
      <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>План в ПНР</Text>
       </View>

       <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Факт в ПНР</Text>
       </View>
</View>

<View style={{flexDirection: 'row',}}>
<DateInputWithPicker theme = 'min' post={pnrplan} statusreq={statusRequest} onChange={(dateString) => setPnrplan(dateString)}/>{/* Дата плана передачи в ПНР*/}
<DateInputWithPicker theme = 'min'post={pnrfact} statusreq={statusRequest} onChange={(dateString) => setPnrfact(dateString)}/>{/* Дата факта передачи в ПНР*/}
</View>

<View style={{flexDirection: 'row',width: '100%',}}>{/* Объявление заголовков в строку для дат плана и факта ИИ */}
      <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>План ИИ</Text>
       </View>

       <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Факт ИИ</Text>
       </View>
</View>

<View style={{flexDirection: 'row',}}>
<DateInputWithPicker theme = 'min' post = {iiplan} statusreq={statusRequest} onChange={(dateString) => setIiplan(dateString)}/>{/* Дата плана ИИ*/}
<DateInputWithPicker theme = 'min' post = {iifact} statusreq={statusRequest} onChange={(dateString) => setIifact(dateString)}/>{/* Дата факта ИИ*/}
</View>

<View style={{flexDirection: 'row',width: '100%',}}>{/* Объявление заголовков в строку для дат плана и факта передачи КО */}
      <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>План КО</Text>
       </View>

       <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Факт КО</Text>
       </View>
</View>

<View style={{flexDirection: 'row',}}>
<DateInputWithPicker theme = 'min' post = {koplan} statusreq={statusRequest} onChange={(dateString) => setKoplan(dateString)}/>{/* Дата плана КО*/}
<DateInputWithPicker theme = 'min' post = {kofact} statusreq={statusRequest} onChange={(dateString) => setKofact(dateString)}/>{/* Дата факта КО*/}
</View>



      <View style={{ alignSelf: 'center',  flexDirection: 'row', width: '96%', paddingTop: 6,  marginBottom: 8}}>
          
                      <View style={{width: '50%', marginStart: 2}}>
                      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Не устранено замечаний</Text>
                      <TextInput
                        style={styles.input}
                        placeholderTextColor="#111"
                        //onChangeText={setComments}
                        value={comment}
                        editable={false}
                        />
                        
                      </View>

                      <View style={{width: '50%', marginStart: 2}}>
                      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Не устранено дефектов</Text>
                      <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                />
                      
                      </View>
      </View>
      

       <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель СМР</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                  onChangeText={setCiwexecut}
                  value={ciwexecut}
                />

      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель ПНР</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                  onChangeText={setCwexecut}
                  value={cwexecut}
                />
 
      <CustomButton title='Подтвердить'  handlePress={() => putSystem() }/>
      <CustomButton title='Отменить'  handlePress={() => router.push('/(tabs)/structure')} />
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

    height: 1,
    width: '80%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    width: '96%',
    height: 42,
    paddingVertical: 'auto',
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 20,
  },
});
