import { StyleSheet, ScrollView, View } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import {  router } from 'expo-router';

import CustomButton from '@/components/CustomButton';

export default function TabOneScreen() {
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
    <View style={styles.container}>
    


    <CustomButton title='Загрузить' handlePress={() => router.push('../structures/load_registry')}></CustomButton>
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
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
