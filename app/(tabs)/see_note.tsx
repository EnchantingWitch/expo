import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, ScrollView } from 'react-native';
/*
export function StackScreen() {
  return (
      <Stack.Navigator>
          <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                  title: 'My home',
                  headerStyle: {
                      backgroundColor: '#f4511e',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                      fontWeight: 'bold',
                  },
              }}
          />
      </Stack.Navigator>
  );
}*/
/*
function LogoTitle() {
  return (
      <Image
          style={{ width: 50, height: 50 }}
          source={require('@expo/snack-static/react-native-logo.png')}
      />
  );
}
*/


export default function listOfNotes() {
  return (
    //<SafeAreaView>
    //<PreviewLayout>
      
   // </PreviewLayout>
   <ScrollView>
    <View style={styles.container}>
     
      <StatusBar style="auto" />
      <Text>№ замечания</Text>

      <Text>№ акта ИИ</Text>
      <TextInput
        placeholder="№.."
        keyboardType="numeric"
      />
      <Text>Объект</Text>
      <TextInput
        placeholder="Введите наименование оъекта"
      />
      <Text>Система</Text>
      <TextInput
        placeholder="Введите наименование системы"
      />
      <Text>Содержание замечания</Text>
      <TextInput
        placeholder="Введите замечание"
      //  keyboardType="text"
      />
      <Text>Фото</Text>
     <Text>Статус</Text>
      <TextInput
        placeholder="Введите наименование системы"
      />
      <Text>Исполнитель</Text>
      <TextInput
        placeholder="Введите наименование системы"
      />
      <Text>Дата выдачи</Text>
      <TextInput/>
      <Text>Плановая дата устранения</Text>
      <TextInput/>
      <Text>Категория замечания</Text>
      <TextInput/>
      <Button
    title="СОХРАНИТЬ"
  />
    </View>
    </ScrollView>
   //</SafeAreaView>
    
  );
}
/*<Button
        title="СОХРАНИТЬ"
        onPress={() => navigator.navigate('listOfNotes')}
      />*/

const AlignContentLayout = () => {
  const [alignContent, setAlignContent] = useState('flex-start');

  const stylHead = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8,
    paddingVertical: 8,
    flex: 1,
  //  rowGap: 30,
 //   flexDirection: 'column',
 //   justifyContent: 'flex-start',
    backgroundColor: '#708fff',
    alignItems: 'center',
   // alignContent: 'space-around',
    justifyContent: 'center',
   // minWidth: 120, 
   // flexWrap: 'wrap',
  },
}); }

const styles = StyleSheet.create({
  container: {
   //display: flattenDiagnosticMessageText,
  
     flex: 1,
    rowGap: 30,
    
    backgroundColor: '#fff',
    alignItems: 'center',
    alignContent: 'space-around',
    justifyContent: 'center',
    minWidth: 120, 
  },
});
