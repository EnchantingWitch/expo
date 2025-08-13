import CustomButton from "@/components/CustomButton";
import CustomModal from "@/components/CustomModal";
import HeaderForTabs from "@/components/HeaderForTabs";
import ListOfSubobj from '@/components/ListOfOrganizations';
import ListOfSystem from "@/components/ListOfSystem";
import MultilineTextInput from "@/components/MultilineTextInput";
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
import useDevice from '../../hooks/useDevice';
import type { Structure } from "./structure";

const DirectionLayout = () => {
  const { isDesktopWeb, screenWidth, isMobileWeb } = useDevice();
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

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<[]>([]);
  const [originalData, setOriginalData] = useState<[]>([]);
  const [structure, setStructure] = useState<Structure[]>([]);
  const [users, setUsers] = useState<[]>([]);

  //МОДАЛЬНОЕ ОКНО
  const [visibleCustomModal, setVisibleCustomModal] = useState(false);
  const [modalChange, setModalChange] = useState(false);//переход в режим редактирования в модальном окне
  //значения для модального окна
  const [number, setNumber] = useState('');
  const [date, setDate] = useState('');
  const [subobj, setSubobj] = useState('');
  const [system, setSystem] = useState('');
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState('');
  const [organisation, setOrganisation] = useState('');
  //вспомогательные состояния для компонентов в модальном окне
  const [disabled, setDisabled] = useState(false); //для кнопки
  const [listSystemFromSubobj, setListSystemFromSubobj] = useState<[]>([]) //выпадающий списк для систем
  const [statusSystemModal, setStatusSystemModal] = useState(false); //для отправки в компонент списка для выпадающего списка систем
 
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
      setUsers(json.users)
      console.log('json.users', json.users);
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
  }, [structure]); // Только structure как зависимость

  useEffect(() => {
    if (users.length > 0) {
      setListUsers([...new Set(users)].map(user => ({
        label: user,
        value: user
      })));
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

    // Фильтрация по специалисту
    if (chooseUser && chooseUser !== "Все специалисты") {
      result = result.filter((item) => item.user === chooseUser); {/**изменить поле по которому сравниваю */}
    }

    return result;
  }, [originalData, chooseSubobject, chooseSystem, chooseUser]);

  // Обновление данных при изменении фильтров
  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  //изменение статуса при закрытии модального окна
  useEffect(() => {
    if(!visibleCustomModal){
    setStatusSystemModal(false);}
  }, [!visibleCustomModal]);
  
    const updateComment = async () => {
      setDisabled(true);
      try {
        let response = await fetch(`https://xn----7sbpwlcifkq8d.xn--p1ai:8443/journal/updateEntry`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: number,
            description: description,
            subObject: subobj,
            system: system,
            capitalCS: capitalCSName,
            date: date.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
          }),
        });
        console.log('updateComment', response);
      } catch (error) {
        setStatus(true);
        setVisibleCustomModal(false)
        setDisabled(false);
        setStatusSystemModal(false)//для сброса выпадающего списка систем
        console.error('Ошибка при сохранении данных:', error);
      } finally{
        setStatus(true);
        setVisibleCustomModal(false)
        setDisabled(false);
        setStatusSystemModal(false)//для сброса выпадающего списка систем
        //setModalChange(false);
      }
  
    };

    const deleteNote = async () => {
        setDisabled(true);
        try {
          let response = await fetch('https://xn----7sbpwlcifkq8d.xn--p1ai:8443/journal/deleteEntry/'+number, {
              method: "DELETE",
              headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
          });
        console.log('ResponseDeleteEntry:', response);
          setDisabled(false);
        } finally {
         setStatus(true);
        setVisibleCustomModal(false)
        setDisabled(false);
        setStatusSystemModal(false)//для сброса выпадающего списка систем
        }
      }

  // Для систем
useEffect(() => {
  if (visibleCustomModal && subobj && structure.length > 0) {
    const filtered = structure.find(item => item.subObjectName === subobj);
    if (filtered) {
      const systemList = filtered.data.map(system => ({
        label: system.systemName,
        value: system.systemName
      }));
      setListSystemFromSubobj(systemList);
      setStatusSystemModal(true);
    }
  }
}, [subobj, structure, visibleCustomModal]); // Добавили visibleCustomModal в зависимости

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center"
        }}
      >
        <HeaderForTabs nameTab="Журнал ПНР" capitalCSName={capitalCSName}/>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: isDesktopWeb && screenWidth>900? 900 :'98%',
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
          }}
        >
            <View style = {{width: '20%'}}>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Дата</Text>
          </View>
          
          <View style = {{width: '80%'}}>
          <Text style={{ fontSize: ts(14), color: "#1E1E1E", textAlign: 'center' }}>Краткое описание работ</Text>
        </View>
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
                  {isDesktopWeb?
                    [setVisibleCustomModal(true),
                    setNumber(item.id),
                    setDate(item.date),
                    setSubobj(item.subObject),
                    setSystem(item.system),
                    setDescription(item.description),
                    setFullName(item.user),
                    setOrganisation(item.organisation)]
                    :
                    router.push({
                      pathname: "/jour/see_jour",
                      params: {
                        capitalCSName: capitalCSName,
                        post: item.id,
                        codeCCS: codeCCS,
                      },
                    });
                  }
                }}
                >
                  <View
                    style={{
                      backgroundColor: "#E0F2FE",
                      flexDirection: "row",
                      width: "100%",
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
               
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          )}
          <CustomModal 
            setReadOnlyToFrame={(value)=> setModalChange(value)}
            initiallyReadOnly={!modalChange}
            visible={visibleCustomModal}
            onRequestClose={() => setVisibleCustomModal(false)}
            onValuesChange={(values) => {
              setDate(values[0]);
              setFullName(values[1]);
              setOrganisation(values[2]);
            }}
            inputTitles={[ 'Дата работы',  'Ответственное лицо', 'Организация']}
            arrayToReadOnly={[false, false, false]}
            inputValues={[date,  fullName, organisation]}
            func={updateComment}
            additionalComponents={//modalChange ? [] :
               [
              {
                component: (
                  <ListOfSubobj 
                    width='100%'
                    data={listSubObj} 
                    editable={!modalChange}
                    Title="Подобъект"
                    post={subobj} 
                    title={'Не выбрано'}
                    label={'Подобъект'}
                    status={true} 
                    onChange={setSubobj}
                  />
                ),
                key: "subobj",
              },
              {
                component: (
                  <ListOfSystem 
                  list={statusSystemModal ? listSystemFromSubobj : []} 
                  post={system} 
                  onChange={(system) => setSystem(system)}
                  editable={!modalChange}
                  statusreq={!modalChange}
                  width={'100%'}
                  Title="Система"
                  />
                ),
                key: 'system',
              },
               {component: (
                  <MultilineTextInput 
                    post={description} 
                    setPost={setDescription} 
                    maxLength={1000} 
                    warningLength={900}
                    editable={!modalChange}
                    title ={'Краткое описание работ и условий выполнения'}
                  />
                ),
                key: "description",
                },
                ...(!modalChange ? [{
                component: (
                  <CustomButton 
                    title="Сохранить изменения" 
                    handlePress={updateComment} 
                    disabled={disabled}
                  />
                ),
                key: 'SaveButton'
              },
              {
                 component: (
                  <CustomButton 
                    title="Удалить" 
                    handlePress={deleteNote} 
                    disabled={disabled}
                  />
                ),
                key: 'DelButton'
              }
              ] : [])
            ]}
            componentOrder={
              //modalChange ? [] :
               [0, 0, 0]} // Позиция для дополнительного компонента
          />
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
