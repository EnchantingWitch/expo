import CustomButton from "@/components/CustomButton";
import HeaderForTabs from "@/components/HeaderForTabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { useGlobalSearchParams, useRouter } from "expo-router";
import * as Sharing from 'expo-sharing';
import { openBrowserAsync } from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';


export default function Docs() {
  const { StorageAccessFramework } = FileSystem

  const router = useRouter();
  const { codeCCS } = useGlobalSearchParams(); //получение код ОКС
  const { capitalCSName } = useGlobalSearchParams(); //получение код ОКС
  const [accessToken, setAccessToken] = useState<any>("");
  const [nameLink, setNameLink] = useState<any>("");
  const [urlFetch, setUrlFetch] = useState<any>("");
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [urlWork, setUrlWork] = useState<any>("");
  const [urlOperate, setUrlOperate] = useState<any>("");
  const [urlExecute, setUrlExecute] = useState<any>("");
  const [urlPreporate, setUrlPreporate] = useState<any>("");
  const [urlBuffer, setUrlBuffer] = useState<any>("");

  const [statusPressGetExcel, setStatusPressGetExcel] = useState<boolean>(false);//для мониторинга
  const [statusPressGetJournal, setStatusPressGeJournal] = useState<boolean>(false);//для журнала

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token !== null) {
        console.log("Retrieved token:", token);
        setAccessToken(token);
      } else {
        console.log("No token found");
        router.push("/sign/sign_in");
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Object[]>([]);

  const getLink = async () => {
    try {
      const response = await fetch(
        "https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/findByCodeCCS/" +
          codeCCS,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("responseFindByCodeCCS", response);

      const json = await response.json();
      setData(json);
      console.log("responseFindByCodeCCS", json);

      if (json.capitalCSInfoDTO.workingDocsLink) {
        setUrlWork(json.capitalCSInfoDTO.workingDocsLink);
      }
      if (json.capitalCSInfoDTO.executiveDocsLink) {
        setUrlExecute(json.capitalCSInfoDTO.executiveDocsLink);
      }
      if (json.capitalCSInfoDTO.operationalDocsLink) {
        setUrlOperate(json.capitalCSInfoDTO.operationalDocsLink);
      }
      if (json.capitalCSInfoDTO.preparatoryDocsLink) {
        setUrlPreporate(json.capitalCSInfoDTO.preparatoryDocsLink);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

    useEffect(() => {
    if (accessToken) {
      getLink();
      //getExcelFile();
    }
  }, [accessToken]);

  useEffect(() => {
    if (urlExecute || urlOperate || urlPreporate || urlWork) {
      // И сразу отправляем на сервер
      modalLinkSave(urlWork, urlOperate, urlExecute, urlPreporate);
      // Очищаем буфер
      setUrlBuffer("");
    }
  }, [urlExecute, urlOperate, urlPreporate, urlWork]);

  useEffect(() => {
    if (urlFetch !== "" && nameLink !== "") {
      setModalStatus(true);
    }
  }, [urlFetch, nameLink]);
  //console.log(urlFetch !== "", "urlFetch");

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return fontSize / fontScale;
  };

  const handleLink = async (event, link) => {
    try {
      if (link) {
        if (Platform.OS !== "web") {
          // Предотвращаем стандартное поведение открытия ссылки в браузере по умолчанию на мобильных устройствах
          event.preventDefault();
          // Открываем ссылку во встроенном браузере приложения
          await openBrowserAsync(link);
        } else {
          // На вебе открываем ссылку в новой вкладке
          window.open(link, "_blank");
        }
      } else {
        Alert.alert(
          "",
          `Добавьте ссылку для перехода в выбранную документацию.`,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
    } catch (error) {
      Alert.alert("Ошибка", `${error}`, [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      console.error("Error retrieving token:", error);
    }
  };

  const handleSetLink = () => {
    const newUrlWork = nameLink === "рабочей" ? urlBuffer : urlWork;
    const newUrlOperate = nameLink === "заводской" ? urlBuffer : urlOperate;
    const newUrlExecute =
      nameLink === "исполнительной" ? urlBuffer : urlExecute; // Исправлено с urlOperate на urlExecute
    const newUrlPreporate =
      nameLink === "подготовительной" ? urlBuffer : urlPreporate; // Исправлено с urlOperate на urlPreporate

    // Сразу обновляем все состояния
    setUrlWork(newUrlWork);
    setUrlOperate(newUrlOperate);
    setUrlExecute(newUrlExecute);
    setUrlPreporate(newUrlPreporate);
  };

  const modalLinkSave = async (
    workLink,
    operateLink,
    executeLink,
    preporateLink
  ) => {
    //прописать фетч здесь, в конце фетч прописать setUrlfetch('');
    //linkFromDB будут прописаны в отдельные переменные из json
    //
    try {
      let response = await fetch(
        "https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/updateCapitalCSInfo/" +
          codeCCS,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workingDocsLink: workLink,
            operationalDocsLink: operateLink,
            executiveDocsLink: executeLink,
            preparatoryDocsLink: preporateLink,
            
          }),
        }
      );
      console.log("ResponseUpdateObj:", response);
      console.log(
        JSON.stringify({
          workingDocsLink: urlWork, //рабочая документация
          executiveDocsLink: urlExecute, // исполнительная док-ция
          operationalDocsLink: urlOperate, // эксплуотационная док -ция
          preparatoryDocsLink: urlPreporate, // подготовительная док-ция
        })
      );
      /* if (response.status == 200){
        Alert.alert('', 'Данные по объекту обновлены.', [
          {text: 'OK', onPress: () => console.log('OK Pressed')}])
      }
      if (response.status == 400) {
        Alert.alert('', 'Данные по объекту не обновлены.', [
               {text: 'OK', onPress: () => console.log('OK Pressed')}])
      };*/
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setNameLink("");
      getLink();
    }
  };

  const openModalWithCurrentLink = (linkType) => {
    setNameLink(linkType);
    // Устанавливаем текущее значение ссылки в буфер
    switch (linkType) {
      case "рабочей":
        setUrlBuffer(urlWork);
        break;
      case "заводской":
        setUrlBuffer(urlOperate);
        break;
      case "исполнительной":
        setUrlBuffer(urlExecute);
        break;
      case "подготовительной":
        setUrlBuffer(urlPreporate);
        break;
      default:
        setUrlBuffer("");
    }
    setModalStatus(true);
  };

  // Функция для конвертации Blob в base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const saveF = async (toFetch: string, fileName: string, extands: string, mimeType: string, toUTI: string, setF) => {
  //toFetch - /.../.../ со слешом до кода окс
  //fileName - имя файла для сохранения ''
  //extands - расширение без точки например: 'xlsx'
  setF(true);
  try {
    // 1. Запрашиваем разрешение на доступ к директории
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!permissions.granted) {
      Alert.alert('',"Вы должны предоставить разрешение для сохранения файла.",
      [
        { text: 'OK' }
      ]
       );
      return;
    }

    const directoryUri = permissions.directoryUri;
    console.log('const directoryUri ',directoryUri)

    // Проверяем возможность записи тестовым файлом
    try {
      const testFileUri = await StorageAccessFramework.createFileAsync(
        directoryUri,
        "test_write_check",
        "text/plain"
      );
      
      await FileSystem.writeAsStringAsync(testFileUri, "test", {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      await FileSystem.deleteAsync(testFileUri);
    } catch (testError) {
       Alert.alert('',"Выбранная директория недоступна для записи. Пожалуйста, выберите другую.",
      [
        { text: 'OK' }
      ]
       );
      return;
    }
   
    // 2. Получаем данные с сервера
    const response = await fetch(
      `https://xn----7sbpwlcifkq8d.xn--p1ai:8443${toFetch}${codeCCS}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        //  Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // для Excel
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    
    // 3. Получаем бинарные данные
    const blob = await response.blob();
  //  console.log(blob);
    const base64data = await blobToBase64(blob);

    // 4. Создаем файл с правильным расширением
    const fileUri = await StorageAccessFramework.createFileAsync(
      directoryUri,
      `${fileName} ${capitalCSName}.${extands}`, // имя файла с расширением
      mimeType // MIME тип для Excel
    );

    await FileSystem.writeAsStringAsync(fileUri, base64data, {
        encoding: FileSystem.EncodingType.Base64,
      });

    console.log("Файл успешно сохранен:", fileUri);
    if (Platform.OS === 'android') {
          await RNFetchBlob.android.actionViewIntent( fileUri, mimeType);
        } else {
          await Sharing.shareAsync(fileUri, {
            mimeType: mimeType,
            dialogTitle: 'Открыть файл',
            UTI: toUTI // или 'com.microsoft.excel.xlsx'
          });
        }
  } catch (err) {
    console.error("Ошибка при сохранении файла:", err);
    Alert.alert(
      '','"Произошла ошибка:' + err,
      [
        { text: 'OK' }
      ]
    );
  } finally {
    setF(false);
  }
};
   

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <HeaderForTabs nameTab="Документация" capitalCSName={capitalCSName}/>

      <ScrollView>
        <View style={styles.container}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={(event) => {
                handleLink(event, urlWork);
              }}
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ width: 120, height: 120, marginLeft: "15%", tintColor: "#0072C8" }}
                  source={require("../../assets/images/WorkDocs.svg")}
                />
                <TouchableOpacity
                  style={{ alignItems: "flex-end", width: 35 }}
                  onPress={() => openModalWithCurrentLink("рабочей")}
                >
                  <Ionicons
                    name="link-outline"
                    size={24}
                    color="#0072C8"
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: ts(14),
                  color: "#0072C8",
                  fontWeight: "400",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Рабочая
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={(event) => {
                handleLink(event, urlOperate);
              }}
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ width: 120, height: 120, marginLeft: "15%", tintColor: "#0072C8", }}
                  source={require("../../assets/images/factoryDocs.svg")}
                />
                <TouchableOpacity
                  style={{ alignItems: "flex-end", width: 35 }}
                  onPress={() => openModalWithCurrentLink("заводской")}
                >
                  <Ionicons
                    name="link-outline"
                    size={24}
                    color="#0072C8"
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: ts(14),
                  color: "#0072C8",
                  fontWeight: "400",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Заводская
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={(event) => {
                handleLink(event, urlPreporate);
              }}
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ width: 120, height: 120, marginLeft: "15%", tintColor: "#0072C8", }}
                  source={require("../../assets/images/preparationDocs.svg")}
                />
                <TouchableOpacity
                  style={{ alignItems: "flex-end", width: 35 }}
                  onPress={() => openModalWithCurrentLink("подготовительной")}
                >
                  <Ionicons
                    name="link-outline"
                    size={24}
                    color="#0072C8"
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: ts(14),
                  color: "#0072C8",
                  fontWeight: "400",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Подготовительная
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={(event) => {
                handleLink(event, urlExecute);
              }}
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ width: 120, height: 120, marginLeft: "15%", tintColor: "#0072C8", }}
                  source={require("../../assets/images/executionDocs.svg")}
                />
                <TouchableOpacity
                  style={{ alignItems: "flex-end", width: 35 }}
                  onPress={() => openModalWithCurrentLink("исполнительной")}
                >
                  <Ionicons
                    name="link-outline"
                    size={24}
                    color="#0072C8"
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: ts(14),
                  color: "#0072C8",
                  fontWeight: "400",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Исполнительная
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={(event) => {
                handleLink(
                  event,
                  "https://drive.google.com/drive/folders/14d62EIGcNx4Qre6TYaJ4nDBad9f7ItZq"
                );
              }}
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}
            >
              <Image
                style={{ width: 120, height: 120, marginLeft: -7, tintColor: "#0072C8", }}
                source={require("../../assets/images/standartDocs.svg")}
              />

              <Text
                style={{
                  fontSize: ts(14),
                  color: "#0072C8",
                  fontWeight: "400",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Нормативная
              </Text>
            </TouchableOpacity>

          {statusPressGetExcel===false? 
            <TouchableOpacity
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}
              onPress={()=>[saveF(
                '/excelForms/getMonitoring/', 
                'Мониторинг ПНР по объекту', 
                'xlsx',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'org.openxmlformats.spreadsheetml.sheet',
                setStatusPressGetExcel
              )
              ]}
            >
              <Image
                style={{ width: 120, height: 120, marginLeft: -7, tintColor: "#0072C8", }}
                source={require("../../assets/images/monitoring.svg")}
              />
              <Text
                style={{
                  fontSize: ts(14),
                  color: "#0072C8",
                  fontWeight: "400",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Мониторинг ПНР
              </Text>
            </TouchableOpacity>
          :
            <View
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}>
              <Image
                  style={{ width: 120, height: 120, marginLeft: -7,  opacity: 0.5, tintColor: "#0072C8",}}
                  source={require("../../assets/images/monitoring.svg")}
                />
                <Text
                  style={{
                    fontSize: ts(14),
                    color: "#0072C8",
                    fontWeight: "400",
                    textAlign: "center",
                    marginLeft: -7,
                  }}
                >
                  Мониторинг ПНР
                </Text>
            </View>
          }
            
          </View>
          <View style={{ flexDirection: "row" }}>
          {statusPressGetJournal===false? 
            <TouchableOpacity
              onPress={(event) => { //reqForJournal()
             saveF(
                '/excelForms/getJournal/', //'/journal/getJournal/', 
                'Журнал ПНР по объекту', 
                'xlsx',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'org.openxmlformats.spreadsheetml.sheet',
                /*'docx',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'org.openxmlformats.wordprocessingml.document',*/
                setStatusPressGeJournal
              )
              }}
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}
            >
              <Image
              
                style={{ width: 120, height: 124, marginLeft: -7, tintColor: "#0072C8",}}
                source={require("../../assets/images/journal.svg")}
              />

              <Text
                style={{
                  fontSize: ts(14),
                  color: "#0072C8",
                  fontWeight: "400",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Журнал ПНР
              </Text>
            </TouchableOpacity>
            :
            <View
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}>
              <Image
                  style={{ width: 120, height: 124, marginLeft: -7, tintColor: "#0072C8",  opacity: 0.5}}
                  source={require("../../assets/images/journal.svg")}
                />
                <Text
                  style={{
                    fontSize: ts(14),
                    color: "#0072C8",
                    fontWeight: "400",
                    textAlign: "center",
                    marginLeft: -7,
                  }}
                >
                  Журнал ПНР
                </Text>
            </View>
          }
            </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade" // Можно использовать 'slide', 'fade' или 'none'
        transparent={true} // Установите true, чтобы сделать фон полупрозрачным
        visible={modalStatus}
        onRequestClose={() => setModalStatus(false)} // Для Android
      >
        <TouchableOpacity activeOpacity={1} style={{flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-end',}} onPress={()=> setModalStatus(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Полупрозрачный фон
          }}
        >
          <View
            style={{
              width: 300,
              height: 190,
              padding: 5,
              backgroundColor: "white",
              borderRadius: 10,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => [
                setModalStatus(false),
                setUrlFetch(""),
                setNameLink(""),
              ]}
              style={{ alignSelf: "flex-end" }}
            >
              <Ionicons name="close-outline" size={30} />
            </TouchableOpacity >
            <View style={{ justifyContent: "center" }}>
              <View
                style={{
                  paddingVertical: 3,
                  width: "92%",
                  alignSelf: "center",
                }}
              >
                <TextInput
                  multiline
                  style={{
                    textAlign: "center",
                    includeFontPadding: false,
                    textAlignVertical: "center",
                    lineHeight: ts(12),
                    fontSize: ts(14),
                    color: "#1A4072",
                  }}
                  editable={false}
                >
                  Ссылка для {nameLink} документации{" "}
                </TextInput>
              </View>

              <View
                style={{
                  paddingVertical: 3,
                  paddingBottom: 20,
                  width: "92%",
                  alignSelf: "center",
                }}
              >
                <TextInput
                  style={{
                    borderColor: "#E0F2FE",
                    borderWidth: 2,
                    borderRadius: 6,
                    height: 36,
                    paddingBottom: 7,
                    textAlignVertical: "center",
                    fontSize: ts(14),
                    textAlign: "center",
                  }}
                  onChangeText={setUrlBuffer}
                  value={urlBuffer}
                />
              </View>

              <CustomButton
                title="Сохранить"
                handlePress={() => [setModalStatus(false), handleSetLink()]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    width: "98%",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
