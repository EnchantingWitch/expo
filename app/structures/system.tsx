import { StyleSheet, Text, View, ScrollView, TextInput, useWindowDimensions  } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { } from '@/components/Themed';
import { Dropdown } from 'react-native-element-dropdown';
import DateInputWithPicker from '@/components/calendar';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import DropdownComponent from '@/components/list_system';
import React, {useEffect, useState} from 'react';

export type SystemPUT = {
  //numberII: number;
  //systemName: string;
 // comments: number;
  //status: string;
  //statusList: [];
  //ccsnumber: string;

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

export default function TabOneScreen() {
  const {post} = useLocalSearchParams();//получение id замечания
  //const post = 255;
  console.log(post);

  const [data, setData] = useState<SystemPUT[]>([]);

  const [systemStat, setSystemStat] = useState<string>('');
  const [ciwexecut, setCiwexecut] = useState<string>('');
  const [cwexecut, setCwexecut] = useState<string>('');
  const [pnrplan, setPnrplan] = useState<string>('');
  const [pnrfact, setPnrfact] = useState<string>('');
  const [iiplan, setIiplan] = useState<string>('');
  const [iifact, setIifact] = useState<string>('');
  const [koplan, setKoplan] = useState<string>('');
  const [kofact, setKofact] = useState<string>('');

  const handleEditClick = () => {
 // setSystemStat(data?.pnrsystemStatus || '');
 // setCiwexecut
 // setCwexecut
  //setPnrplan
 // setPnrfact
  //setIiplan
 // setIifact
 // setKoplan
  //setKofact
}

  const putSystem = async () => {
    try {
      
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/systems/updateSystemInfo/'+post, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pnrsystemStatus: systemStat,
          ciwexecutor: ciwexecut,
          cwexecutor: cwexecut,
          pnrplanDate: pnrplan,
          pnrfactDate: pnrfact,
          iiplanDate: iiplan,
          iifactDate: iifact,
          koplanDate: koplan,
          kofactDate: kofact,
        })
      }

      );
      const json = await response.json();
      //setData(json.);
      setSystemStat(json.pnrsystemStatus);
      setCiwexecut(json.ciwexecutor);
      setCwexecut(json.cwexecutor);
      setPnrplan(json.pnrplanDate);
      setPnrfact(json.pnrfactDate);
      setIiplan(json.iiplanDate);
      setIifact(json.iifactDate);
      setKoplan(json.koplanDate);
      setKofact(json.kofactDate);
      console.log('ResponseSeeSystem:', response);
    } catch (error) {
      console.error(error);
    } finally {
     // setLoading(false);
    }
  };
// else{
        //  Alert.alert('Ошибка при создании замечания', 'Для создания замечания должны быть заполнены следующие поля: номер АИИ, объект, система, содержание замечания, исполнитель и категория замечания.', [
        //   {text: 'OK', onPress: () => console.log('OK Pressed')},
        //])
        // }

  useEffect(() => {
    if (post) {
      putSystem();//вызов функции при получении значения post
    }
  }, [post]);

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>

      <View style={styles.separator}/>
      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8  }}>Статус системы</Text>
      <DropdownComponent />

<View style={{flexDirection: 'row',width: '100%',}}>{/* Объявление заголовков в строку для дат плана и факта передачи в ПНР */}
      <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>План в ПНР</Text>
       </View>

       <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Факт в ПНР</Text>
       </View>
</View>

<View style={{flexDirection: 'row',}}>
<DateInputWithPicker theme = 'min'/>{/* Дата плана передачи в ПНР*/}
<DateInputWithPicker theme = 'min'/>{/* Дата факта передачи в ПНР*/}
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
<DateInputWithPicker theme = 'min'/>{/* Дата плана ИИ*/}
<DateInputWithPicker theme = 'min'/>{/* Дата факта ИИ*/}
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
<DateInputWithPicker theme = 'min'/>{/* Дата плана КО*/}
<DateInputWithPicker theme = 'min'/>{/* Дата факта КО*/}
</View>



      <View style={{ alignSelf: 'center',  flexDirection: 'row', width: '96%', paddingTop: 6,  marginBottom: 8}}>
          
                      <View style={{width: '50%', marginStart: 2}}>
                      <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Не устранено замечаний</Text>
                      <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                  
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
 
      <CustomButton title='Подтвердить'  handlePress={() => {[putSystem, {/*router.push('/(tabs)/structure')*/}]}} />
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
