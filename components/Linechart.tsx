import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Dimensions, Modal, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import CustomButton from './CustomButton';

type Props = {
  blueQuantity: number;
  dinamic: number;
  title: string;
};

const Linechart = ({ blueQuantity, title, dinamic }: Props) => {
  const fontScale = useWindowDimensions().fontScale;
  const [modalStatus, setModalStatus] = useState(false);
  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};
    
 
 const lineData = [
      {value: 0, dataPointText: '0', label: '30.04', dataPointColor: '#0072C8' },
      {value: 20, dataPointText: '20', label: '07.05', dataPointColor: '#0072C8'},
      {value: 18, dataPointText: '18', label: '14.05', dataPointColor: '#0072C8'},
      {value: 40, dataPointText: '40', label: '21.05', dataPointRadius: 5, dataPointColor: '#16a34a', dataPointLabelWidth: 1},
      {value: 36, dataPointText: '36', label: '29.05', dataPointColor: '#0072C8'},
      {value: 60, dataPointText: '60', label: '05.05', dataPointColor: '#0072C8'},
      {value: 54, dataPointText: '54', label: '12.05', dataPointColor: '#0072C8'},
  ];
 
  return (
 
   
 <View style={{ flex: 1, }}>
    <View>
     <View style={{flexDirection: 'row'}}>
        <View style={{width: '58%'}}>
        <Text style={{color: '#1A4072', fontSize: ts(16), fontWeight: 'bold', alignSelf: 'flex-end' }}>
            {title}
        </Text></View>
        <TouchableOpacity style={{width: '40%', alignItems: 'flex-end'}} onPress={()=>setModalStatus(true)}>
          <Ionicons name='person-add-outline' size={20} color={'#0072C8'}></Ionicons>{/** man-outline person-add-outline person-circle-outline*/}
        </TouchableOpacity> 
    </View>
    <View
      style={{
        padding: ts(10),
        borderRadius: 20,
        borderColor: '#1A4072',
        borderWidth: 2,
        backgroundColor: '#F2F2F2',//'#F2F2F2'
        height: 105,
        flexDirection: 'row',
        width: '100%'
      }}>
        <View style={{width: '25%', alignSelf: 'center', flexDirection: 'row'}}>
          <Text
            style={{fontSize: ts(30), color: '#0072C8', fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>
              {blueQuantity}
          </Text>

          {dinamic>=0? {/**ВОЗМОЖНО ПРИДЕТСЯ ПОМЕНЯТЬ ЛОГИКУ */}
            (<View style={{flexDirection: 'row'}}>
              <Image style={{ width: 34, height: 34, tintColor: '#16a34a', alignItems: 'flex-end',  }}
                        source={require('../assets/images/arm.svg')} />
              <View style={{ marginBottom: -0.5, marginLeft: -10  }}>
                <Text
                style={{fontSize: ts(14), color: '#16a34a', fontWeight: 'bold', marginTop: 6, marginRight: 5}}>
                  {dinamic}
                </Text>
              </View>         
            </View>)
            :
            (<View style={{flexDirection: 'row'}}>
              <Image style={{ width: 34, height: 34, tintColor: '#E24831', alignItems: 'flex-end',  }}
                        source={require('../assets/images/redArm.svg')} />
              <View style={{ marginBottom: -0.5, marginLeft: -10  }}>
                <Text
                style={{fontSize: ts(14), color: '#E24831', fontWeight: 'bold', marginTop: 6, marginRight: 5}}>
                  {dinamic}
                </Text>
              </View>         
            </View>)
          }

        </View>

        <View style={{  height: 90, alignSelf: 'flex-end',  width: '80%', marginBottom: -5 }}>
          <LineChart
              initialSpacing={15}
              data={lineData}
              
              textColor1="black"
              width={Dimensions.get('window').width * 0.62}//238
              height={65}
              stepValue={8}
              //adjustToWidth={true}
             // dataPointLabelWidth={0}
              //stepHeight={}

              textShiftY={-5}
              textShiftX={-7}
              textFontSize={13}
              //thickness={5}
              hideRules
              hideYAxisText={true}

              hideAxesAndRules={true}//скрывает оси
              
              spacing={Dimensions.get('window').width * 0.092}//расстояние между метками - 34
              showXAxisIndices
              xAxisIndicesHeight={1}
              xAxisIndicesWidth={250}
              xAxisColor={'gray'}
              xAxisIndicesColor={'#A9A9A9'}

              xAxisLabelTextStyle={{
                fontSize: ts(10),
                color: '#1A4072', //#E24831
                //fontFamily: 'Arial'
              }}

              spacing1={Dimensions.get('window').width * 0.092}//расстояние между точками - 34
              yAxisColor="#0BA5A4"
             // showVerticalLines
              verticalLinesColor="rgba(14,164,164,0.5)"
              color="#0072C8"
             // curved={true}
              //hideOrigin={true}

          />
          </View>
     </View>

    </View>

    <Modal
      animationType="fade" // Можно использовать 'slide', 'fade' или 'none'
      transparent={true} // Установите true, чтобы сделать фон полупрозрачным
      visible={modalStatus}
      onRequestClose={() => setModalStatus(false)} // Для Android
      >
      <View style={{flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
       }}>
                        
        <View style={{
          width: 300,
          height: 400,
          padding: 5,
          backgroundColor: 'white',
          borderRadius: 10,
          justifyContent: 'center',
         }}>
          <TouchableOpacity onPress={() => setModalStatus(false)} style = {{alignSelf: 'flex-end', }}>
            <Ionicons name='close-outline' size={30} />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center'}}      > 

            <View style={{flexDirection: 'row'}}>
              <View style={{ width: '54%', alignItems: 'center'}}>
                <Text style={{color: '#1A4072', fontSize: ts(14), fontWeight: 'bold', alignSelf: 'center' }}>Дата</Text>
              </View>
              <View style={{ width: '46%', alignItems: 'center'}}>
                <Text style={{color: '#1A4072', fontSize: ts(14), fontWeight: 'bold', alignSelf: 'center' }}>Количество</Text>
              </View>
            </View>  

            <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 3}}>
              <TextInput style={{ textAlign: 'center', borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 90, includeFontPadding: false,  textAlignVertical: 'center', lineHeight: ts(12), fontSize: ts(14)}} editable={false}>
                30.04.2025</TextInput>
              <TextInput keyboardType={'number-pad'} style={{ borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 70, paddingBottom: 7,  textAlignVertical: 'center', fontSize: ts(14), textAlign: 'center'}}>
                </TextInput>  
            </View>   

            <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 3}}>
              <TextInput style={{ textAlign: 'center', borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 90, includeFontPadding: false,  textAlignVertical: 'center', lineHeight: ts(12), fontSize: ts(14)}} editable={false}>
                07.05.2025</TextInput>
              <TextInput keyboardType={'number-pad'} style={{ borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 70, paddingBottom: 7, textAlignVertical: 'center', fontSize: ts(14), textAlign: 'center'}}>
                </TextInput>  
            </View>  

            <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 3}}>
              <TextInput style={{ textAlign: 'center', borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 90, includeFontPadding: false,  textAlignVertical: 'center', lineHeight: ts(12), fontSize: ts(14)}} editable={false}>
                14.05.2025</TextInput>
              <TextInput keyboardType={'number-pad'} style={{ borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6,height: 36, width: 70, paddingBottom: 7, textAlignVertical: 'center', fontSize: ts(14), textAlign: 'center'}}>
                </TextInput>  
            </View>   

            <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 3}}>
              <TextInput style={{ textAlign: 'center', borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 90, includeFontPadding: false,  textAlignVertical: 'center', lineHeight: ts(12), fontSize: ts(14)}} editable={false}>
                21.05.2025</TextInput>
              <TextInput keyboardType={'number-pad'} style={{ borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 70, paddingBottom: 7, textAlignVertical: 'center', fontSize: ts(14), textAlign: 'center'}}>
                </TextInput>  
            </View>   

            <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 3}}>
              <TextInput style={{ textAlign: 'center', borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 90, includeFontPadding: false,  textAlignVertical: 'center', lineHeight: ts(12), fontSize: ts(14)}} editable={false}>
                29.05.2025</TextInput>
              <TextInput keyboardType={'number-pad'} style={{ borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 70, paddingBottom: 7, textAlignVertical: 'center',  fontSize: ts(14), textAlign: 'center'}}>
                </TextInput>  
            </View>   

            <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 3}}>
              <TextInput style={{ textAlign: 'center', borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 90, includeFontPadding: false,  textAlignVertical: 'center', lineHeight: ts(12), fontSize: ts(14)}} editable={false}>
                05.06.2025</TextInput>
              <TextInput keyboardType={'number-pad'} style={{ borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 70, paddingBottom: 7, textAlignVertical: 'center', fontSize: ts(14), textAlign: 'center'}}>
                </TextInput>  
            </View>   

            <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 3, paddingBottom: 6}}>
              <TextInput style={{ textAlign: 'center', borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 90, includeFontPadding: false,  textAlignVertical: 'center', lineHeight: ts(12), fontSize: ts(14)}} editable={false}>
                12.06.2025</TextInput>
              <TextInput keyboardType={'number-pad'} style={{ borderColor: '#E0F2FE', borderWidth: 2, borderRadius: 6, height: 36, width: 70, paddingBottom: 7, textAlignVertical: 'center', fontSize: ts(14), textAlign: 'center'}}>
                </TextInput>  
            </View>

            <CustomButton title='Сохранить'/>  

          </View>  
        </View>
      </View>

    </Modal>
   
  </View>

    


  ); 
}

export default Linechart;