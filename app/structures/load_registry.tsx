import CustomButton from "@/components/CustomButton";
import useDevice from "@/hooks/useDevice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, StatusBar, StyleSheet, Text, useWindowDimensions, View } from "react-native";


//const UploadFile =  ()  => {
  export default function UploadFile (){
     const { isMobile, isDesktopWeb, isMobileWeb, screenWidth, screenHeight } = useDevice();
    const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const [singleFile, setSingleFile] = useState<any>('');
  const [load, setLoad]= useState<boolean>(false);
  
  const [accessToken, setAccessToken] = useState<any>('');
  const [objname, setObjname] = useState<any>('');
  const [disabled, setDisabled] = useState(false); //для кнопки

  const fontScale = useWindowDimensions().fontScale;

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

  const {codeCCS} = useLocalSearchParams();//получение id объекта
  const {capitalCSName} = useLocalSearchParams();//получение id объекта
  //console.log(codeCCS, 'ID load_reistry');

  const uploadFile = async () => {
    setDisabled(true);
      try {
      setLoad(true);
      const fileToUpload = singleFile;
      const data = new FormData();
     // const file = new File(fileToUpload.uri, 'fileToUpload', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileObject = {
        uri: fileToUpload.uri,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        name: 'fileToUpload'
      };

      const file = new File([fileToUpload], 'fileToUpload.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      console.log('file', file);
      //data.append('file', file);
      if (typeof File !== 'undefined' && fileToUpload instanceof File) {
          // Веб-среда
          data.append('file', singleFile);
        } else if (fileToUpload.uri) {
          // React Native среда
          data.append('file', {
            uri: fileToUpload.uri,
            type: fileToUpload.type,
            name: fileToUpload.name
          });
        } 
     /*data.append('file', 
        {
        uri: fileToUpload.uri,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        name: 'fileToUpload'
      }
       );*/

    //  console.log('fileToUpload.uri', fileToUpload.uri)

    /*   for (let [key, value] of data.entries()) {
        console.log(key, value);
       }*/
      const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

        const body = `--${boundary}\r\n` +
        'Content-Disposition: form-data; name="file"; filename="fileToUpload.xlsx"\r\n' +
        'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n' +
        `${fileToUpload.uri}\r\n` +
        `--${boundary}--`;
        console.log('BODY', body)

    /*   let res = await axios.post('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/uploadStructure/' + codeCCS, data, {
          headers: {
            'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data', boundary: '----WebKitFormBoundary7MA4YWxkTrZu0gW'
          },
        });
        */

       let res = await fetch(
        'https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/uploadStructure/'+codeCCS,
        {
          method: 'post',
          body: data,
          headers: {
            'Authorization': `Bearer ${accessToken}`, 
          //  'Content-Type': 'multipart/form-data'
          },
        }
      );

    /*  axios.interceptors.request.use((config) => {
        console.log('Отправляемые данные:', config.data);
        return config;
      });
*/
      console.log('ResponseLoadRegistry:', res);
     
      if (res.status == 200){
       Alert.alert('', 'Структура загружена.', [
             {text: 'OK', onPress: () => console.log('OK Pressed')}])
      }
      
      } catch (error) {
        Alert.alert('', 'Произошла ошибка: ' + error, [
                     {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ])
        console.error('Error:', error);
        setDisabled(false);
      }
      finally{
        router.replace({pathname: '/(tabs)/structure', params: { codeCCS: codeCCS, capitalCSName: objname}})
        setDisabled(false);
      }  
  };

  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      let file
      if (!isMobile){
       file = await new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

        input.onchange = (e) => {
          resolve(e.target.files[0]);
        };
        input.click();
      })}
       else{
      const res = await DocumentPicker.getDocumentAsync({
        // Provide which type of file you want user to pick
        //type: "*/*",
        //Ограничение загружаемых типов файлов (mime type)
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel' ],
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
        copyToCacheDirectory: true, 
        
      });
      // Printing the log realted to the file
      console.log('res of DocumentPicker : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      if (!res.canceled) {
      setSingleFile(res.assets[0]); }
    }
    if(file){setSingleFile(file)}
    } catch (err) {
      setSingleFile('');
      // Handling any exception (If any)
     if (DocumentPicker.Cancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
    useEffect(() => {
      getToken();
      if(capitalCSName){setObjname(capitalCSName);}
    }, [capitalCSName]);

  return (
    <View style={styles.background}>
      <View style={styles.button}>
       
          <CustomButton
                    title="Выбрать файл"
                    handlePress={selectFile} 
                  />
        <View >
        {singleFile ? (<Text style={{fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center', paddingTop: 15}}>
          Выбран файл: {singleFile.name}</Text>):(
            <Text style={{fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center', paddingTop: 15}}>Файл не выбран</Text>)
        }
        </View>     
        
      </View>
      <View style={{ paddingBottom: BOTTOM_SAFE_AREA + 20 }}>
        <CustomButton
                      disabled={disabled}
                      title="Отправить"
                      handlePress={uploadFile} 
                
        />
        <View>
          {load ? ( <ActivityIndicator size={'large'} style={{paddingTop: 10, }}/>):('')
          }
        </View>
      </View>
    </View>
  );
};
//router.push('./see_note');
const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    flex: 1,
    //  "radial-gradient(ellipse at left bottom,    rgb(217, 248, 255) 0%,    rgb(255, 255, 255) 59%,    rgb(255, 255, 255) 100% )",
  },
  file: {
    color: "black",
    marginHorizontal: 145,
  },
  button: {

    flex: 2/8,
    marginTop: 30,
   
  },
});

//export default UploadFile;

