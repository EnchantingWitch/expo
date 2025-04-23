import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button,   TouchableOpacity, ActivityIndicator, useWindowDimensions,} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import CustomButton from "@/components/CustomButton";
import { router, useNavigation } from "expo-router";
import FileViewer from "@/components/FileViewer";
import { isLoading } from "expo-font";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const UploadFile =  ()  => {
  export default function UploadFile (){
  const [singleFile, setSingleFile] = useState<any>('');
  const [load, setLoad]= useState<boolean>(false);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

    const navigation = useNavigation();
    
        useEffect(() => {
         
              navigation.setOptions({
                
                headerLeft: () => (
                  <TouchableOpacity onPress={getToken}>
                    <Ionicons name='exit-outline' size={25} style={{alignSelf: 'center'}}/>
                  </TouchableOpacity>
                ),
              });
              if(accessToken){handleLogout()}
        }, [navigation, accessToken]);
        useEffect(() => {
          getTok();
            
        }, []);

        const getToken = async () => {
          try {
              const token = await AsyncStorage.getItem('accessToken');
              if (token !== null) {
                setAccessToken(token);
                  console.log('Retrieved token:', token);
              } else {
                  console.log('No token found');
              }
          } catch (error) {
              console.error('Error retrieving token:', error);
          }
      };

      const getTok = async () => {
        try {
            const token = await AsyncStorage.getItem('refreshToken');
            if (token !== null) {
              setRefreshToken(token);
                console.log('Retrieved refresh token:', token);
            } else {
                console.log('No token found');
            }
        } catch (error) {
            console.error('Error retrieving token:', error);
        }
    };

      const removeToken = async (tokenKey) => {
        try {
            await AsyncStorage.removeItem(tokenKey);
            console.log('Token - ',tokenKey,'- removed successfully!');
        } catch (error) {
            console.error('Error removing token:', error);
        }
    };

        const handleLogout = async () => {
          try{
          
            if (accessToken!== null){
              const str = `Bearer ${accessToken}`;
              console.log(str);
                  
              let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/logout', {
                   method: 'POST',
                   headers: {
                      'Authorization': str,
                     'Content-Type': 'application/json',
                   },
                   
                 });
                 
                 console.log('ResponseLogout:', response);
                 if(response.status === 200){
                  removeToken('accessToken');
                  removeToken('refreshToken');
                  removeToken('userID');
                  router.push('/sign/sign_in');
                 }
  
              }}catch (error) {
                  console.error('Error:', error);
              }finally{  
  
              }
  
      };

      const refreshTok = async () => {
        //  if (accessToken!=''){
          try {
             // console.log(accessToken);
              const str = `Bearer ${refreshToken}`;
              const res = {
              method: 'POST',
              headers: {
                'Authorization': str,
                'Content-Type': 'application/json'
              },
              };
                  
              console.log(res);
                  //if(str!=''){
              const response2 = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/refresh_token',
                res
              );
              console.log('ResponseRefreshToken:', response2);
             
             
              
              } catch (error) {
                  console.error(error);
              }
              //    }
      }

  return (
    <View style={styles.background}>

        <CustomButton
                    title="Заявки на допуск к объектам"
                    handlePress={()=>{router.push('./requests')}} 
                   // isLoading={upLoading} // Можно добавить индикатор загрузки, если нужно
                  />
        <CustomButton
                      title="Пользователи"
                      handlePress={()=>{router.push('./users')}} 
                  //   isLoad={load} // Можно добавить индикатор загрузки, если нужно
        />
        <CustomButton
                      title="Создать объект"
                      handlePress={()=>{router.push('./create_obj')}} 
                  //   isLoad={load} // Можно добавить индикатор загрузки, если нужно
        />
        <CustomButton
                      title="change"
                      handlePress={()=>{refreshTok()}} 
                  //   isLoad={load} // Можно добавить индикатор загрузки, если нужно
        />

    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: 'center'
    },
});


