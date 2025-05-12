import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

type token = {
    accessToken: string;
    refreshToken: string;
    //role: string;
};

const LoginModal = () => {
    const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

    const router = useRouter();
   // const role = 'admin'

    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [organization, setOrganization] = useState('');
    const [roleOfuser, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [savedToken, setSavedToken] = useState(false);
    const [savedId, setSavedId] = useState(false);


    const [storageData, setStorageData] = useState([]);

    const fontScale = useWindowDimensions().fontScale;

    const ts = (fontSize: number) => {
        return (fontSize / fontScale)};

    const saveToken = async (tokenKey, token) => {
        try {
            await AsyncStorage.setItem(tokenKey, token);
            console.log('Token - ', tokenKey, '- saved successfully!');
        } catch (error) {
            console.error('Error saving token:', error);
        }
        finally{
            if (tokenKey === 'accessToken'){setSavedToken(true);}
            if (tokenKey === 'userID'){setSavedId(true);}
        }
        
    };


    const fetchAllData = async () => {
        try {
          // Получаем все ключи
          const keys = await AsyncStorage.getAllKeys();
          
          // Получаем все значения по ключам
          const values = await AsyncStorage.multiGet(keys);
          
          // Преобразуем массив пар ключ-значение в массив объектов
          const data = values.map(([key, value]) => {
            try {
              // Пытаемся распарсить JSON, если это возможно
              return { key, value: JSON.parse(value) };
            } catch (e) {
              // Если не JSON, возвращаем как есть
              return { key, value };
            }
          });
          
          setStorageData(data);
        } catch (error) {
          console.error('Ошибка при загрузке данных:', error);
        }
      };
  console.log(storageData);

    const handleLogin = async () => {
        try{
            let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/login', {
                 method: 'POST',
                 headers: {
                   'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({
                   username: name,
                   password: password
                 }),
               });
               console.log(JSON.stringify({
                username: name,
                password: password
              }));
               
               if (!response.ok){
                Alert.alert('Ошибка при авторизации', 'Проверьте корректность введенных почты и пароля.', [
                                {text: 'OK', onPress: () => console.log('OK Pressed')}])
               }
                console.log('ResponseSignIn:', response);
               const token = await response.json()
               console.log(token);
               console.log(token.accessToken);
               console.log(token.refreshToken);
              if (response.ok) {
                setAccessToken(token.accessToken);
                setRefreshToken(token.refreshToken); 
                saveToken('refreshToken', token.refreshToken);
                saveToken('accessToken', token.accessToken);
               }
              
            }catch (error) {
                console.error('Error:', error);
            }finally{  

            }

    };

    //функция для парсинга второй секции токена, чтобы вытащить роль пользователя
    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };


     useEffect(() => { 
    if(accessToken){  
        const role = parseJwt(accessToken);
        setRole(role.role);
        console.log(role.role);
        console.log(role);
        saveToken('userID', role.userId.toString());
    }
    if(savedToken && savedId){
        if (roleOfuser === 'ADMIN'){router.replace('/admin/menu')}
        if (roleOfuser === 'USER'){console.log('переход на домашнюю страницу'); router.replace('/objs/objects')}
    }

   // if(refreshToken){refreshTok();}
  }, [savedToken, accessToken, savedId]);

 
  

    return (
        <ScrollView style={{flex: 1,
            alignContent: 'center',
            
            backgroundColor: 'white',}}>
            <View style={{alignSelf: 'center', paddingTop: BOTTOM_SAFE_AREA +15  }}>
            <Text style={{ fontSize: ts(20), color: '#1E1E1E', fontWeight: '500',  textAlign: 'center' }}>Планшет ПНР</Text>
            <Image 
            style={{ width: 200, height: 200 }}
            source={require('../../assets/images/logo1.png')} 
            />
            </View>
            
        <View style={styles.modalContainer}>
           
                        
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Введите почту</Text>
            <TextInput
                style={[styles.input, {fontSize: ts(14)}]}
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Введите пароль</Text>
            <TextInput
                style={[styles.input, {fontSize: ts(14)}]}
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <CustomButton
                    title="Войти"
                    handlePress={handleLogin} />        
            )}
            <CustomButton
                    title="Зарегистрироваться"
                    handlePress={() => router.push('/sign/register')}/>

                    
        {/*}   <CustomButton
                    title="refreshToken по определенному"
                    handlePress={refreshTok} />
 
            {/*} <CustomButton
                title="Закрыть"
                handlePress={() => setIsVisible(false)} />
                
           <CustomButton
                title="Проверка передачи значения admin"
                handlePress={() => {router.push({pathname: '/', params: {roleReq: 'admin' }})}} />
            <CustomButton
                title="Проверка передачи значения client"
                handlePress={() => {router.push({pathname: '/', params: {roleReq: 'client' }})}} />*/}

        </View>
        <View style={{alignSelf: 'center', width: '60%', paddingBottom: BOTTOM_SAFE_AREA + 20, }}>
            <Text style={{ fontSize: ts(12), color: '#0072C8', fontWeight: '400', textAlign: 'center' }}>Версия 1.01 07.05.2025</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    image: {
        width: 142,
        height: 71,
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
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
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default LoginModal;