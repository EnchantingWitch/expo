import { StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Dropdown } from 'react-native-element-dropdown';
import DateInputWithPicker from '@/components/calendar';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <FormField value ="Статус системы"/>
      <FormField theme ="date" value="План передачи в ПНР"/>
      <DateInputWithPicker/>
      <FormField theme ="date" value="Факт передачи в ПНР"/>
      <DateInputWithPicker/>
      <FormField theme ="date" value="План ИИ"/>
      <DateInputWithPicker/>
      <FormField theme ="date" value="Факт ИИ"/>
      <DateInputWithPicker/>
      <FormField theme ="date" value="План КО"/>
      <DateInputWithPicker/>
      <FormField theme ="date" value="Факт КО"/>
      <DateInputWithPicker/>
      <FormField theme = "min" value ="Не устранено замечаний"/>
      <FormField theme = "min" value ="Не устранено дефектов"/>
      <FormField value ="Исполнитель СМР"/>
      <FormField value ="Исполнитель ПНР"/>
      <CustomButton title='Подтвердить'  handlePress={() => router.push('./(tabs)/structure.tsx')} />
      <CustomButton title='Отменить'  handlePress={() => router.push('./(tabs)/structure.tsx')} />
    </View>
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
