import { Link, router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { useEffect, useState } from 'react';


import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import CustomButton from '@/components/CustomButton';

//const PlaceholderImage = require('@/assets/images/0056.jpg');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState('');
  //const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const formData = new FormData();
  //formData.append

  const request = fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/uploadPhotos/1', {
    method: 'POST',
    body: selectedImage
   // body: selectedImage
  });

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      //alert('You did not select any image.');
    }
  };

  return (
    <View style={styles.container}>
      
      <Button theme="primary" label="Добавить фотографию" onPress={pickImageAsync} />
      <View style={styles.imageContainer}>
        <ImageViewer selectedImage={selectedImage} />
      </View>
      <CustomButton
                    title="Сохранить"
                    handlePress={()=>{request; router.push('./see_note');}} // Вызов функции отправки данных
                   // isLoading={upLoading} // Можно добавить индикатор загрузки, если нужно
                  />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});



/*
import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View,  Button, TextInput, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicatorComponent } from 'react-native';
import { Link, Tabs } from 'expo-router';
import { Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image, type ImageSource } from "expo-image";


export default function add_photo() {
  
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };
  
  return (
    
  <SafeAreaView style = {{flex: 1, backgroundColor: 'white'}}> 
   <ScrollView>
    <View style={[styles.container]}>
    <View style={{
            flex: 1,
            //marginLeft: 60.5,
            //marginRight: 60.5,
            alignItems: 'center',
            
            }}>

        <View style={{width: 272, height: 40, justifyContent: 'center', alignContent: 'center', paddingTop: 15,
                //alignItems: 'center', backgroundColor: 'powderblue',
          }}>
          <Link href='/two' asChild>
          <TouchableOpacity  style={{ borderRadius: 8, backgroundColor: '#0072C8', width: 272, height: 40, paddingVertical: 8,  alignSelf: 'center', marginBottom: 15}}>
            <Text style={{fontSize: 16, fontWeight: '400', color: '#F5F5F5', textAlign: 'center',}}>Добавить фотографию</Text>
           
          </TouchableOpacity >
          </Link>
        </View>

        <View style={{flex: 1}}>
        
      </View>

        <View style={{
            flex: 1,} }>

        </View>
    </View>
    
    </View>
    </ScrollView>
  </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    //flex: 1,
    marginRight:0,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/