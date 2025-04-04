import React, { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, SafeAreaView,  View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { setNativeProps } from 'react-native-reanimated';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { Alert } from 'react-native';
//import Pdf from 'react-native-pdf';
import Pdf from 'react-native-view-pdf';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox/build/ExpoCheckbox';


type RegisterResponse = {
    success: boolean;
    message?: string;
};

const RegistrationModal = () => {
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

console.log({method: 'POST',headers: {'Content-Type': 'application/json',},
    body: JSON.stringify({username: name,email: email,password: password}),});

    const handleRegister = async () => {
        if (password !== confirmPassword) {
             Alert.alert('', 'Пароли не совпадают', [
                         {text: 'OK', onPress: () => console.log('OK Pressed')}])
            return;
        }
        if (isSelected === false){
            Alert.alert('', 'Подтвердите согласие с политикой конфиденциальности и обработки персональных данных', [
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
               username: name,
               email: email,
               password: password
             }),
           });
           console.log('ResponseRegistration:', response);
        /*   const id = await response.text()
           console.log(id);*/

           
           
           if(response.status === 200){
                console.log('smth ok')
                router.push('/sign/sign_in');
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

            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Логин</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => setName(text)}
            />
           {/*} <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Организация</Text>
            <TextInput
                style={styles.input}
                value={organization}
                onChangeText={(text) => setOrganization(text)}
            />
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Телефон</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={(text) => setPhone(text)}
            />
            */}
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Пароль</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Подтвердите пароль</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
            />   </View>

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
                    <Text style={{color: '#0072C8', }}>Соглашаюсь с политикой конфиденциальности и обработки персональных данных</Text>
                    </TouchableOpacity>
             </View>   
                <CustomButton
                    title="Зарегистрироваться"
                    handlePress={handleRegister} />

                    {visible? (
                        <Modal>
                            <TouchableOpacity onPress={() => setVisible(false)} style = {{alignSelf: 'flex-end', }}>
                          <Ionicons name='close-outline' size={30} />
                        </TouchableOpacity>
                    <View style={styles.container}>
                        <ScrollView>
                        <Text>Соглашение с политикой конфиденциальности и обработки персональных данных</Text>
               </ScrollView> {/*<Pdf
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