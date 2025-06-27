import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from "react-native";

type token = {
  accessToken: string;
  refreshToken: string;
  //role: string;
};

//const UploadFile =  ()  => {
  export default function UploadFile (){
  const [singleFile, setSingleFile] = useState<any>('');
  const [load, setLoad] = useState<boolean>(false);
  const fontScale = useWindowDimensions().fontScale;
  const [accessToken, setAccessToken] = useState<any>('');
  const [accessTokenNew, setAccessTokenNew] = useState<any>('');
  const [refreshToken, setRefreshToken] = useState<any>('');
  const [refreshTokenNew, setRefreshTokenNew] = useState<any>('');
  const [statusAccess, setStatusAccess] = useState<boolean>(false);
  const [statusRefresh, setStatusRefresh] = useState<boolean>(false);

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

    const getToken = async () => {
      try {
          const token = await AsyncStorage.getItem('accessToken');
          //setAccessToken(token);
          if (token !== null) {
              console.log('Retrieved token:', token);
              setAccessToken(token);
              //вызов getAuth для проверки актуальности токена
              //authUserAfterLogin();
          } else {
              console.log('No token found');
              router.push('/sign/sign_in');
          }
      } catch (error) {
          console.error('Error retrieving token:', error);
      }
  };

  const authUserAfterLogin = async () => {
    //  if (accessToken!=''){
      try {
          console.log(accessToken);
          const str = `Bearer ${accessToken}`;
             // const str = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJUcmV3cXBvaSIsImlhdCI6MTc0MzE2MzI0NSwiZXhwIjoxNzQzMTk5MjQ1fQ.MCXn7n_RzjJxC3Vzk6TNfi7qeaCUaTJ2Ov6DWfiXRARimsOMepQHpxoDLmk94y850ifKwW1EDegKs8lwO4wn4A`;
          const res = {
          method: 'GET',
          headers: {
            'Authorization': str,
            'Content-Type': 'application/json'
          },
          };
              
          console.log(res);
              //if(str!=''){
          const response2 = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/getAll',
            res
          );
          console.log('ResponseAuthUser:', response2);
          //const text = await response2.text()
          //console.log(text);
          if (response2.status === 200){
            const role = parseJwt(accessToken);
            console.log(role.role);
           // if (role.role === 'ADMIN'){router.replace('/admin/menu');}
           // if (role.role === 'USER'){
                router.replace('/objs/objects');//}
          }
          else{
            //вызов refresh
            const token = await AsyncStorage.getItem('refreshToken');
            if (token!== null){
              setRefreshToken(token);
              //refreshTok();
              }  
          }
          } catch (error) {
              console.error(error);
          }
          //    }
  }

  const authAdminAfterLogin = async () => {
    //  if (accessToken!=''){
      try {
          console.log(accessToken);
          const str = `Bearer ${accessToken}`;
             // const str = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJUcmV3cXBvaSIsImlhdCI6MTc0MzE2MzI0NSwiZXhwIjoxNzQzMTk5MjQ1fQ.MCXn7n_RzjJxC3Vzk6TNfi7qeaCUaTJ2Ov6DWfiXRARimsOMepQHpxoDLmk94y850ifKwW1EDegKs8lwO4wn4A`;
          const res = {
          method: 'GET',
          headers: {
            'Authorization': str,
            'Content-Type': 'application/json'
          },
          };
              
          console.log(res);
              //if(str!=''){
          const response2 = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/getAll',
            res
          );
          console.log('ResponseAdminRole:', response2);
          //const text = await response2.text()
          //console.log(text);
          if (response2.status === 200){
            const role = parseJwt(accessToken);
            console.log(role.role);
           // if (role.role === 'ADMIN'){router.replace('/admin/menu');}
           // if (role.role === 'USER'){
                router.replace('/admin/menu');//}
          }
          else{
            //вызов refresh
            const token = await AsyncStorage.getItem('refreshToken');
            if (token!== null){
              setRefreshToken(token);
              //refreshTok();
              }  
          }
          } catch (error) {
              console.error(error);
          }
          //    }
  }

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
         
          if (response2.status === 200){ 
            const token: token = await response2.json()
               console.log('ResponseRefreshToken accessToken',token.accessToken);
               console.log('ResponseRefreshToken refreshToken', token.refreshToken);
               setAccessTokenNew(token.accessToken);
               setRefreshTokenNew(token.refreshToken);
             //  removeToken('accessToken');
              // removeToken('refreshToken');
              // saveToken('accessToken', accessToken);
               //saveToken('refreshToken', refreshToken);
          /*  const role = parseJwt(accessToken);
            console.log(role.role);
            if (role.role === 'ADMIN'){router.replace({pathname:'/admin/menu', params:{token: accessToken}});}
            if (role.role === 'USER'){router.replace('/objs/objects');}
          */}
          else{
            console.log('No token refresh');
              router.push('/sign/sign_in');
          }
          } catch (error) {
              console.error(error);
          }
          //    }
  }

  const removeToken = async (tokenKey) => {
        try {
            await AsyncStorage.removeItem(tokenKey);
            console.log('Token - ',tokenKey,'- removed successfully!');
        } catch (error) {
            console.error('Error removing token:', error);
        }
        finally{
          if (tokenKey === 'accessToken'){saveToken('accessToken', accessToken);
          }
          if (tokenKey === 'refreshToken'){saveToken('refreshToken', refreshToken);
          }
        }
    };

    const toReplace = async (token) => {
      const role = parseJwt(accessToken);
            console.log(role.role);
            if (role.role === 'ADMIN'){router.replace({pathname:'/admin/menu', params:{token: accessToken}});}
            if (role.role === 'USER'){router.replace('/objs/objects');}
    }

  const saveToken = async (tokenKey, token) => {
    try {
        await AsyncStorage.setItem(tokenKey, token);
        console.log('Token - ', tokenKey, '- saved successfully!', token);
    } catch (error) {
        console.error('Error saving token:', error);
    } finally{
          if (tokenKey === 'accessToken'){setStatusAccess(true);
          }
          if (tokenKey === 'refreshToken'){setStatusRefresh(true);
          }
    }
};

  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

//console.log('accessTokenIndex', accessToken);

useEffect(() => {
  getToken();
}, []);

useEffect(() => {
  if(accessToken){
    const role = parseJwt(accessToken);
    console.log(role.role);
    if (role.role === 'USER'){authUserAfterLogin();}
    if (role.role === 'ADMIN'){authAdminAfterLogin();}
  }
  if(refreshToken){refreshTok();}
}, [accessToken, refreshToken]);

useEffect(() => {
  if(accessTokenNew){
     removeToken('accessToken'); }
  if(refreshTokenNew){
    removeToken('refreshToken'); }
}, [accessTokenNew, refreshTokenNew]);
/*useEffect(() => {
  if(accessTokenNew){
    toReplace(accessTokenNew); }
  if(refreshTokenNew){
    toReplace(refreshTokenNew);}
}, [accessTokenNew, refreshTokenNew]);*/

useEffect(() => {
  if(statusAccess && statusRefresh){
    toReplace(accessTokenNew); }
}, [statusAccess, statusRefresh]);


  return (
    <View style={styles.background}>
      <ActivityIndicator></ActivityIndicator>
       
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


