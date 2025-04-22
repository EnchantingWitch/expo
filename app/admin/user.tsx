import { StyleSheet, Text, View, ScrollView, Alert, TextInput, useWindowDimensions, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListOfAccessRole from '@/components/ListOfAccessRole';

export default function TabOneScreen() {
   const fontScale = useWindowDimensions().fontScale;
  const ts = (fontSize: number) => {
    return (fontSize / fontScale);
  };

  const [Role, setRole] = useState('');
  const [statusRole, setStatusRole] = useState(false);
  const [startAdminRole, setStartAdminRole] = useState(false);

   const {username} = useLocalSearchParams();
   const {organisation} = useLocalSearchParams();
  const {numberPhone} = useLocalSearchParams();
  const {fullName} = useLocalSearchParams();
  const {role} = useLocalSearchParams();
  const {id} = useLocalSearchParams();
  const [accessToken, setAccessToken] = useState<any>('');

  console.log(Role, 'Role');

  const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token !== null) {
            console.log('Retrieved token:', token);
            setAccessToken(token);
        } else {
            console.log('No token found');
            router.push('/sign/sign_in');
        }
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
};

const saveClick = () => {
  if (Role === 'Без доступа'){router.push('/admin/users');}//прописать метод
  if (Role === 'Не указано'){router.push('/admin/users');}
  if (Role === 'Пользователь'){setUser('Пользователь');}
  if (Role === 'Администратор'){setUser('Администратор');}
}

  const deleteUser = async () => {
    try {
      console.log('json',JSON.stringify({
        username : username,
      }));
      const body = new FormData();
      //data.append('name', 'Image Upload');
      body.append("id", id);
      console.log('body', body);
    let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/admin/delete_user', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
       'Content-Type': 'multipart/form-data'
      },
      body: body,
    });
    console.log('ResponseDeleteUser:', response);
  if (response.status == 200){
      Alert.alert('', 'Пользователь удален.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
    } 
  } catch (error) {
    console.error('Error:', error);
  } finally {
    router.push('/admin/users');
  }};

  const setAdmin = async () => {
    try {
      console.log('json',JSON.stringify({
        username : username,
      }));
      const body = new FormData();
      //data.append('name', 'Image Upload');
      body.append("id", id);
      body.append("role", Role);
      console.log('body', body);
    let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/admin/set_user_role', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
       'Content-Type': 'multipart/form-data'
      }, 
      body: body,
    });
    console.log('ResponseroleOfAdmin:', response);
   if (response.status == 200){
    if (Role === 'USER'){
      Alert.alert('', 'Пользователю предоставлен доступ.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
    }
    if (Role === 'ADMIN'){
      Alert.alert('', 'Пользователю дана роль администратора.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
    }
    if (Role === 'NONE'){
      Alert.alert('', 'Пользователю запрещен доступ.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')}])
    }
  
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    router.push('/admin/users');
  }

};

//const setUser = async (role: string) => {
  const setUser = async () => {
  try {
    console.log('json',JSON.stringify({
      username : username,
    }));
    const body = new FormData();
    //data.append('name', 'Image Upload');
    body.append("id", id);
    body.append("role", Role);
   /* if (Role === 'Без доступа'){
      body.append("role", 'NONE');
    }
    if (Role === 'Пользователь'){
      body.append("role", 'USER');
    }
    if (Role === 'Администратор'){
      body.append("role", 'ADMIN');
    }*/
    console.log('body', body);
  let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/admin/acceptUser', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
     'Content-Type': 'multipart/form-data'
    }, 
    body: body,
  });
  console.log('ResponseroleOfUser:', response);
 if (response.status == 200){
  if (Role === 'USER'){
    Alert.alert('', 'Пользователю предоставлен доступ.', [
      {text: 'OK', onPress: () => console.log('OK Pressed')}])
  }
  if (Role === 'ADMIN'){
    Alert.alert('', 'Пользователю дана роль администратора.', [
      {text: 'OK', onPress: () => console.log('OK Pressed')}])
  }
  if (Role === 'NONE'){
    Alert.alert('', 'Пользователю запрещен доступ.', [
      {text: 'OK', onPress: () => console.log('OK Pressed')}])
  }

    //if (role === 'Администратор'){setStartAdminRole(true);}
  }
} catch (error) {
  console.error('Error:', error);
} finally {
 // if (role === 'Пользователь') {
 
    router.push('/admin/users');
 // }
}

};
console.log(Role);


 useEffect(() => {
    getToken();
    setRole(role);
    if (startAdminRole){setAdmin();}
  }, [role, startAdminRole]);

  useEffect(() => {
    setStatusRole(true);
  }, [Role]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>
     
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>ФИО</Text>
      <TextInput
      style={{width: '96%',fontSize: ts(14),backgroundColor: '#FFFFFF',borderRadius: 8,borderWidth: 1,borderColor: '#D9D9D9',height: 42,color: '#B3B3B3',textAlign: 'center',marginBottom: 20,}}
      placeholderTextColor="#111"
      editable={false}
      value={fullName}
    />
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Организация</Text>
      <TextInput
      style={{width: '96%',fontSize: ts(14),backgroundColor: '#FFFFFF',borderRadius: 8,borderWidth: 1,borderColor: '#D9D9D9',height: 42,color: '#B3B3B3',textAlign: 'center',marginBottom: 20,}}
      placeholderTextColor="#111"
      editable={false}
      value={organisation}
    />
     <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Почта</Text>
      <TextInput
      style={{width: '96%',fontSize: ts(14),backgroundColor: '#FFFFFF',borderRadius: 8,borderWidth: 1,borderColor: '#D9D9D9',height: 42,color: '#B3B3B3',textAlign: 'center',marginBottom: 20,}}
      placeholderTextColor="#111"
      editable={false}
      value={username}
    />
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Роль</Text>
    <ListOfAccessRole 
                post={role as string} 
                status={statusRole} 
                onChange={(selectedRole) => setRole(selectedRole)}
            />
    <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Дата заявки</Text>
      <TextInput
      style={{width: '96%',fontSize: ts(14),backgroundColor: '#FFFFFF',borderRadius: 8,borderWidth: 1,borderColor: '#D9D9D9',height: 42,color: '#B3B3B3',textAlign: 'center',marginBottom: 20,}}
      placeholderTextColor="#111"
      editable={false}
      value='Дата заявки'
    />
        
    </View>
    
      <CustomButton title='Удалить пользователя' handlePress={deleteUser}/>
      <CustomButton title='Сохранить' handlePress={setAdmin}/>
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
