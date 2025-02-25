import React, { useState, useEffect } from 'react';
import { Text, View, Image, TextInput, Button, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { router, Link, Tabs } from 'expo-router';
import DropdownComponent1 from '@/components/ListOfSystem';
import DropdownComponent2 from '@/components/ListOfCategories';
import DateInputWithPicker from '@/components/CalendarOnWrite';
import DateInputWithPicker2 from '@/components/calendar+10';
import FormField from '@/components/FormField';
import { styles } from './create_note';
import * as ImagePicker from 'expo-image-picker';


interface Data {
  commentId: number;
  serialNumber: number;
  subObject: string;
  systemName: string;
  description: string;
  commentStatus: string;
  commentCategory: string;
  startDate: string;
  endDatePlan: string;
  endDateFact: string;
  commentExplanation: string;
  iinumber: number;
  UserName: string
}

const EditDataScreen: React.FC = () => {
  const [data, setData] = useState<Data | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [editedCommentId, setEditedCommentId] = useState<number>(0);
  const [editedSerialNumber, setEditedSerialNumber] = useState<number>(0);
  const [editedSubObject, setEditedSubObject] = useState<string>('');
  const [editedSystemName, setEditedSystemName] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [editedCommentStatus, setEditedCommentStatus] = useState<string>('');
  const [editedCommentCategory, setEditedCommentCategory] = useState<string>('');
  const [editedStartDate, setEditedStartDate] = useState<string>('');
  const [editedEndDatePlan, setEditedEndDatePlan] = useState<string>('');
  const [editedEndDateFact, setEditedEndDateFact] = useState<string>('');
  const [editedCommentExplanation, setEditedCommentExplanation] = useState<string>('');
  const [editedUserName, setEditedUserName] = useState<string>('');
  const [editedIinumber, setEditedIinumber] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/getCommentById/1`);
      const result: Data = await
        response.json();
      setData(result);
      setEditedCommentCategory(result.commentCategory);
      setEditedCommentExplanation(result.commentExplanation);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const [singlePhoto, setSinglePhoto] = useState<any>('');


  const selectPhoto = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({});
      console.log('res : ' + JSON.stringify(res));
      if (!res.canceled) {
        setSinglePhoto(res.assets[0]);
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

  const cancelPhoto = async () => {
    setSinglePhoto('');
  };


  const handleEditClick = () => {
    setEditing(true);
    setEditedCommentId(data?.commentId || 0);
    setEditedSerialNumber(data?.serialNumber || 0);
    setEditedSubObject(data?.subObject || '');
    setEditedSystemName(data?.systemName || '');
    setEditedDescription(data?.description || '');
    setEditedCommentStatus(data?.commentStatus || '');
    setEditedCommentCategory(data?.commentCategory || '');
    setEditedStartDate(data?.startDate || '');
    setEditedEndDatePlan(data?.endDatePlan || '');
    setEditedEndDateFact(data?.endDateFact || '');
    setEditedCommentExplanation(data?.commentExplanation || '');
    setEditedUserName(data?.UserName || '');
    setEditedIinumber(data?.iinumber || 0);
  };

  const handleSaveClick = async () => {
    try {
      let response = await fetch(`https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/updateComment/1`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: editedCommentId,
          serialNumber: editedSerialNumber,
          subObject: editedSubObject,
          systemName: editedSystemName,
          description: editedDescription,
          commentStatus: editedCommentStatus,
          commentCategory: editedCommentCategory,
          startDate: editedStartDate,
          endDatePlan: editedEndDatePlan,
          endDateFact: editedEndDateFact,
          commentExplanation: editedCommentExplanation,
          iinumber: editedIinumber
        }),
      });

      if (response.ok) {
        const jsonData: Data = await response.json();
        setData(jsonData);
        setEditing(false);
        alert('Данные успешно сохранены!');
      } else {
        throw new Error('Не удалось сохранить данные.');
      }
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <ScrollView style={[styles.container]}>
      <SafeAreaView>
        <View style={[styles.container]}>


          <>
            <View style={[styles.container]}>

              <View style={{ flex: 1, alignItems: 'center' }}>

                <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Редактирование данных</Text>

                <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>№ замечания: {data?.iinumber}</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#696969"
                  value={`${editedIinumber}`}
                  onChangeText={(text) => setEditedIinumber(Number(text))}
                />


                <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>№ акта ИИ: {data?.subObject}</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#696969"
                  value={`${editedSubObject}`}
                  onChangeText={(text) => setEditedSubObject(text)}
                />



                <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Объект: {data?.systemName}</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#696969"
                  value={`${editedSystemName}`}
                  onChangeText={(text) => setEditedSystemName(text)}
                />

                <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Система: {data?.description}</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#696969"
                  value={`${editedDescription}`}
                  onChangeText={(text) => setEditedDescription(text)}
                />

                <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Статус: {data?.commentStatus}</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#696969"
                  value={`${editedCommentStatus}`}
                  onChangeText={(text) => setEditedCommentStatus(text)}
                />
                <View >
                  {singlePhoto ? (
                    <View style={{ paddingVertical: 8 }}>

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

                <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: '400', marginBottom: 8 }}>Исполнитель: {data?.UserName}</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#696969"
                  value={`${editedUserName}`}
                  onChangeText={(text) => setEditedUserName(text)}
                />
                <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: 400, marginBottom: 0 }}>Дата выдачи: {data?.endDatePlan}</Text>
                <DateInputWithPicker keyboardType="number-pad" editable={false} />

                <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: 400, marginBottom: 0 }}>Плановая дата устранения: {data?.endDateFact}</Text>
                <DateInputWithPicker
                />
                <Text style={{ fontSize: 14, color: '#1E1E1E', fontWeight: 400, marginBottom: 8 }}>Категория замечания: {data?.commentCategory}</Text>
                <DropdownComponent2 />

                <View style={{ width: 272, height: 40, justifyContent: 'center', alignContent: 'center' }}>

                </View>
                <CustomButton
                  title="Сохранить изменения"
                  handlePress={handleSaveClick} />
                <View>
                  <CustomButton
                    title="Отмена"
                    handlePress={() => router.push('/(tabs)/two')} />
                </View>
              </View>
            </View>
          </>

        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
const stylHead = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8,
    paddingVertical: 8,
    flex: 1,
    //  rowGap: 30,
    //   flexDirection: 'column',
    //   justifyContent: 'flex-start',
    backgroundColor: '#708fff',
    alignItems: 'center',
    // alignContent: 'space-around',
    justifyContent: 'center',
    // minWidth: 120, 
    // flexWrap: 'wrap',
  },
});

export default EditDataScreen;