import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, ActivityIndicator, useWindowDimensions,} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import CustomButton from "@/components/CustomButton";
import { router, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import FileViewer from "@/components/FileViewer";
import { isLoading } from "expo-font";



//const UploadFile =  ()  => {
  export default function UploadFile (){
  const [singleFile, setSingleFile] = useState<any>('');
  const [load, setLoad]= useState<boolean>(false);
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  return (
    <View style={styles.background}>
      
        <CustomButton
                    title="Зарегистрироваться"
                    handlePress={()=>{router.push('/sign/register')}} 
                   // isLoading={upLoading} // Можно добавить индикатор загрузки, если нужно
                  />
       
        <CustomButton
                      title="Войти"
                      handlePress={()=>{router.push('/sign/sign_in')}} 
                  //   isLoad={load} // Можно добавить индикатор загрузки, если нужно
        />
      
       <CustomButton
                      title="Объекты"
                      handlePress={()=>{router.push({pathname: '/objs/objects', params: { }})}} 
                  //   isLoad={load} // Можно добавить индикатор загрузки, если нужно
        />
        <CustomButton
                      title="Администрирование"
                      handlePress={()=>{router.push('/admin/menu')}} 
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


