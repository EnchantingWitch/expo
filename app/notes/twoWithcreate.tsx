import { router, useGlobalSearchParams } from 'expo-router';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';

import CustomButton from '@/components/CustomButton';
import DropdownComponent from '@/components/list_system_for_listOfnotes';
import { ActivityIndicator, Alert, FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
//import tw from 'tailwind-rn'

import Calendar from '@/components/Calendar+';


import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';


interface FormData {
  commentId: string;
  serialNumber: string;
  subObject: string;
  systemName: string;
  description: string;
  commentStatus: string;
  commentCategory: string;
  startDate: string;
  endDatePlan: string;
  endDateFact: string;
  commentExplanation: string;
  numberII: string,
  userName: string;
  codeCCS: string;
  url: string;

  onChange: (dateString: string) => void;
  value: string;
  placeholder?: string;
}
const formatDate = (date) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function DirectionLayout() {

  const currentDate = new Date;

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)
  };

  const {codeCCS} = useGlobalSearchParams();//получение кода ОКС 
  const {capitalCSName} = useGlobalSearchParams();//получение наименование ОКС 
  const [statusReq, setStatusReq] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<FormData | null>(null);
  const [userData, setUserData] = useState<FormData | null>(null);

  const [direction, setDirection] = useState('Объект');
  const [iconBlue, setIconBlue] = useState<boolean>(false);//Устранено без просрочки
  const [iconOrange, setIconOrange] = useState<boolean>(false);//Устранено с просрочкой
  const [iconEmpty, setIconEmpty] = useState<boolean>(false);//Не устранено без просрочки
  const [iconEmptyOrange, setIconEmptyOrange] = useState<boolean>(false);//Не устранено с просрочкой

  const [showDatePicker, setShowDatePicker] = useState(false)

  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [editedCommentId, setEditedCommentId] = useState<number>(0);
  const [editedSerialNumber, setEditedSerialNumber] = useState<number>(0);
  const [editedSubObject, setEditedSubObject] = useState<string>('');
  const [editedSystemName, setEditedSystemName] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [editedCommentStatus, setEditedCommentStatus] = useState<string>('');
  const [editedCommentCategory, setEditedCommentCategory] = useState<string>('');
  const [editedUserName, setEditedUserName] = useState<string>('');
  const [editedIinumber, setEditedIinumber] = useState<string>('')
  const [editedCommentExplanation, setEditedCommentExplanation] = useState<string>('');
  //const [editedStartDate, setEditedStartDate] = useState<string>('');
  // const [editedEndDatePlan, setEditedEndDatePlan] = useState<string>('');

  const [editedEndDateFact, setEditedEndDateFact] = useState<string>('')
  const customFormat = 'dd.MM.yyyy';

  const [photo, setPhoto] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [updating, setUpdating] = useState(false);


  const [editedFields, setEditedFields] = useState<Partial<FormData>>({});

  const fetchData = async () => {
    try {
      const response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/getAllComments/'+codeCCS);
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      const result: FormData = await response.json();
      setUserData(result)
      setEditedIinumber(result.numberII)
      setEditedSubObject(result.subObject)
      setEditedSystemName(result.systemName)
      setEditedDescription(result.description)
      setEditedCommentStatus(result.commentStatus)
      setEditedUserName(result.userName)
      //setEditedStartDate(result.startDate)
      setEditedCommentCategory(result.commentCategory)
      setEditedEndDateFact(result.endDateFact)
      //setEditedEndDatePlan(result.endDatePlan)
      setEditedCommentExplanation(result.commentExplanation)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`https://files/downloadPhoto/${selectedItem?.commentId}`); // Замените на ваш URL
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        const data: FormData = await response.json();
        setPhoto(data);
        if(response.status != 200){console.log('errorOnDownloadPhoto',error);}
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, []);

  const [singlePhoto, setSinglePhoto] = useState<any>('');

  const selectPhoto = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({});
      console.log('res : ' + JSON.stringify(res));
      if (res.assets && res.assets[0].uri) {
        setSinglePhoto(res.assets[0].uri)
      }
    } catch (err) {
      setSinglePhoto('');
      if (ImagePicker.Cancel(err)) {
        alert('Canceled');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const fetchDataPhoto = async () => {
    try {
      const response = await fetch(`https://files/downloadPhoto/${selectedItem?.commentId}`);
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      const result: FormData = await response.json();
      setPhoto(result);
      if(response.status != 200){console.log('errorOnDownloadPhoto',error);}
    } catch (error) {
      console.error(error);
    } finally {
      setStatusReq(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataPhoto();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async () => {
    if (!userData || Object.keys(editedFields).length === 0) {
      Alert.alert('Ошибка', 'Нет изменений для сохранений');
      return;
    }
    setUpdating(true);

    try {
      const response = await fetch(`https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/updateComment/${userData?.commentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedFields)
          /*  {
              iiNumber: editedIinumber,
              subObject: editedSubObject,
              systemName: editedSystemName,
              description: editedDescription,
              commentStatus: editedCommentStatus,
              userName: editedUserName,
              // startDate: editedStartDate,
              endDateFact: editedEndDateFact,
              //   endDatePlan: editedEndDatePlan,
              commentCategory: editedCommentCategory
        })*/
        })
      if (!response.ok) {
        throw new Error('Ошибка редактирования данных')
      }
      setUserData((prev) => ({ ...prev!, ...editedFields }));
      setEditedFields({}); // Очищаем изменённые поля

      Alert.alert('Успех!', 'Данные успешно сохранены!');
    }
    catch (error) {
      Alert.alert('Ошибка', 'Ошибка при сохранении данных:');
    }
    finally {
      setUpdating(false)
    }
  };

  const cancelPhoto = async () => {
    setSinglePhoto('');
  };

  const handleThreeFunction = async () => {
    await handleSaveClick();
    await setSelectedItem(null);
    await fetchData();
  }

  const renderItem = ({ item }: { item: FormData }) => (

    <TouchableWithoutFeedback
      onPress={() => setSelectedItem(item)}>

      <View style={{ backgroundColor: '#E0F2FE', flexDirection: 'row', width: '100%', height: 37, justifyContent: 'center', marginBottom: '5%', borderRadius: 8 }}>

        <View style={{ width: '15%', justifyContent: 'center' }}>
          <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}> {item.serialNumber} </Text>
        </View>
        < View style={{ width: '75%', marginStart: 2, justifyContent: 'center' }}>
          <Text style={{ fontSize: ts(14), color: '#334155', textAlign: 'left' }}> {item.description} </Text>
        </View>
        < View style={{ width: '7%', marginStart: 2, justifyContent: 'center' }}>

          {(item.commentStatus == 'Устранено') ? (<Ionicons name="checkbox" size={25} color="#0072C8" />) : ''}
          {(item.commentStatus == 'Не устранено') ? <Ionicons name="square" size={25} color="#F0F9FF" /> : ''}
          {(item.commentStatus == 'Не устранено с просрочкой') ? (<Ionicons name="square" size={25} color="#F59E0B" />) : ''}

          {/**checkmark-circle-outline , close-circle-outline, square-outline*/}
          {/*} <Text style={{ fontSize: ts(16), color: '#334155', textAlign: 'center'  }}>{item.commentStatus} </Text>*/}
        </View>

      </View>
    </TouchableWithoutFeedback>
  );

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, alignItems: 'center' }}>

        <PreviewLayout
          selectedValue={direction}
          values={['Объект', <DropdownComponent />]}
          setSelectedValue={setDirection} >

          <View style={{ flexDirection: 'row', width: '98%', height: 32, paddingTop: 6, justifyContent: 'space-between' }}>
            <Text style={{ fontSize: ts(14), color: '#1E1E1E' }}>№</Text>
            < Text style={{ fontSize: ts(14), color: '#1E1E1E' }}> Содержание </Text>
            < Text style={{ fontSize: ts(14), color: '#1E1E1E' }}> Статус </Text>
          </View>

          <View style={{ flex: 15, marginTop: 10 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                data={userData}
                renderItem={renderItem}
                keyExtractor={(item) => item.commentId}
              />
            )}
            <Modal
              visible={!!selectedItem}
              animationType="slide"
              transparent={true}
            >
              <View style={{
                height: '100%',
                width: '100%'
              }}>
                <View style={{
                  height: '100%',
                  width: '100%'
                }}>
                  {selectedItem && (
                    <>
                      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                        <ScrollView>
                          <View >
                            <>
                              <TouchableOpacity onPress={() => { setSelectedItem(null) }}>
                                <Image style={{ width: 45, height: 45 }}
                                  source={require('@/assets/images/krest.png')} />
                              </TouchableOpacity>
                              <View >
                                <View style={{ flex: 1, alignItems: 'center' }}>

                                  <Text style={{ fontSize: 18, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Редактирование данных</Text>

                                  <Text style={styles.inputNotChange} >№ акта ИИ:     {selectedItem.numberII}</Text>


                                  <Text style={styles.inputNotChange}>Объект:     {selectedItem.subObject}</Text>

                                  <Text style={styles.inputNotChange}>Система:     {selectedItem.systemName}</Text>


                                  <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Описание: </Text>
                                  <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#696969"
                                    placeholder={selectedItem.description}
                                    value={editedFields.description || selectedItem.description}
                                    onChangeText={(text) => handleInputChange('description', text)}
                                  />

                                  < Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Статус: </Text>
                                  <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#696969"
                                    placeholder={selectedItem.commentStatus}
                                    value={editedFields.commentStatus || userData?.commentStatus}
                                    onChangeText={(text) => handleInputChange('commentStatus', text)}
                                  />


                                  <View style={styles.container}>
                                    {photo ? (
                                      <Image
                                        source={{ uri: photo.url }}
                                        style={styles.image}
                                        resizeMode="cover"
                                      />
                                    ) : (
                                      <Text>Изображение не найдено</Text>
                                    )}
                                  </View>


                                  <View >
                                    {singlePhoto ? (
                                      <View style={{ paddingVertical: 8 }}>

                                        <View>
                                          <Image
                                            source={{ uri: singlePhoto }}
                                            style={styles.image}
                                            resizeMode="cover"
                                          />
                                        </View>

                                        <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>
                                          Выбрано фото: {singlePhoto.fileName}</Text>

                                        <CustomButton
                                          title="Удалить фото"
                                          handlePress={cancelPhoto}
                                        />

                                      </View>
                                    ) : (
                                      <View style={{ paddingVertical: 8 }}>

                                        <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8, textAlign: 'center' }}>Фото не выбрано </Text>

                                        <CustomButton
                                          title="Выбрать фото"
                                          handlePress={selectPhoto}
                                        />

                                      </View>
                                    )
                                    }
                                  </View>

                                  <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель: </Text>
                                  <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#696969"
                                    placeholder={selectedItem.userName}
                                    value={editedFields.userName || userData?.userName}
                                    onChangeText={(text) => handleInputChange('userName', text)}
                                  />
                                  <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: 400, marginBottom: 10 }}>Дата окончания: {selectedItem.endDateFact}</Text>
                                 
                                  <Calendar post = {selectedItem?.endDateFact || editedFields.endDateFact}  statusreq={statusReq} onChange={(dateString) => setEditedEndDateFact(dateString)} />
                                  
                                  <Text style={styles.inputNotChange}>Категория замечания:    {selectedItem.commentCategory}</Text>

                                  <CustomButton
                                    title='Сохранить'
                                    handlePress={handleThreeFunction} />
                                </View>
                              </View>
                            </>
                          </View>
                        </ScrollView>
                      </SafeAreaView>

                    </>
                  )}
                </View>
              </View>
            </Modal>
          </View>
          < View style={{
            width: 272, height: 40, justifyContent: 'center',
            //alignItems: 'center', backgroundColor: 'powderblue',
          }}>
            <CustomButton
              title="Добавить замечание"
              handlePress={() =>router.push({pathname: '/notes/create_note', params: { codeCCS: codeCCS, capitalCSName: capitalCSName }})} />

          </View>
        </PreviewLayout >
      </View >
    </SafeAreaView >

  );
  ;
}
type PreviewLayoutProps = PropsWithChildren<{
  // label: string;
  values: string[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}>;

type PreviewNameProps = PropsWithChildren<{
  values: string[];
}>;

const PreviewName = (
  {
    //childern,
    values,
  }: PreviewNameProps) => (

  <View style={styles.row} >
    {
      values.map(value => (
        <Text key={value} style={styles.title} >
          {value}
        </Text>

      ))
    }
  </View>
);

const PreviewLayout = ({
  //  label,
  children,
  values,
  selectedValue,
  setSelectedValue,
}: PreviewLayoutProps) => (
  <View style={{ padding: 6, flex: 1 }}>

    <View style={styles.row}>
      {
        values.map(value => (
          <TouchableOpacity
            key={value}
            onPress={() => setSelectedValue(value)}
            style={[styles.button, selectedValue === value && styles.selected]} >
            <Text
              style={
                [
                  styles.buttonLabel,
                  selectedValue === value && styles.selectedLabel,
                ]
              }>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
    < View style={styles.separator} />
    <View style={[styles.container,]}> {children} </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%'
  },
  title: {
    fontSize: 15,
    fontWeight: 'normal',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  separator: {
    marginVertical: 5,

    height: 1,
    width: '100%',
  },
  box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //alignItems: 'center',
  },
  containerData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonData: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    /* paddingVertical: 6,
     paddingBottom: 6,
     paddingRight: 8,
     paddingLeft: 8,*/
    backgroundColor: '#E0F2FE',
    marginHorizontal: '10%',
    marginBottom: 16,
    width: 103,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',

  },
  inputNotChange: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    width: '60%',
    height: 42,
    paddingVertical: 'auto',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 30,
    justifyContent: 'center'
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    width: '96%',
    height: 42,
    paddingVertical: 'auto',
    color: '#808080',
    textAlign: 'center',
    marginBottom: 20,
    justifyContent: 'center'
  },
  //background: #F8FAFC;

  selected: {
    backgroundColor: '#E0F2FE',
    // justifyContent: 'center',
    borderWidth: 0,
  },
  buttonLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#334155',
    //textAlign: 'center',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    left: 38
  },
});
