import { StyleSheet,Text, View, ScrollView, TouchableOpacity   } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Link, Tabs, Redirect, router } from 'expo-router';
import { } from '@/components/Themed';
import { Dropdown } from 'react-native-element-dropdown';
import DateInputWithPicker from '@/components/calendar';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';

export default function TabOneScreen() {
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
    <View style={styles.container}>
        <FormField title='Выбрать документ'></FormField>
        <Text style={{color:'blue', fontSize: 14, textAlign: 'center'}}>Форма реестра</Text>

    
    
    </View>
      <View style={{flex: 1, justifyContent: 'space-between', top: '330%', flexDirection: 'row', width: '90%', alignSelf: 'center'}}>
        <TouchableOpacity style={{width: '40%', borderRadius: 8, backgroundColor: '#0072C8',  height: 40, paddingVertical: 8}}>
          <Text style={{fontSize: 16, fontWeight: '400', color: '#F5F5F5', textAlign: 'center',}}>Загрузить</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{width: '40%', borderRadius: 8, backgroundColor: '#DC2626',  height: 40, paddingVertical: 8}}>
          <Text style={{fontSize: 16, fontWeight: '400', color: '#F5F5F5', textAlign: 'center',}}>Отменить</Text>

        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
  //  alignItems: 'center',
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
