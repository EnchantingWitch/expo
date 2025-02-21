import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, ActivityIndicator, useWindowDimensions,} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
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
                    title="Заявки"
                    //handlePress={()=>{router.push('')}} 
                   // isLoading={upLoading} // Можно добавить индикатор загрузки, если нужно
                  />
        <CustomButton
                      title="Зарегистрированные пользователи"
                  //    handlePress={()=>{router.push('')}} 
                  //   isLoad={load} // Можно добавить индикатор загрузки, если нужно
        />
        <CustomButton
                      title="Создать объект"
                      handlePress={()=>{router.push('./create_obj')}} 
                  //   isLoad={load} // Можно добавить индикатор загрузки, если нужно
        />
        {/*<CustomButton
                      title="Загрузить объекты"
                      handlePress={()=>{router.push('./load_objs')}} 
                  //   isLoad={load} // Можно добавить индикатор загрузки, если нужно
        />*/}

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


