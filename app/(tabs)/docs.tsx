import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import * as FileSystem from 'expo-file-system';
import { Image } from "expo-image";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
//import * as Sharing from 'expo-sharing';
import useDevice from "@/hooks/useDevice";
import * as FileSystem from "expo-file-system";
import * as Sharing from 'expo-sharing';
import { openBrowserAsync } from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  //Linking, 
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';


export default function Docs() {
  const { isMobile, isDesktopWeb, isMobileWeb, screenWidth } = useDevice();  
  const { StorageAccessFramework } = FileSystem
  const BOTTOM_SAFE_AREA =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const router = useRouter();
  const { codeCCS } = useGlobalSearchParams(); //получение код ОКС
  const { capitalCSName } = useGlobalSearchParams(); //получение код ОКС
  const [inputHeight, setInputHeight] = useState(40);
  // const {capitalCSName} = useGlobalSearchParams();//получение код ОКС
  /* console.log(Id, 'Id object');
  const ID = Id;*/
  console.log(codeCCS, "codeCCS object");
  const [accessToken, setAccessToken] = useState<any>("");
  const [nameLink, setNameLink] = useState<any>("");
  const [urlFetch, setUrlFetch] = useState<any>("");
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  
  //router.setParams({ ID: ID });
  const [urlWork, setUrlWork] = useState<any>("");
  const [urlOperate, setUrlOperate] = useState<any>("");
  const [urlExecute, setUrlExecute] = useState<any>("");
  const [urlPreporate, setUrlPreporate] = useState<any>("");
  const [urlBuffer, setUrlBuffer] = useState<any>("");
  const [titleModal, setTileModal] = useState(''); //формирование строки для TouchableOpacity, чтобы не падало в вебе 

  const [statusPressGetExcel, setStatusPressGetExcel] = useState<boolean>(false);
  const [statusJournal, setStatusJournal] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.replace("/objs/objects")}>
          <Ionicons
            name="home-outline"
            size={25}
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      //setAccessToken(token);
      if (token !== null) {
        console.log("Retrieved token:", token);
        setAccessToken(token);
        //вызов getAuth для проверки актуальности токена
        //authUserAfterLogin();
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
  console.log(urlFetch !== "", "urlFetch");

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
    console.log(nameLink);
    setTileModal(`Ссылка для ${linkType} документации `)
    // Устанавливаем текущее значение ссылки в буфер
    switch (linkType) {
      case "рабочей":
        setUrlBuffer(urlWork);
       // setTileModal(`Ссылка для ${nameLink} документации `)
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

const saveF = async () => {
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
      `https://xn----7sbpwlcifkq8d.xn--p1ai:8443/excelForms/getMonitoring/${codeCCS}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // для Excel
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    
    // 3. Получаем бинарные данные
    const blob = await response.blob();
    const base64data = await blobToBase64(blob);

    // 4. Создаем файл с правильным расширением
    const fileUri = await StorageAccessFramework.createFileAsync(
      directoryUri,
      `Мониторинг ПНР по объекту ${capitalCSName}.xlsx`, // имя файла с расширением
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // MIME тип для Excel
    );
    

    // 5. Записываем бинарные данные в файл
    await FileSystem.writeAsStringAsync(fileUri, base64data, {
        encoding: FileSystem.EncodingType.Base64,
      });

    console.log("Файл успешно сохранен:", fileUri);
    if (Platform.OS === 'android') {
          await RNFetchBlob.android.actionViewIntent( fileUri, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        } else {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Открыть файл',
            UTI: 'org.openxmlformats.spreadsheetml.sheet' // или 'com.microsoft.excel.xlsx'
          });
        }
  /*  Alert.alert(
      '','Файл сохранен',
      
     // `Файл сохранен по пути: ${response.path()}`, //можно прописать, если предусмотреть возврат пути из saveFileWithSAF
      [
        {
          text: 'Открыть', //по-хорошему наверное здесь также поменять путь файла на открытие 
          onPress: () => RNFetchBlob.android.actionViewIntent(fileUri, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        },
        { text: 'OK' }
      ]
    );*/
  } catch (err) {
    console.error("Ошибка при сохранении файла:", err);
    Alert.alert(
      '','"Произошла ошибка:' + err,
      [
        { text: 'OK' }
      ]
    );
  } finally {
    setStatusPressGetExcel(false);
  }
};

const handleDownload = async (toFetch: string, fileName: string, extands: string, setF) => {
  setF(true);
    try {
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
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob); 

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download =  `${fileName} ${capitalCSName}.${extands}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
    } finally {
      setF(false);
    }
  };


 
  const str = `${capitalCSName}\nДокументация`

  return (
    <View style={{ flex: 1, backgroundColor: "white",  }}>
      <View style={{ flexDirection: "row", paddingTop: BOTTOM_SAFE_AREA + 15, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => router.replace("/objs/objects")}>
          <Ionicons
            name="home-outline"
            size={25}
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
        <TextInput
          style={{
            flex: 1,
            paddingTop: 0,
            fontWeight: 500,
            height: Math.max(42, inputHeight), // min: 42, max: 100
            fontSize: ts(20),
            textAlign: "center", // Горизонтальное выравнивание.
            textAlignVertical: "center", // Вертикальное выравнивание (Android/iOS).
          }}
          multiline
          editable={false}
          onContentSizeChange={(e) => {
            const newHeight = e.nativeEvent.contentSize.height;
            setInputHeight(Math.max(42, newHeight));
          }}
        >
            {str}
        </TextInput>
      </View>
<View style={{width: isDesktopWeb&& screenWidth>900? 900 : '100%', alignSelf: 'center',}}>
      <ScrollView>
        {isMobile? 
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
                  style={{ width: 100, height: 100, marginLeft: "15%" }}
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
                  style={{ width: 100, height: 100, marginLeft: "15%" }}
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
                  style={{ width: 100, height: 100, marginLeft: "15%" }}
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
                  style={{ width: 100, height: 100, marginLeft: "15%" }}
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
                  "https://drive.google.com/drive/folders/1JAYL2fHQ5aRSj3t9WPz8xHdaw8EYJ6jS?usp=sharing"
                );
              }}
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}
            >
              <Image
                style={{ width: 100, height: 100, marginLeft: -7 }}
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
              onPress={()=>[handleDownload(
                '/excelForms/getMonitoring/', 
                'Мониторинг ПНР по объекту', 
                'xlsx',
                setStatusPressGetExcel
              )
              //  getExcelFile(), setStatusPressGetExcel(true)
              ]}
             /* onPress={(event) => {
                handleLink(
                  event,
                  "https://drive.google.com/drive/folders/1JAYL2fHQ5aRSj3t9WPz8xHdaw8EYJ6jS?usp=sharing"
                );
              }}*/
            >
              <Image
                style={{ width: 100, height: 100, marginLeft: -7 }}
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
                  style={{ width: 100, height: 100, marginLeft: -7,  opacity: 0.5}}
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
          {statusJournal===false?
            <TouchableOpacity
              onPress={(event) => {
             handleDownload(
                '/journal/getJournal/', 
                'Журнал ПНР по объекту', 
                'docx',
                setStatusJournal
                );
              }}
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}
            >
              <Image
              
                style={{ width: 100, height: 104, marginLeft: -7, tintColor: "#0072C8",
                  filter: Platform.select({
                  web: 'brightness(0) saturate(100%) invert(31%) sepia(99%) saturate(2036%) hue-rotate(183deg) brightness(89%) contrast(101%)',
                  default: undefined
                })
                }}
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
              style={{ width: "50%", alignItems: "center", marginBottom: 15 }}
            >
              <Image
              
                style={{ width: 100, height: 104, marginLeft: -7, tintColor: "#0072C8",
                  filter: Platform.select({
                  web: 'brightness(0) saturate(100%) invert(31%) sepia(99%) saturate(2036%) hue-rotate(183deg) brightness(89%) contrast(101%)',
                  default: undefined
                })
                }}
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
        :
        <View style={styles.container}>
          <View style={{ flexDirection: "row",  }}>
            <TouchableOpacity
              onPress={(event) => {
                handleLink(event, urlWork);
              }}
              style={{ width: "33.3%",  alignItems: "center", marginBottom: 15 }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ width: 100, height: 100, marginLeft: "15%" }}
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
                  fontWeight: "500",
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
              style={{ width: "33.3%", alignItems: "center", marginBottom: 15 }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ width: 100, height: 100, marginLeft: "15%" }}
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
                  fontWeight: "500",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Заводская
              </Text>
            </TouchableOpacity>
            
            {statusPressGetExcel===false? 
            <TouchableOpacity
              style={{ width: "33.3%", alignItems: "center", marginBottom: 15 }}
              onPress={()=>[handleDownload(
                '/excelForms/getMonitoring/', 
                'Мониторинг ПНР по объекту', 
                'xlsx',
                setStatusPressGetExcel
              )]}
             /* onPress={(event) => {
                handleLink(
                  event,
                  "https://drive.google.com/drive/folders/1JAYL2fHQ5aRSj3t9WPz8xHdaw8EYJ6jS?usp=sharing"
                );
              }}*/
            >
              <Image
                style={{ width: 100, height: 100, marginLeft: -7 }}
                source={require("../../assets/images/monitoring.svg")}
              />
              <Text
                style={{
                  fontSize: ts(14),
                  color: "#0072C8",
                  fontWeight: "500",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Мониторинг ПНР
              </Text>
            </TouchableOpacity>
          :
            <View
              style={{ width: "33.3%", alignItems: "center", marginBottom: 15 }}>
              <Image
                  style={{ width: 100, height: 100, marginLeft: -7,  opacity: 0.5}}
                  source={require("../../assets/images/monitoring.svg")}
                />
                <Text
                  style={{
                    fontSize: ts(14),
                    color: "#0072C8",
                    fontWeight: "500",
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
            <TouchableOpacity
              onPress={(event) => {
                handleLink(event, urlPreporate);
              }}
              style={{ width: "33.3%", alignItems: "center", marginBottom: 15 }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ width: 100, height: 100, marginLeft: "15%" }}
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
                  fontWeight: "500",
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
              style={{ width: "33.3%", alignItems: "center", marginBottom: 15 }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ width: 100, height: 100, marginLeft: "15%" }}
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
                  fontWeight: "500",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Исполнительная
              </Text>
            </TouchableOpacity>
 {statusJournal===false?
            <TouchableOpacity
              onPress={(event) => {
             handleDownload(
                '/journal/getJournal/', 
                'Журнал ПНР по объекту', 
                'docx',
                setStatusJournal
                );
              }}
              style={{ width: "33.3%", alignItems: "center", marginBottom: 15 }}
            >
              <Image
              
                style={{ width: 100, height: 104, marginLeft: -7, tintColor: "#0072C8",  
                  filter: Platform.select({
      web: 'brightness(0) saturate(100%) invert(31%) sepia(99%) saturate(2036%) hue-rotate(183deg) brightness(89%) contrast(101%)',
      default: undefined
    }),}}
                source={require("../../assets/images/journal.svg")}
              />

              <Text
                style={{
                  fontSize: ts(14),
                  color: "#0072C8",
                  fontWeight: "500",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Журнал ПНР
              </Text>
            </TouchableOpacity>
            :
             <View
              style={{ width: "33.3%", alignItems: "center", marginBottom: 15 }}
            >
              <Image
              
                style={{ width: 100, height: 104, marginLeft: -7, tintColor: "#0072C8",  
                  filter: Platform.select({
      web: 'brightness(0) saturate(100%) invert(31%) sepia(99%) saturate(2036%) hue-rotate(183deg) brightness(89%) contrast(101%)',
      default: undefined
    }),}}
                source={require("../../assets/images/journal.svg")}
              />

              <Text
                style={{
                  fontSize: ts(14),
                  color: "#0072C8",
                  fontWeight: "500",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Журнал ПНР
              </Text>
            </View>
}
          </View>
          <View style={{ flexDirection: "row" }}>
<TouchableOpacity
              onPress={(event) => {
                handleLink(
                  event,
                  "https://drive.google.com/drive/folders/1JAYL2fHQ5aRSj3t9WPz8xHdaw8EYJ6jS?usp=sharing"
                );
              }}
              style={{ width: "33.3%", alignItems: "center", marginBottom: 15 }}
            >
              <Image
                style={{ width: 100, height: 100, marginLeft: -7 }}
                source={require("../../assets/images/standartDocs.svg")}
              />

              <Text
                style={{
                  fontSize: ts(14),
                  color: "#0072C8",
                  fontWeight: "500",
                  textAlign: "center",
                  marginLeft: -7,
                }}
              >
                Нормативная
              </Text>
            </TouchableOpacity>

            
          </View>
          <View style={{ flexDirection: "row" }}>
            
            </View>
        </View> }
      </ScrollView>
   
</View>
<TouchableOpacity onPress={()=> setModalStatus(false)}>
      <Modal
        animationType="fade" // Можно использовать 'slide', 'fade' или 'none'
        transparent={true} // Установите true, чтобы сделать фон полупрозрачным
        visible={modalStatus}
        onRequestClose={() => setModalStatus(false)} // Для Android
      >
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
            </TouchableOpacity>
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
                    lineHeight: ts(19),
                    fontSize: ts(14),
                    color: "#1A4072",
                  }}
                  editable={false}
                >
                  {titleModal}
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
      </Modal>
      </TouchableOpacity>
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
