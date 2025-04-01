import React, { useEffect, useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { router, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type token = {
    accessToken: string;
    refreshToken: string;
    //role: string;
};

const LoginModal = () => {
    const router = useRouter();
   // const role = 'admin'

    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [organization, setOrganization] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');

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
    };

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
                console.log('ResponseSignIn:', response);
               const token = await response.json()
               console.log(token);
               console.log(token.accessToken);
               console.log(token.refreshToken);
              
               if (response.status === 200) {
                 setAccessToken(token.accessToken);
               setRefreshToken(token.refreshToken);
                    saveToken('accessToken', token.accessToken);
                    saveToken('refreshToken', token.refreshToken);
                  
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
        console.log(role.role);
        console.log(role);
        saveToken('userID', role.userId.toString());
        if (role.role === 'ADMIN'){router.replace('/admin/menu')}
        if (role.role === 'USER'){router.replace('/objs/objects')}
    }
  }, [accessToken]);

    return (

        <View style={styles.modalContainer}>
            
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Введите логин</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Введите пароль</Text>
            <TextInput
                style={styles.input}
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

                    
          {/*}  <CustomButton
                    title="getToken"
                    handlePress={getToken} />*/}

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