import CustomButton from "@/components/CustomButton";
import Note from "@/components/Note";
import SystemsForTwo from "@/components/SystemsForTwo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
import useDevice from '../../hooks/useDevice';
//import type { PropsWithChildren } from "react";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import type { Structure } from "./structure";

type UserInfo = {
  id: number;
  organisation: string;
  fullName: string;
  phoneNumber: string;
  registrationDate: string;
};

type Users = {
  username: string;
  id: string;
  isEnabled: boolean;
  role: string;
  userInfo: UserInfo; // Теперь это объект, а не массив
}; 

type Note = {
  commentId: number; //id замечания , генерируется на сервере
  serialNumber: number; //номер замечания
  subObject: string;
  systemName: string;
  description: string;
  commentStatus: string;
  commentCategory: string;
  startDate: string;
  endDatePlan: string;
  endDateFact: string;
  commentExplanation: string; //комментарий к замечанию
  //userName: string;//не увидела в бд у Сергея
  iinumber: number; //номер акта ИИ
};

const DirectionLayout = () => {
  const { isMobile, isDesktopWeb, isMobileWeb, screenWidth } = useDevice();
    
  const BOTTOM_SAFE_AREA =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const router = useRouter();
  const currentDate = new Date(); //console.log(currentDate);
  const [accessToken, setAccessToken] = useState<any>("");
  const [inputHeight, setInputHeight] = useState(40);
  const { codeCCS } = useGlobalSearchParams(); //получение кода ОКС
  const { capitalCSName } = useGlobalSearchParams(); //получение наименование ОКС
  const [chooseSubobject, setChooseSubobject] = useState("");
  const [chooseSystem, setChooseSystem] = useState("");
  const [chooseUser, setChooseUser] = useState<string>("");
  const [listSubObj, setListSubObj] = useState<ListToDrop[]>([]);
  const [listSystem, setListSystem] = useState<ListToDrop[]>([]);
  const [listUsers, setListUsers] = useState<ListToDrop[]>([]);
  const [status, setStatus] = useState(true);
  const [statusStructure, setStatusStructure] = useState(true);

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return fontSize / fontScale;
  };

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
      if (token !== null) {
        setAccessToken(token);
      } else {
        router.push("/sign/sign_in");
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Note[]>([]);
  const [originalData, setOriginalData] = useState<Note[]>([]);
  const [structure, setStructure] = useState<Structure[]>([]);
  const [users, setUsers] = useState<Users[]>([]);

  const getNotes = async () => {
    try {
      const response = await fetch(
        "https://xn----7sbpwlcifkq8d.xn--p1ai:8443/journal/getEntryList/" +
          codeCCS,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      setData(json);
      setOriginalData(json);
      console.log("ResponsegetEntryList:", response);
      console.log("ResponsegetEntryList:", json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStructure = async () => {
    try {
      const response = await fetch(
        "https://xn----7sbpwlcifkq8d.xn--p1ai:8443/commons/getStructureCommonInf/" +
          codeCCS,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      setStructure(json);
      console.log("ResponseSeeStructure:", response);
    } catch (error) {
      console.error(error);
    }
  };
  const getUsers = async () => {
    try {
      const response = await fetch(
        "https://xn----7sbpwlcifkq8d.xn--p1ai:8443/user/getUsers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("ResponseGetUsers:", response);
      const json = await response.json();
      setUsers(json);
      console.log(json)
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (codeCCS && accessToken && status) {
      getNotes();
      getUsers();
      getStructure();
      setStatus(false);
    }
  }, [codeCCS, accessToken, status]); 

  useEffect(() => {
    if (structure.length > 0) {
      const buf = structure.map((item) => ({
        label: item.subObjectName,
        value: item.subObjectName,
      }));
      setListSubObj(buf);

      const allSystemNames = structure.flatMap((structure) =>
        structure.data.map((item) => item.systemName)
      );
      const uniqueSystemNames = [...new Set(allSystemNames)];
      const systemList = uniqueSystemNames.map((system) => ({
        label: system,
        value: system,
      }));
      setListSystem(systemList);
    }
  }, [structure]); // Только structure как зависимость

  useEffect(() => {
    if (users.length > 0) {
      const buf = users.map(user => ({
        label: user.userInfo.fullName,
        value: String(user.id)
      }));
      setListUsers(buf);
    }
  }, [users]); // Только users как зависимость

  // Отдельный эффект для добавления "Все варианты" в списки
  useEffect(() => {
    if (chooseSystem !== "" && chooseSystem !== "Все системы" && !listSystem.some((item) => item.value === "Все системы")) {
      setListSystem(prev => [...prev, { label: "Все системы", value: "Все системы" }]);
    }
  }, [chooseSystem, listSystem]);

  useEffect(() => {
    if (chooseSubobject !== "" && chooseSubobject !== "Все подобъекты" && !listSubObj.some((item) => item.value === "Все подобъекты")) {
      setListSubObj(prev => [...prev, { label: "Все подобъекты", value: "Все подобъекты" }]);
    }
  }, [chooseSubobject, listSubObj]);

  useEffect(() => {
    if (chooseUser !== "" && chooseUser !== "Все специалисты" && !listUsers.some((item) => item.value === "Все специалисты")) {
      setListUsers(prev => [...prev, { label: "Все специалисты", value: "Все специалисты" }]);
    }
  }, [chooseUser, listUsers]);

  const filteredData = useMemo(() => {
    let result = originalData;

    // Фильтрация по подобъекту
    if (chooseSubobject && chooseSubobject !== "Все подобъекты") {
      result = result.filter((item) => item.subObject === chooseSubobject);
    }

    // Фильтрация по системе
    if (chooseSystem && chooseSystem !== "Все системы") {
      result = result.filter((item) => item.system === chooseSystem);
    }

    // Фильтрация по статусу
    if (chooseUser && chooseUser !== "Все специалисты") {
      result = result.filter((item) => item.user === chooseUser); {/**изменить поле по которому сравниваю */}
    }

    return result;
  }, [originalData, chooseSubobject, chooseSystem, chooseUser]);

  const str = `${capitalCSName}\nЖурнал ПНР`

  // Обновление данных при изменении фильтров
  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);
console.log(chooseUser);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          // justifyContent: 'center', flexDirection: 'row', height: 80, padding: 20, alignSelf: 'flex-start', alignItems: 'stretch', justifyContent: 'space-around',
        }}
      >
        <View
          style={{ flexDirection: "row", paddingTop: BOTTOM_SAFE_AREA + 15, width: '100%' }}
        >
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
                    width: '100%',
                    paddingTop:  0,
                    paddingBottom: 8,
                    fontWeight: 500,
                    height: Math.max(42,inputHeight), // min: 42, max: 100
                    fontSize:  ts(20),
                    textAlign: 'center',          // Горизонтальное выравнивание.
                    textAlignVertical: 'center',  // Вертикальное выравнивание (Android/iOS).
                  }}
                  multiline
                  editable={false}
                  onContentSizeChange={e => {
                    const newHeight = e.nativeEvent.contentSize.height;
                    setInputHeight(Math.max(42, newHeight));
                  }}
                >
                  {str}
                </TextInput>
        </View>
        
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: isDesktopWeb && screenWidth>900? 900 :'98%',
           // position: 'absolute'
          }}
        >
          <SystemsForTwo
            list={listSubObj}
            nameFilter={`Все ${'\n'}подобъекты`}
            width={ isDesktopWeb ? 130 : 80}
            onChange={(system) => setChooseSubobject(system)}
          />
          <SystemsForTwo
            list={listSystem}
            nameFilter="Все системы"
            width={isDesktopWeb? 130 : 80}
            onChange={(system) => setChooseSystem(system)}
          />
          <SystemsForTwo
            list={listUsers}
            nameFilter={`Все ${'\n'}специалисты`}
            width={isDesktopWeb? 130 : 80}
            onChange={(status) => setChooseUser(status)}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            width: isDesktopWeb && screenWidth>900? 900 :'98%',
            height: 32,
            paddingTop: 15,
            //justifyContent: "space-between",
          }}
        >
            <View style = {{width: '20%'}}>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Дата</Text>
          </View>
          
          <View style = {{width: '80%'}}>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Краткое описание работ</Text>
        </View>

       {/*} <View style = {{width: '20%'}}>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Подобъект</Text>
        </View>

        <View style = {{width: '20%'}}>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Система</Text>
        </View>*/}
        </View>

        

        <View style={{ flex: 15, marginTop: 12,  width: isDesktopWeb && screenWidth>900? 900 :'98%', }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              style={{  width: '100%', }}
              data={data}
              keyExtractor={({ commentId }) => commentId}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() => {
                    router.push({
                      pathname: "/jour/see_jour",
                      params: {
                        capitalCSName: capitalCSName,
                        post: item.id,
                        codeCCS: codeCCS,
                      },
                    });
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#E0F2FE",
                      flexDirection: "row",
                      width: "98%",
                      height: 42,
                      alignSelf: 'center',
                      justifyContent: "center",
                      marginBottom: 15,
                      borderRadius: 8,
                    }}
                  >
                    <View style={{ width: "20%", justifyContent: "center" }}>
                      <Text
                        style={{
                          fontSize: ts(14),
                          color: "#334155", textAlign: 'center' 
                        }}
                      >
                        
                        {item.date}{/**это должна быть дата */}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: '80%',
                        marginStart: 2,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                      numberOfLines={2}
                        style={{
                          fontSize: ts(14),
                          color: "#334155",
                          textAlign: "left",
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>
                {/*}    <View
                      style={{
                        width: '20%',
                        marginStart: 2,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                      numberOfLines={2}
                        style={{
                          fontSize: ts(14),
                          color: "#334155",
                          textAlign: "center",
                        }}
                      >
                        {item.subObject}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '20%',
                        marginStart: 2,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                      numberOfLines={2}
                        style={{
                          fontSize: ts(14),
                          color: "#334155",
                          textAlign: "center",
                        }}
                      >
                        {item.system}
                      </Text>
                    </View>*/}
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          )}
        </View>

        <CustomButton
          title="Добавить краткое описание работ"
          handlePress={() =>
            router.push({
              pathname: "/jour/create_jour",
              params: { codeCCS: codeCCS, capitalCSName: capitalCSName },
            })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "normal",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  separator: {
    marginVertical: 5,

    height: 1,
    width: "100%",
  },
  box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    //alignItems: 'center',
  },
  button: {
    /* paddingVertical: 6,
    paddingBottom: 6,
    paddingRight: 8,
    paddingLeft: 8,*/
    backgroundColor: "#E0F2FE",
    marginHorizontal: "10%",
    marginBottom: 16,
    width: 103,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
  },
  //background: #F8FAFC;

  selected: {
    backgroundColor: "#E0F2FE",
    // justifyContent: 'center',
    borderWidth: 0,
  },
  buttonLabel: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    color: "#334155",
    textAlign: "center",
  },
  selectedLabel: {
    color: "#334155",
    //textAlign: 'center',
  },
  label: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 24,
  },
});

export default DirectionLayout;
