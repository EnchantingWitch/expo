import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
//import Pdf from 'react-native-pdf';

import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox/build/ExpoCheckbox';


type RegisterResponse = {
    success: boolean;
    message?: string;
};

const RegistrationModal = () => {
    const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [organization, setOrganization] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [isSelected, setSelection] = useState(false);

    const fontScale = useWindowDimensions().fontScale;
    const source = {
        uri: 'bundle-assets://file.pdf', // Используйте этот путь для файлов в папке assets
        cache: true,
    };

    const ts = (fontSize: number) => {
        return (fontSize / fontScale)};

console.log(JSON.stringify({
    email: email,
    password: password,
    fullName: name,
    organisation: organization
  }));

    const handleRegister = async () => {
        if (password !== confirmPassword) {
             Alert.alert('', 'Пароли не совпадают.', [
                         {text: 'OK', onPress: () => console.log('OK Pressed')}])
            return;
        }
        if (isSelected === false){
            Alert.alert('', 'Подтвердите согласие с политикой конфиденциальности и обработки персональных данных.', [
                {text: 'OK', onPress: () => console.log('OK Pressed')}])
            return;
        }
        if (email === ''  || password === '' || name === '' || organization === '' || email === ' '  || password === ' ' || name === ' ' || organization === ' '){
            Alert.alert('', 'Заполните все поля регистрации.', [
                {text: 'OK', onPress: () => console.log('OK Pressed')}])
            return;
        }
      try{
        let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/registration', {
             method: 'POST',
             headers: {
                Accept: 'application/json',
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               email: email,
               password: password,
               fullName: name,
               organisation: organization
             }),
           });
           console.log('ResponseRegistration:', response);
        /*   const id = await response.text()
           console.log(id);*/

           
           
           if(response.status === 200){
                Alert.alert('', 'Заявка на регистрацию оправлена. После подтверждения заявки администратором, Вы сможете авторизоваться.', [
                    {text: 'OK', onPress: () => console.log('OK Pressed')}])
                router.push('/sign/sign_in');
           }
           else{
            Alert.alert('', 'Произошла ошибка при регистрации', [
                {text: 'OK', onPress: () => console.log('OK Pressed')}])
            //router.push('/sign/sign_in');
       }
        }catch (error) {
            console.error('Error:', error);
          }
    };

     // Путь к вашему PDF-файлу

    {/*const openPDF = async () => {
        const sourcePath = '../assets/file.pdf'; // Путь к файлу в assets
        const destPath =RNFS.DocumentDirectoryPath + '/myfile.pdf'; // Путь, куда вы хотите скопировать файл
        
            const path = RNFS.MainBundlePath + '../assets/file.pdf'; // Путь к вашему PDF-файлу
    
            try {
                await FileViewer.open(path);
            } catch (error) {
                console.error('Error opening file:', error);
            }
        
      };*/}

    return (

        <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center',}}>
            <ScrollView >
            <View style={styles.modalContainer}>

            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>ФИО (полностью)</Text>
            <TextInput
                style={[styles.input, {fontSize: ts(14)}]}
                value={name}
                onChangeText={setName}
            />
           
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Email</Text>
            <TextInput
                style={[styles.input, {fontSize: ts(14)}]}
                value={email}
                onChangeText={setEmail}
            />
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Организация</Text>
            <TextInput
                style={[styles.input, {fontSize: ts(14)}]}
                value={organization}
                onChangeText={setOrganization}
            />
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Пароль</Text>
            <TextInput
                style={[styles.input, {fontSize: ts(14)}]}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Подтвердите пароль</Text>
            <TextInput
                style={[styles.input, {fontSize: ts(14)}]}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />  
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            </View>

    </ScrollView>
            <View style={{flexDirection: 'row', width: '100%', alignContent: 'center', paddingBottom: '2%'}}>
                <View style={{ width: '10%',  alignSelf: 'center'}}>
                <Checkbox
                                value={isSelected}
                                onValueChange={setSelection}
                                color={isSelected ? '#0072C8' : undefined}
                                style={{alignSelf: 'center'}}
                            /></View>
                <TouchableOpacity onPress={() => setVisible(true)} style={{ width: '90%',  alignSelf: 'center'}}>
                    <Text style={{color: '#0072C8', fontSize: ts(14) }}>Соглашаюсь с {' '}
                        <Text style={{textDecorationLine: 'underline' }}>политикой конфиденциальности и обработки персональных данных</Text>
                    </Text>
                </TouchableOpacity>
             </View>   
             <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 20 }}>
                <CustomButton
                    title="Зарегистрироваться"
                    handlePress={handleRegister} /></View>

                    {visible? (
                        <Modal>
                            <TouchableOpacity onPress={() => setVisible(false)} style = {{alignSelf: 'flex-end', }}>
                          <Ionicons name='close-outline' size={30} />
                        </TouchableOpacity>
                    <View style={[styles.container, {width: '96%', alignItems: 'center'}]}>
                        
                        <Text style={{ fontSize: ts(14) }}>Соглашение с политикой конфиденциальности и обработки персональных данных</Text>
                {/*<Pdf
                source={source}
                style={styles.pdf}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`number of pages: ${numberOfPages}`);
                }}
                onError={(error) => {
                    console.error(error);
                }}
            />*/}
        </View>
                    </Modal>) : ''}
         
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pdf: {
        flex: 1,
        width: '90%',
        height: '98%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff'
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
        width: '100%',
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

export default RegistrationModal;