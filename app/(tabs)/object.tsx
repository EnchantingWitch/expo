import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import {  } from '@/components/Themed';
import { Link, Tabs, Redirect, router } from 'expo-router';
import FormForObj from '@/components/FormForObj';

export default function TabOneScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>
      <FormForObj title='Принято в ПНР' handlePress={() => router.push('./structure')} text1='Всего' text2='Подписано' text3='Динамика' number1={0} number2={0} number3={0}></FormForObj>
      <FormForObj title='Акты ИИ' handlePress={() => router.push('./structure')} text1='Всего' text2='Подписано' text3='Динамика' number1={0} number2={0} number3={0}></FormForObj>
      <FormForObj title='Акты КО' handlePress={() => router.push('./structure')} text1='Всего' text2='Подписано' text3='Динамика' number1={0} number2={0} number3={0}></FormForObj>
      <FormForObj title='Замечания' text1='Всего' text2='Не устранено'  number1={0} number2={0} ></FormForObj>
      <FormForObj title='Дефекты оборудования' text1='Всего' text2='Не устранено'  number1={0} number2={0}></FormForObj>
      <FormForObj title='Персонал' text1='Всего' text2='Динамика' number1={0} number2={0} ></FormForObj>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '96%',

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
