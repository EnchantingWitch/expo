import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity,} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import FileViewer from "@/components/FileViewer";


//const UploadFile =  ()  => {
  export default function UploadFile (){
  const [singleFile, setSingleFile] = useState<any>('');

  const uploadImage = async () => {
    
      try {
    // Check if any file is selected or not
   
      // If file selected then create FormData
      const fileToUpload = singleFile;
      const data = new FormData();
      //data.append('name', 'Image Upload');
      data.append('file_attachment', fileToUpload);
      // Please change file upload URL
      let res = await fetch(
        'https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/uploadStructure/051-2004430.0003',
        {
          method: 'post',
          body: data,
         /* headers: {
            'Content-Type': 'multipart/form-data; ',
          },*/
        }
      );
      console.log('Response:', res);
      let responseJson = await res.json();
      if (responseJson.status == 1) {
        alert('Upload Successful');
      }
      } catch (error) {
        console.error('Error:', error);
      }
      finally{router.push('/(tabs)/structure');}  
  };

  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.getDocumentAsync({
        // Provide which type of file you want user to pick
        //type: "*/*",
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
        copyToCacheDirectory: true, 
      });
      // Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      if (!res.canceled) {
      setSingleFile(res.assets[0].uri); }
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

  /*
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const req = async () => {
  try {
  const request = fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/uploadStructure/051-2004430.0003', {
    method: 'POST',
    headers: {'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
    body: selectedImage
  })
   console.log('Response:', request);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      //router.push('/(tabs)/two'); 
    }
 }*/
 // const pickDocument = async () => {
   // let result = await DocumentPicker.getDocumentAsync({ 
     // type: "*/*",
      // all files
      // type: "image/*" // all images files
      // type: "audio/*" // all audio files
      // type: "application/*" // for pdf, doc and docx
      // type: "application/pdf" // .pdf
      // type: "application/msword" // .doc
      // type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
      // type: "vnd.ms-excel" // .xls
      // type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
      // type: "text/csv" // .csv
   /*   multiple: true,
      copyToCacheDirectory: true 
    });
    console.log(result.uri);
    console.log(result);
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      //alert('You did not select any image.');
    }
  }*/

  return (
    <View style={styles.background}>
      <Text style={styles.file}></Text>
      <View style={styles.button}>
       
          <CustomButton
                    title="Выбрать файл"
                    handlePress={selectFile} // Вызов функции отправки данных
                   // isLoading={upLoading} // Можно добавить индикатор загрузки, если нужно
                  />
          <FileViewer selectedImage={singleFile}/>

          <CustomButton
                    title="Отправить"
                    handlePress={uploadImage} // Вызов функции отправки данных
                   // isLoading={upLoading} // Можно добавить индикатор загрузки, если нужно
                  />
        
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
    marginHorizontal: 60,
  },
});

//export default UploadFile;

