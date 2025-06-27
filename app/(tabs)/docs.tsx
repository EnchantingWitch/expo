import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
import * as Sharing from 'expo-sharing';
import { openBrowserAsync } from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
} from "react-native";

export default function Docs() {
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
  const [saveLinkStatus, setSaveLinkStatus] = useState<boolean>(false);
  //router.setParams({ ID: ID });
  const [urlWork, setUrlWork] = useState<any>("");
  const [urlOperate, setUrlOperate] = useState<any>("");
  const [urlExecute, setUrlExecute] = useState<any>("");
  const [urlPreporate, setUrlPreporate] = useState<any>("");
  const [urlBuffer, setUrlBuffer] = useState<any>("");

  const [statusPressGetExcel, setStatusPressGetExcel] = useState<boolean>(false);

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

  const getExcelFile = async () => {
    try {
      const response = await fetch(
        "https://xn----7sbpwlcifkq8d.xn--p1ai:8443/excelForms/getMonitoring/" + codeCCS,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Accept": "application/octet-stream",
          },
          
        }
      );
      console.log("getMonitoring", response);

      const blob = await response.blob();
      console.log("getMonitoring", blob);
      const base64data = await blobToBase64(blob);

      const fileUri = `${FileSystem.documentDirectory}Мониторинг ПНР по объекту ${capitalCSName}.xlsx`; // .pdf, .jpg и т.д.
      //const fileUri = `${FileSystem.documentDirectory}Мониторинг ПНР по объекту ${capitalCSName}.xlsx`; // .pdf, .jpg и т.д.
      await FileSystem.writeAsStringAsync(fileUri, base64data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("Файл сохранен:", fileUri);

    // Открываем файл (например, через expo-sharing)
      await Sharing.shareAsync(fileUri);

      
    } catch (error) {
      console.error(error);
    } finally {
      setStatusPressGetExcel(false);
    }
  };



  const saveFile = async () => {
    try{
    if (Platform.OS === 'ios') {
          await MediaLibrary.saveToLibraryAsync("../../assets/files/DOC.xlsx");
        } else {
          const asset = await MediaLibrary.createAssetAsync("../../assets/files/DOC.xlsx");
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        }
  
        //await showDownloadNotification(filename);
        Alert.alert('Успех', 'Файл сохранен');
      }
      catch (error) {
              console.error('Ошибка сохранения:', error);
              //await showErrorNotification(error);
              Alert.alert('Ошибка', 'Не удалось сохранить файл');
            }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flexDirection: "row", paddingTop: BOTTOM_SAFE_AREA + 15 }}>
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
          <Text style={{ fontSize: ts(20), color: "#1E1E1E", fontWeight: 500 }}>
            {capitalCSName}
            {"\n"}
            <Text
              style={{
                fontSize: ts(20),
                color: "#1E1E1E",
                fontWeight: 500,
                paddingTop: 15,
              }}
            >
              Документация
            </Text>
          </Text>
        </TextInput>
      </View>

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
              onPress={()=>[getExcelFile(), setStatusPressGetExcel(true)]}
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
        </View>
      </ScrollView>

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
