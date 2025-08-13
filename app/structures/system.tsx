import DateInputWithPicker from '@/components/Calendar+';
import CustomButton from '@/components/CustomButton';
import ListOfOrganizations from '@/components/ListOfOrganizations';
import DropdownComponent from '@/components/ListStatusSystem';
import { } from '@/components/Themed';
import useDevice from '@/hooks/useDevice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

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
  const { isMobile, isDesktopWeb, isMobileWeb, screenWidth } = useDevice();
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const router = useRouter();
  const {post} = useLocalSearchParams();//получение id системы
 // const post = 256;
  console.log(post);
  const {codeCCS} = useLocalSearchParams();//получение id объекта
  const {capitalCSName} = useLocalSearchParams();
  console.log(capitalCSName, 'capitalCSName system');

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
  const [defect, setDefect] = useState<string>('');
  const [system, setSystem] = useState<string>('');//наименование системы
  const [rd, setRd] = useState<string>('');//наименование системы
  const [statusRequest, setstatusRequest] = useState<boolean>(false);//ограничение на передачу дат пока запрос не выполнен
  const [conditionKO, setConditionKO] = useState<boolean>(false);//выбрана дата факта или нет
  const [conditionII, setConditionII] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false); //для кнопки

  const [accessToken, setAccessToken] = useState<any>('');
  const [listOrganization, setListOrganization] = useState<[]>();



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

  const putSystem = async () => {
    setDisabled(true);
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
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json' },
        body: js
      }
      );
        console.log(js);
      if (response.ok) {
        Alert.alert('', 'Данные по системе обновлены', [
             {text: 'OK', onPress: () => console.log('OK Pressed')}])
      } 
      //else {
      //  throw new Error('Не удалось сохранить данные.');
      //}
      console.log('ResponseUpdateSystem:', response);
    } catch (error) {
      console.error(error);
      setDisabled(false);
            Alert.alert('', 'Произошла ошибка при обновлении данных: ' + error, [
                   {text: 'OK', onPress: () => console.log('OK Pressed')},
                ])
    } finally {
      setDisabled(false);
      router.replace({pathname: '/(tabs)/structure', params: { codeCCS: codeCCS, capitalCSName: capitalCSName}})
      //router.push('/(tabs)/structure');

    }
  };

  const getSystem = async () => {
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/getSystemCommonInfo/'+post,
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }}
      );
      const json = await response.json();
      setSystem(json.systemName);
      setSystemStat(json.status);
      setCiwexecut(json.ciwexecutor);
      setCwexecut(json.cwexecutor);
      setPnrplan(json.pnrplanDate);
      setPnrfact(json.pnrfactDate);
      setIiplan(json.iiplanDate);
      setIifact(json.iifactDate);
      setKoplan(json.koplanDate);
      setKofact(json.kofactDate);
      setRd(json.systemRD);
      setComments(''+json.comments.toString());
      setDefect(''+json.defectiveActs.toString());
      
      console.log(json.systemName, 'json.systemName');
      console.log('ResponseSeeSystem:', response);
      console.log('ResponseSeeSystem json:', json);
      setstatusRequest(true);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      setstatusRequest(false);
    } finally {
      router.setParams({systemName: system});
      console.log(system, 'sytemN in system.tsx');

     // setLoading(false);
    }
  };

  useEffect(() => {
    getToken();
   
  }, []);

    useEffect(() => {
    if (post && accessToken) {
      //putSystem();
      getSystem();//вызов функции при получении значения post
      //router.setParams({systemName: systemN});
      //console.log(systemN, 'systemN in system.tsx');
      getOrganisations();
    }
    if (statusRequest){
      router.setParams({systemName: system});
      console.log(system, 'sytemN in system.tsx');
    }
   
  }, [accessToken, post, statusRequest]);

  const [statusOrg, setStatusOrg] = useState(false);

  const getOrganisations = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/organisations/getAll',
        {method: 'GET',
          headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      console.log('responseGetOrganisations', response);
      const json = await response.json();
      const transformedData = json.map(item => ({
            label: item.organisationName,
            value: item.organisationName,
        }));
        setListOrganization(transformedData);
      console.log(json);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    if (click) {
      putSystem();    
    }
  }, []);

   useEffect(() => {
    if (listOrganization) {
      setStatusOrg(true);    
    }
  }, [listOrganization]);

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  return (
  <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
  <View style={[styles.container, {alignItems: 'center', justifyContent: 'center',alignSelf: 'center'}]}>
    <View style={{ flex: 1, alignItems: 'center', width: isDesktopWeb? '138%' :'100%'}}>
      <View style={[styles.separator,{}]}/>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8  }}>Статус системы</Text>
        <DropdownComponent post = {systemStat} statusreq={statusRequest} pnrPlan={pnrplan} pnrFact={pnrfact} iiPlan={iiplan} iiFact={iifact} koPlan={koplan} koFact={kofact} onChange={(status) => setSystemStat(status)}/>

        <View style={{flexDirection: 'row',width: isDesktopWeb ? '100%' : '96%',}}>{/* Объявление заголовков в строку для дат плана и факта передачи в ПНР */}
          <View style={{width: '50%', }}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>План в ПНР</Text>
          </View>

          <View style={{width: '50%', }}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Факт в ПНР</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', width: '100%'}}>
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

        <View style={{flexDirection: 'row',width: '100%',}}>
          <DateInputWithPicker theme = 'min' post = {iiplan} statusreq={statusRequest} onChange={(dateString) => setIiplan(dateString)}/>{/* Дата плана ИИ*/}
          <DateInputWithPicker theme = 'min' post = {iifact} statusreq={statusRequest} diseditable = {conditionII} onChange={(dateString) => setIifact(dateString)}/>{/* Дата факта ИИ*/}
        </View>

        <View style={{flexDirection: 'row',width: '100%',}}>{/* Объявление заголовков в строку для дат плана и факта передачи КО */}
          <View style={{width: '50%', }}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>План КО</Text>
          </View>

          <View style={{width: '50%', }}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Факт КО</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', width: '100%',}}>
    
          <DateInputWithPicker theme = 'min' post = {koplan} statusreq={statusRequest} onChange={(dateString) => setKoplan(dateString)}/>{/* Дата плана КО*/}
          <DateInputWithPicker theme = 'min' post = {kofact} statusreq={statusRequest} diseditable = {conditionKO} onChange={(dateString) => setKofact(dateString)}/>{/* Дата факта КО*/}
        </View>

          <View style={{ alignSelf: 'center',  flexDirection: 'row', width: '96%', }}>
          
            <View style={{width: '50.5%'}}>
              <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Не устранено замечаний</Text>
              <TextInput
                style={[styles.input, {fontSize: ts(14)}]}
                placeholderTextColor="#111"
                value={comment}
                editable={false}
              />
                          
            </View>
            <View style={{width: '50.5%'}}>
              <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Не устранено дефектов</Text>
              <TextInput
                style={[styles.input, {fontSize: ts(14)}]}
                placeholderTextColor="#111"
                editable={false}
                value={defect}
              />        
            </View>
          </View>

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Шифр РД</Text>
          <TextInput
            style={[styles.input, {fontSize: ts(14)}]}
            placeholderTextColor="#111"
            value={rd}
            editable={false}
          />

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель СМР</Text>
          <ListOfOrganizations label='Исполнитель СМР' data={listOrganization} title={ciwexecut} post={ciwexecut} status={statusOrg} onChange={(value) => setCiwexecut(value)}/>
         
          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель ПНР</Text>
          <ListOfOrganizations label='Исполнитель ПНР' data={listOrganization} title={cwexecut} post={cwexecut} status={statusOrg} onChange={(value) => setCwexecut(value)}/>
               
          <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 20 }}>
            <CustomButton title='Подтвердить' disabled={disabled} handlePress={() => putSystem() }/>
            <CustomButton title='Отменить'  handlePress={() => router.push({pathname: '/(tabs)/structure', params: { codeCCS: codeCCS, capitalCSName: capitalCSName}})} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   // width: '50%',
    alignSelf: 'center',
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
