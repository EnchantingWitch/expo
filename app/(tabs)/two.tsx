import CustomButton from "@/components/CustomButton";
import HeaderForTabs from "@/components/HeaderForTabs";
import SystemsForTwo from "@/components/SystemsForTwo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalSearchParams, useRouter } from "expo-router";
import type { PropsWithChildren } from "react";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
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
      //console.log("ResponseGetNotes:", json);
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
      setStatus(false);
    }
    if (data.length > 0 && statusStructure) {
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
      console.log("new ListSystem", listSystem);
    }
    if (
      chooseSubobject !== "" &&
      chooseSubobject !== "Все подобъекты" &&
      !listSubObj.some((item) => item.value === "Все подобъекты")
    ) {
      const item = { label: "Все подобъекты", value: "Все подобъекты" };
      setListSubObj((prev) => [...prev, item]);
      console.log("new ListSystem", listSubObj);
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
          alignItems: "center"}}
      >
        <HeaderForTabs nameTab="Замечания" capitalCSName={capitalCSName}/>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "96%",
          }}
        >
          <SystemsForTwo
            list={listSubObj}
            nameFilter="Все подобъекты"
            width={135}
            onChange={(system) => setChooseSubobject(system)}
          />
          <SystemsForTwo
            list={listSystem}
            nameFilter="Все системы"
            width={100}
            onChange={(system) => setChooseSystem(system)}
          />
          <SystemsForTwo
            list={statusList}
            nameFilter="Все"
            width={100}
            onChange={(status) => setChooseStatus(status)}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "96%",
            height: 32,
            paddingTop: 6,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: ts(14), color: "#1E1E1E" }}>№</Text>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E" }}>Содержание</Text>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E" }}>Статус</Text>
        </View>

        <View style={{ flex: 15, marginTop: 12 }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              style={{ width: "96%" }}
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
                      height: 37,
                      justifyContent: "center",
                      marginBottom: "5%",
                      borderRadius: 8,
                    }}
                  >
                    <View style={{ width: "15%", justifyContent: "center" }}>
                      <Text
                        style={{
                          fontSize: ts(14),
                          color: "#334155",
                          textAlign: "left",
                        }}
                      >
                        {item.serialNumber}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: "75%",
                        marginStart: 2,
                        justifyContent: "center",
                      }}
                    >
                      <Text
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
                        width: "7%",
                        marginStart: 2,
                        justifyContent: "center",
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
                      )}{/**color="#F59E0B" */}

                      {/**checkmark-circle-outline , close-circle-outline, square-outline*/}
                      {/*} <Text style={{ fontSize: ts(16), color: '#334155', textAlign: 'center'  }}>{item.commentStatus} </Text>*/}
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

type PreviewLayoutProps = PropsWithChildren<{
  // label: string;
  // values: string[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}>;

type PreviewNameProps = PropsWithChildren<{
  values: string[];
}>;

const PreviewName = ({
  //childern,
  values,
}: PreviewNameProps) => (
  <View style={styles.row}>
    {values.map((value) => (
      <Text key={value} style={styles.title}>
        {value}
      </Text>
    ))}
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
      {values.map((value) => (
        <TouchableOpacity
          key={value}
          onPress={() => setSelectedValue(value)}
          style={[styles.button, selectedValue === value && styles.selected]}
        >
          <Text
            style={[
              styles.buttonLabel,
              selectedValue === value && styles.selectedLabel,
            ]}
          >
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View
      style={styles.separator}
      lightColor="#eee"
      darkColor="rgba(255,255,255,0.1)"
    />
    <View style={[styles.container]}>{children}</View>
  </View>
);

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
  },
  button: {
    backgroundColor: "#E0F2FE",
    marginHorizontal: "10%",
    marginBottom: 16,
    width: 103,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
  },
  selected: {
    backgroundColor: "#E0F2FE",
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
  },
  label: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 24,
  },
});

export default DirectionLayout;
