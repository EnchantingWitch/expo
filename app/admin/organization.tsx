import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';

export default function TabOneScreen() {
   const fontScale = useWindowDimensions().fontScale;
  const ts = (fontSize: number) => {
    return (fontSize / fontScale);
  };
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const [org, setOrg] = useState('');

  const {organisation} = useLocalSearchParams();
  const {id} = useLocalSearchParams();
  const [accessToken, setAccessToken] = useState<any>('');
console.log('id', id)
  useEffect(() => {
    if(organisation){setOrg(organisation);}
  }, [organisation]);

  const getToken = async (key, setState) => {
    try {
        const token = await AsyncStorage.getItem(key);
        if (token !== null) {
            console.log('Retrieved token:', token);
            setState(token);
        } else {
            console.log('No token found');
            router.push('/sign/sign_in');
        }
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
};

  const deleteOrg = async () => {
    try {
     /* const body = new FormData();
      //data.append('name', 'Image Upload');
      body.append("id", id);
      console.log('body', body);*/
    let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/organisations/delete/'+id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
       'Content-Type': 'application/json'
      },
    });
    console.log('ResponseDeleteOrg:', response);
  if (response.status == 200){
      Alert.alert('', 'Организация удалена.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
    } 
  } catch (error) {
    console.error('Error:', error);
  } finally {
    router.push('/admin/organizations');
  }};

  console.log(JSON.stringify({
        organisationInfo: org,
        id: id
      }))

  const updateOrg = async () => {
    try {
    let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/organisations/update', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
       'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        organisationName: org,
        id: id
      }),
    });
    console.log('ResponseUpdateOrg:', response);
   if (response.status == 200){
      Alert.alert('', 'Организация обновлена.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    router.push('/admin/organizations');
    
  }

};

 useEffect(() => {
    getToken('accessToken', setAccessToken);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>
     
  {/*}  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Организация</Text>
    */}  <TextInput
      style={{width: '96%',fontSize: ts(14),backgroundColor: '#FFFFFF',borderRadius: 8,borderWidth: 1,borderColor: '#D9D9D9',height: 42,color: '#B3B3B3',textAlign: 'center',marginBottom: 20,}}
      placeholderTextColor="#111"
      value={org}
      onChangeText={setOrg}
    />
    
    </View>
      <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 20 }}>
        <CustomButton title='Сохранить' handlePress={updateOrg}/>
        <CustomButton title='Удалить' handlePress={deleteOrg}/>
      </View>
    </SafeAreaView>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',//alignItems: 'center',
    width: '100%',
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
