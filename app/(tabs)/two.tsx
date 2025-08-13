import CustomButton from "@/components/CustomButton";
import HeaderForTabs from "@/components/HeaderForTabs";
import Note from "@/components/Note";
import SystemsForTwo from "@/components/SystemsForTwo";
import useDevice from "@/hooks/useDevice";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from "react-native";
import type { Structure } from "./structure";

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
  iinumber: number; //номер акта ИИ
};

const DirectionLayout = () => {
  const { isDesktopWeb, screenWidth } = useDevice();

  const router = useRouter();
  const [accessToken, setAccessToken] = useState<any>("");
  const { codeCCS } = useGlobalSearchParams(); //получение кода ОКС
  const { capitalCSName } = useGlobalSearchParams(); //получение наименование ОКС
  const [chooseSubobject, setChooseSubobject] = useState("");
  const [chooseSystem, setChooseSystem] = useState("");
  const [chooseStatus, setChooseStatus] = useState<string>("Все");
  const [listSubObj, setListSubObj] = useState<ListToDrop[]>([]);
  const [listSystem, setListSystem] = useState<ListToDrop[]>([]);
  const [status, setStatus] = useState(true);
  const [statusStructure, setStatusStructure] = useState(true);
  const statusList = [
    { label: "Все", value: "Все" },
    { label: "Устранено", value: "Устранено" },
    { label: "Не устранено", value: "Не устранено" },
  ];

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return fontSize / fontScale;
  };

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
  const [data, setData] = useState<Note[]>([]);
  const [originalData, setOriginalData] = useState<Note[]>([]);
  const [structure, setStructure] = useState<Structure[]>([]);

  const getNotes = async () => {
    try {
      const response = await fetch(
        "https://xn----7sbpwlcifkq8d.xn--p1ai:8443/comments/getAllComments/" +
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
      console.log("ResponseGetNotes:", response);
     // console.log("ResponseGetNotes:", json);
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

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (codeCCS && accessToken && status) {
      getNotes();
      //getStructure();
      setStatus(false);
    }
    if (data.length > 0 && statusStructure) {
      //getNotes();
      getStructure();
      setStatusStructure(false);
    }
    //формирование выпадающего списка для подобъекта
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
  }, [codeCCS, accessToken, structure, data, status]);

  // Добавление сброса выбранного значения в выпадающий список
  useEffect(() => {
    if (
      chooseSystem !== "" &&
      chooseSystem !== "Все системы" &&
      !listSystem.some((item) => item.value === "Все системы")
    ) {
      const item = { label: "Все системы", value: "Все системы" };
      setListSystem((prev) => [...prev, item]);
      //console.log("new ListSystem", listSystem);
    }
    if (
      chooseSubobject !== "" &&
      chooseSubobject !== "Все подобъекты" &&
      !listSubObj.some((item) => item.value === "Все подобъекты")
    ) {
      const item = { label: "Все подобъекты", value: "Все подобъекты" };
      setListSubObj((prev) => [...prev, item]);
      //console.log("new ListSystem", listSubObj);
    }
  }, [chooseSystem, listSystem, chooseSubobject, listSubObj]);

  const filteredData = useMemo(() => {
    let result = originalData;

    // Фильтрация по подобъекту
    if (chooseSubobject && chooseSubobject !== "Все подобъекты") {
      result = result.filter((item) => item.subObject === chooseSubobject);
    }

    // Фильтрация по системе
    if (chooseSystem && chooseSystem !== "Все системы") {
      result = result.filter((item) => item.systemName === chooseSystem);
    }

    // Фильтрация по статусу
    if (chooseStatus && chooseStatus !== "Все") {
      result = result.filter((item) => item.commentStatus === chooseStatus);
    }

    return result;
  }, [originalData, chooseSubobject, chooseSystem, chooseStatus]);

  // Обновление данных при изменении фильтров
  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center"}}>

        <HeaderForTabs capitalCSName={capitalCSName} nameTab="Замечания"/>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: isDesktopWeb&& screenWidth>900? 900 : '96%',
          }}
        >
          <SystemsForTwo
            list={listSubObj}
            nameFilter="Все подобъекты"
            width={isDesktopWeb? 130: 80}
            onChange={(system) => setChooseSubobject(system)}
          />
          <SystemsForTwo
            list={listSystem}
            nameFilter="Все системы"
            width={isDesktopWeb? 130: 80}
            onChange={(system) => setChooseSystem(system)}
          />
          <SystemsForTwo
            list={statusList}
            nameFilter="Все"
            width={isDesktopWeb? 130: 80}
            onChange={(status) => setChooseStatus(status)}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            width: isDesktopWeb && screenWidth>900? 900 : '95%',
            height: 32,
            paddingTop: 12,
          }}
        >
          <View style = {{width: '12%'}}>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center'}}>№</Text>
          </View>
          <View style = {{width: '73%'}}>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Содержание</Text>
          </View>
          <View style = {{width: '14%' }}>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Статус</Text>
          </View>
        </View>

        <View style={{ flex: 15, marginTop: 12, width: isDesktopWeb&& screenWidth>900? 900 : '96%', }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              style={{ width: "100%" }}
              data={data}
              keyExtractor={({ commentId }) => commentId}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() => {
                    router.push({
                      pathname: "/notes/see_note",
                      params: {
                        capitalCSName: capitalCSName,
                        post: item.commentId,
                        codeCCS: codeCCS,
                      },
                    });
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#E0F2FE",
                      flexDirection: "row",
                      width: "100%",
                      height: 42,
                      justifyContent: "center",
                      marginBottom: 15,
                      borderRadius: 8,
                    }}
                  >
                    <View style={{ width: "12%", justifyContent: "center" }}>
                      <Text
                        style={{
                          fontSize: ts(14),
                          color: "#334155",
                          textAlign: "center",
                        }}
                      >
                        {item.serialNumber}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: "75%",
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

                    <View
                      style={{
                        width: "12%",
                        justifyContent: "center",
                        alignItems: 'center',
                      }}
                    >
                      {item.commentStatus == "Устранено" ? (
                        <Ionicons name="checkbox" size={25} color="#0072C8" />
                      ) : (
                        ""
                      )}
                      {item.commentStatus == "Устранено с просрочкой" ? (
                        <Ionicons name="checkbox" size={25} color="#0072C8" />
                      ) : (
                        ""
                      )}
                      {item.commentStatus == "Не устранено" ? (
                        <Ionicons name="square" size={25} color="#F0F9FF" />
                      ) : (
                        ""
                      )}    
                      {item.commentStatus == "Не устранено с просрочкой" ? (
                        <Ionicons name="square" size={25} color="#F0F9FF" />
                      ) : (
                        ""
                      )}

                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          )}
        </View>

        <CustomButton
          title="Добавить замечание"
          handlePress={() =>
            router.push({
              pathname: "/notes/create_note",
              params: { codeCCS: codeCCS, capitalCSName: capitalCSName },
            })
          }
        />
      </View>
    </View>
  );
};

export default DirectionLayout;
