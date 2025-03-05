import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, ScrollView, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import { Link, Tabs, useLocalSearchParams, router } from 'expo-router';
//import DropdownComponent2 from '@/components/list_categories';
import Calendar from '@/components/Calendar+';
import { styles } from './create_note';
import CustomButton from '@/components/CustomButton';



export type SystemGET = {
  serialNumber: number;
  iiNumber: string;
  subObject: string;
  systemName: string;
  description: string;
  commentStatus: string; 
  startDate: string;
  endDatePlan: string;
  endDateFact: string;
  commentCategory: string;
  commentExplanation: string;
  codeCCS: string;
  executor: string;//исполнитель 
}

const DetailsScreen = () => {

  const {codeCCS} = useLocalSearchParams();//получение кода ОКС 
  const {capitalCSName} = useLocalSearchParams();//получение наименование ОКС 
  const {post} = useLocalSearchParams();//получение Id замечания
  console.log(post, 'commentId post');
  const [inputHeight, setInputHeight] = useState(42);

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

  const [serNumber, setSerNumber] = useState<string>('');
  const [numberII, setNumberII] = useState<string>('');
  const [subObj, setSubObj] = useState<string>('');//подобъект
  const [systemN, setSystemN] = useState<string>('');//система
  const [comment, setComment] = useState<string>('');//содержание замечания
  const [commentStat, setCommentStat] = useState<string>('');//статус замечания
  const bufCommentStat = commentStat;//хранит статус замечания из бд, чтобы вывести его в случае отмены выбранной даты устранения (изначально пустой)
  const [startD, setStartD] = useState<string>('');//дата выдачи замечания
  const [planD, setPlanD] = useState<string>('');//плановая дата устранения
  const [factD, setFactD] = useState<string>('');//фактическая дата устранения
  const [category, setCategory] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');//комментарий
  const [code, setCode] = useState<string>('');
  const [execut, setExecut] = useState<string>('');//исполнитель
  const [statusReq, setStatusReq] = useState<boolean>(false);//для передачи даты после запроса
  const [startReq, setStartReq] = useState<boolean>(true);//для вызова getComment только при первом получении post

  useEffect(() => {
    //вызов getComment при получении id Замечания - post
      if (post && startReq) {
        setStartReq(false);
        getComment();
        //getPhoto();
        console.log(post, 'commentID')
      }
    //смена статуса при изменении даты
      if (factD) {
        if(factD != ' '){
          setCommentStat('Устранено');   
        } else {
          setCommentStat('Не устранено');
        }
    }
    }, [post, factD]);
  
    const getComment = async () => {
      try {
        const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/getCommentById/'+post);
        const json = await response.json();
        setSerNumber(''+json.serialNumber.toString());
        setNumberII(''+json.iiNumber.toString());
        setSubObj(json.subObject);
        setSystemN(json.systemName);
        setComment(json.description);
        setCommentStat(json.commentStatus);
        setStartD(json.startDate); console.log('json.startDate',json.startDate);
        setPlanD(json.endDatePlan); console.log('json.endDatePlan',json.endDatePlan);
        setFactD(json.endDateFact); console.log('json.endDateFact',json.endDateFact);
        setCategory(json.commentCategory);
        setExplanation(json.commentExplanation);
        setCode(json.codeCCS);
        setExecut(json.executor);
        //console.log(json.systemName, 'json.systemName');
        console.log('ResponseGetComment:', response);
        console.log('ResponseGetComment json:', json);
        setStatusReq(true);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        setStatusReq(false);
      } finally {
        //
      }

      //getPhoto
      try {
        const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/files/downloadPhoto/' + post);
        const json = await response.json();
        //setSerNumber(''+json.serialNumber.toString());
        console.log('ResponseGetPhoto:', response);
        console.log('ResponseGetPhoto json:', json);
        //setStatusReq(true);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        //setStatusReq(false);
      } finally {
        //
      }
    };

    const putComment = async () => {
      try {
        let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/updateComment/'+post, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commentId: 1,
            serialNumber: serNumber,
            subObject: subObj,
            systemName: systemN,
            description: comment,
            commentStatus: commentStat,
            commentCategory: category,
            startDate: startD,
            endDatePlan: planD,
            endDateFact: factD,
            commentExplanation: explanation,
            iiNumber: numberII
          }),
        });
        console.log('ResponsePutComment:', response);
        console.log('ResponsePutComment json:', JSON.stringify({
          commentId: 1,
          serialNumber: parseInt(serNumber, 10),
          subObject: subObj,
          systemName: systemN,
          description: comment,
          commentStatus: commentStat,
          commentCategory: category,
          startDate: startD,
          endDatePlan: planD,
          endDateFact: factD,
          commentExplanation: explanation,
          iinumber: numberII
          //iinumber: parseInt(numberII, 10)
        }));
        if (response.ok) {
          
          //alert('Данные успешно сохранены!');
        } else {
          //throw new Error('Не удалось сохранить данные.');
        }
      } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
      }  finally{
        router.replace({pathname: '/(tabs)/two', params: { codeCCS: code, capitalCSName: capitalCSName}});
      }
    };

    if (startReq) {
      setStartReq(false);
      getComment();   
      console.log(post, 'commentID')
    }



  return (

    <ScrollView>
      <View style={[styles.container]}>
        
        <View style={{flex: 1, alignItems: 'center'}}>

          <View style={{flexDirection: 'row', width: '98%', marginBottom: 0 }}>
            <View style={{width: '20%', alignItems: 'center'}}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>№</Text>
            </View>

            <View style={{width: '20%', alignItems: 'center'}}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center'}}>№ АИИ</Text>
            </View>

            <View style={{width: '60%', alignItems: 'center'}}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center'}}>Подобъект</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', width: '98%', marginBottom: 0 }}>
             
            <View style={{width: '20%', alignItems: 'center'}}>
            <TextInput
            style={[styles.input, {fontSize: ts(14), marginTop: 6}]}
            //placeholder="№ акта ИИ"
            placeholderTextColor="#111"
            value={serNumber}
            editable={false}
            />
            </View>

            <View style={{width: '20%', alignItems: 'flex-end'}}>
            <TextInput
            style={[styles.input, {fontSize: ts(14), marginTop: 6}]}
            placeholderTextColor="#111"
            value={numberII}
            editable={false}
            />
            </View>

            <View style={{width: '60%', alignItems: 'center'}}>
            <TextInput
            style={[styles.input, {fontSize: ts(14), marginTop: 6, lineHeight: 19}]}
            placeholderTextColor="#111"
            value={subObj}
            multiline
            editable={false}
            maxLength={45}
            />
            </View>

          </View>  
            
          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Система</Text>
          <TextInput
            style={[styles.input, {fontSize: ts(14), lineHeight: 19 }]}
            placeholderTextColor="#111"
            value={systemN}
            multiline
            editable={false}
          />     
          
          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Содержание замечания</Text>
          <TextInput
            style={[styles.input,  {flex: 1, height: Math.max(42, inputHeight), fontSize: ts(14) }]} // Минимальная высота 42
            placeholderTextColor="#111"
            multiline
           // onChangeText={setComment}
            onContentSizeChange={e=>{
              let inputH = Math.max(e.nativeEvent.contentSize.height, 35)
              if(inputH>120) inputH =100
              setInputHeight(inputH)}}
            value={comment}
            //editable={false}
          />

          

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Статус</Text>
          <TextInput
            style={[styles.input, {fontSize: ts(14) }]}
            placeholderTextColor="#111"
            value={commentStat}
            editable={false}
          />

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель</Text>
          <TextInput
            style={[styles.input, {fontSize: ts(14) }]}
            placeholderTextColor="#111"
            value={execut}
            editable={false}
          />

          <View style={{flexDirection: 'row',width: '100%',}}>{/* Объявление заголовков в строку для дат плана и факта ИИ */}
                <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Дата выдачи</Text>
                 </View>
          
                 <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Плановая дата</Text>
                 </View>
          </View>

          <View  style={{flexDirection: 'row', width: '96%'}}>{/* Дата выдачи и Плановая дата устранения */}
              <View style={{width: '50%', justifyContent: 'center'}}>
                <TextInput
                  style={[styles.input, {fontSize: ts(14), width: '95%', marginTop: 6 }]}
                  placeholderTextColor="#111"
                  value={startD}
                  editable={false}
                />
              </View>
          
              <View style={{width: '50%', flexDirection: 'row', justifyContent: 'flex-end'}}>
              <TextInput
                  style={[styles.input, {fontSize: ts(14), width: '95%', marginTop: 6, alignContent: 'flex-end'}]}
                  placeholderTextColor="#111"
                  value={planD}
                  editable={false}
                />
                
              </View>

            {/*<Calendar theme='min' statusreq={statusReq} post={startD} diseditable={true}/>
            <Calendar theme='min' statusreq={statusReq} post={planD} diseditable={true}/>*/}
          </View>

          <View style={{flexDirection: 'row',width: '100%',}}>{/* Объявление заголовков в строку для дат плана и факта ИИ */}
                <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Дата устранения</Text>
                 </View>
          
                 <View style={{width: '50%', }}>
                  <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: '400', textAlign: 'center' }}>Фото</Text>
                 </View>
          </View>

          

          <View  style={{flexDirection: 'row', width: '100%'}}>
            
            <Calendar theme='min' statusreq={statusReq} post={factD} diseditable={false} onChange={(dateString) => setFactD(dateString)}/>
            <View style={{width: '50%'}}>

            </View>

          </View>

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Категория замечания</Text>
          <TextInput
             style={[styles.input, {fontSize: ts(14) }]}
            placeholderTextColor="#111"
            value={category}
            editable={false}
          />

          <Text style={{ fontSize: ts(14), color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Комментарий</Text>
          <TextInput
             style={[styles.input, {fontSize: ts(14) }]}
            placeholderTextColor="#111"
            value={explanation}
            editable={false}
          />

          <View style={{justifyContent: 'center', alignContent: 'center', }}>
           <CustomButton title='Сохранить' handlePress ={ putComment } />
           <CustomButton title='Редактировать' handlePress ={() => router.replace({pathname: '/notes/change_note', 
           params: {
            serialNumb: serNumber,
            numberii: numberII,
            subobj: subObj,
            system: systemN,
            comment: comment,
            status: commentStat,
            executor: execut,
            startD: startD,
            planD: planD,
            factD: factD,
            category: category,
            explan: explanation,
            id: post,
            codeCCS: code, 
            capitalCSName: capitalCSName
           }})} />
          </View>

        </View>
      </View>
    </ScrollView>


  );
}

export default DetailsScreen;