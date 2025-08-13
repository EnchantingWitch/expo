import CustomButton from "@/components/CustomButton";
import HeaderForTabs from "@/components/HeaderForTabs";
import SystemsForTwo from "@/components/SystemsForTwo";
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

const DirectionLayout = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<any>("");
  const { codeCCS } = useGlobalSearchParams(); //получение кода ОКС
  const { capitalCSName } = useGlobalSearchParams(); //получение наименование ОКС
  const [chooseSubobject, setChooseSubobject] = useState("");
  const [chooseSystem, setChooseSystem] = useState("");
  const [chooseUser, setChooseUser] = useState<string>("");
  const [listSubObj, setListSubObj] = useState<ListToDrop[]>([]);
  const [listSystem, setListSystem] = useState<ListToDrop[]>([]);
  const [listUsers, setListUsers] = useState<ListToDrop[]>([]);
  const [status, setStatus] = useState(true);

  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return fontSize / fontScale;
  };

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
  const [data, setData] = useState<[]>([]);
  const [originalData, setOriginalData] = useState<[]>([]);
  const [structure, setStructure] = useState<Structure[]>([]);
  const [users, setUsers] = useState<[]>([]);

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
      setData(json.journal);
      setOriginalData(json.journal);
      setUsers(json.users);
      console.log("ResponsegetEntryList:", response);
      //console.log("ResponsegetEntryList:", json);
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
  }, [structure]); 
  
  useEffect(() => {
    if (users.length > 0) {
      setListUsers([...new Set(users)].map(user => ({
        label: user,
        value: user
      })));
    }
  }, [users]);

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (codeCCS && accessToken && status) {
      getNotes();
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
  }, [structure]); 

  useEffect(() => {
    if (users.length > 0) {
      setListUsers([...new Set(users)].map(user => ({
        label: user,
        value: user
      })));
    }
  }, [users]); 

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

  // Обновление данных при изменении фильтров
  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",}}
      >
        <HeaderForTabs nameTab="Журнал ПНР" capitalCSName={capitalCSName}/>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "96%",
          }}
        >
          <SystemsForTwo
            list={listSubObj}
            nameFilter={`Все ${'\n'}подобъекты`}
            width={118}
            onChange={(system) => setChooseSubobject(system)}
          />
          <SystemsForTwo
            list={listSystem}
            nameFilter="Все системы"
            width={100}
            onChange={(system) => setChooseSystem(system)}
          />
          <SystemsForTwo
            list={listUsers}
            nameFilter={`Все ${'\n'}специалисты`}
            width={118}
            onChange={(status) => setChooseUser(status)}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "98%",
            height: 32,
            paddingTop: 6,
          }}
        >
            <View style = {{width: '25%'}}>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Дата</Text></View>
          <View style = {{width: '75%'}}>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Краткое описание работ</Text></View>
        </View>

        <View style={{ flex: 15, marginTop: 12 }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              style={{ width: "100%" }}
              data={data}
              keyExtractor={({ id }) => id}
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
                      height: 37,
                      alignSelf: 'center',
                      justifyContent: "center",
                      marginBottom: "5%",
                      borderRadius: 8,
                    }}
                  >
                    <View style={{ width: "25%", justifyContent: "center" }}>
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
                        width: '75%',
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

export default DirectionLayout;
