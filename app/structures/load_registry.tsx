import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Link, Tabs, Redirect, router } from 'expo-router';
import { } from '@/components/Themed';
import { Dropdown } from 'react-native-element-dropdown';
import DateInputWithPicker from '@/components/calendar';
import FormField from '@/components/FormField';
import RedCustomButton from '@/components/RedCustomButton';
import CustomButton from '@/components/CustomButton';

//localStorage для загрузки дока возможно нужен

export default function TabOneScreen() {


  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={styles.container}>
        <Text style={{ padding: 20 }}>Выбрать документ</Text>
        <input type='file' aria-label='Выбрать документ'/>
        <CustomButton title='Форма реестра' handlePress={() => router.push('../structures/structure_search')} />

      </View>

      <View style={{ padding: 20 }}>
        <RedCustomButton
          title='Отменить'
          handlePress={() => router.push('../(tabs)/structure'
          )} />
      </View>
      <View>
        <CustomButton
          title='Подтвердить'
          handlePress={() => router.push('/(tabs)/structure')}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
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
