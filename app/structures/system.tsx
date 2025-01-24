import { StyleSheet, Text, View, ScrollView, TextInput, useWindowDimensions  } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { } from '@/components/Themed';
import { Dropdown } from 'react-native-element-dropdown';
import DateInputWithPicker from '@/components/calendar';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import DropdownComponent from '@/components/list_system';
import React from 'react';



export default function TabOneScreen() {

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

   /*  const submitData = async () => {
        //if(numberII!='' && subObject!='' && systemName!='' && description!='' && userName!='' && category!='')
        
          try {
            const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/uploadSystem', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                iiNumber: numberII,
                subObject: subObject,
                systemName: systemName,
                description: description,
                commentStatus: "Не устранено",
                userName: userName,
                //startDate: startDate,
                startDate: "10.01.2025",
                //commentCategory: category,
                commentCategory: "Влияет",
                commentExplanation: comExp,
                codeCCS: "051-2000973.0023",
              }),
            });
            id = await response.text();
            setId(id);
            // Обработка ответа, если необходимо
            //console.log(ID);
            //не выводится в консоль
            console.log('Response:', response);
          } catch (error) {
            console.error('Error:', error);
          } finally {
            setUpLoading(false);
            alert(id);
            router.push('/(tabs)/two');
          }
        };
        // else{
        //  Alert.alert('Ошибка при создании замечания', 'Для создания замечания должны быть заполнены следующие поля: номер АИИ, объект, система, содержание замечания, исполнитель и категория замечания.', [
        //   {text: 'OK', onPress: () => console.log('OK Pressed')},
        //])
        // }
      
*/

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>

      <View style={styles.separator}/>
      <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8  }}>Статус системы</Text>
      <DropdownComponent />

<View style={{flexDirection: 'row',width: '100%',}}>
      <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>План в ПНР</Text>
       </View>

       <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Факт в ПНР</Text>
       </View>
</View>

<View style={{flexDirection: 'row',}}>
<DateInputWithPicker theme = 'min'/>{/* Дата плана передачи в ПНР*/}
<DateInputWithPicker theme = 'min'/>{/* Дата факта передачи в ПНР*/}
</View>

<View style={{flexDirection: 'row',width: '100%',}}>
      <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>План ИИ</Text>
       </View>

       <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Факт ИИ</Text>
       </View>
</View>

<View style={{flexDirection: 'row',}}>
<DateInputWithPicker theme = 'min'/>{/* Дата плана ИИ*/}
<DateInputWithPicker theme = 'min'/>{/* Дата факта ИИ*/}
</View>

<View style={{flexDirection: 'row',width: '100%',}}>
      <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>План КО</Text>
       </View>

       <View style={{width: '50%', }}>
        <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Факт КО</Text>
       </View>
</View>

<View style={{flexDirection: 'row',}}>
<DateInputWithPicker theme = 'min'/>{/* Дата плана КО*/}
<DateInputWithPicker theme = 'min'/>{/* Дата факта КО*/}
</View>



      <View style={{ alignSelf: 'center',  flexDirection: 'row', width: '96%', paddingTop: 6,  marginBottom: 8}}>
          
                      <View style={{width: '50%', marginStart: 2}}>
                      <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Не устранено замечаний</Text>
                      <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                />
                      </View>

                      <View style={{width: '50%', marginStart: 2}}>
                      <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', textAlign: 'center', marginBottom: 8  }}>Не устранено дефектов</Text>
                      <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                />
                      
                      </View>
      </View>
      

       <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель СМР</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                />

      <Text style={{ fontSize: ts(16), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель ПНР</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#111"
                />
 
      <CustomButton title='Подтвердить'  handlePress={() => router.push('/(tabs)/structure')} />
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
