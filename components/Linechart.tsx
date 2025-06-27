import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import CustomButton from "./CustomButton";

type Props = {
  blueQuantity: number;
  dinamic: number;
  title: string;
  codeCCS: any;
  accessToken: any;
};

const Linechart = ({
  blueQuantity,
  title,
  dinamic,
  codeCCS,
  accessToken,
}: Props) => {
  const fontScale = useWindowDimensions().fontScale;
  const [modalStatus, setModalStatus] = useState(false);
  const [data, setData] = useState();
  const ts = (fontSize: number) => {
    return fontSize / fontScale;
  };

  const [lineData, setLineData] = useState([
    {
      value: 0,
      dataPointText: "0",
      label: "30.04",
      dataPointColor: "#0072C8",
      dataPointRadius: 2.5,
    },
    {
      value: 0,
      dataPointText: "0",
      label: "07.05",
      dataPointColor: "#0072C8",
      dataPointRadius: 2.5,
    },
    {
      value: 0,
      dataPointText: "0",
      label: "14.05",
      dataPointColor: "#0072C8",
      dataPointRadius: 2.5,
    },
    {
      value: 0,
      dataPointText: "0",
      label: "21.05",
      dataPointRadius: 3,
      dataPointColor: "#16a34a",
      dataPointLabelWidth: 1,
    },
    {
      value: 0,
      dataPointText: "0",
      label: "29.05",
      dataPointColor: "#0072C8",
      dataPointRadius: 2.5,
    },
    {
      value: 0,
      dataPointText: "0",
      label: "05.05",
      dataPointColor: "#0072C8",
      dataPointRadius: 2.5,
    },
    {
      value: 0,
      dataPointText: "0",
      label: "12.05",
      dataPointColor: "#0072C8",
      dataPointRadius: 2.5,
    /*  dashed: true,
      ruleType: 'dashed',
      dashWidth: 4,
      dashGap: 2,*/
    },
  ]);

  const [inputValues, setInputValues] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    if (codeCCS && accessToken) {
      getStaff();
    }
  }, [codeCCS, accessToken]);

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        const updatedLineData = lineData.map((item, index) => {
          if (data[index]) {
            return {
              ...item,
              value: data[index].personnelFact,
              dataPointText:
                data[index].personnelFact?.toString() || item.dataPointText,
              label: data[index].date.replace(/\.\d{4}$/, ""), //|| item.label
            };
          }
          return item;
        });
        setLineData(updatedLineData);
        setInputValues(data.map((item) => item.personnelFact));
      } else if (data.personnelFact !== undefined && data.date) {
        // Если data - это объект с единичными значениями
        const updatedLineData = [...lineData];
        updatedLineData[3] = {
          // Пример: обновляем только конкретную точку
          ...updatedLineData[3],
          value: data.personnelFact,
          dataPointText: data.personnelFact.toString(),
          label: data.date.replace(/\.\d{4}$/, ""),
        };
        setLineData(updatedLineData);
        setInputValues(data.map((item) => item.personnelFact));
      }
    }
  }, [data]);

  const handleInputChange = (index: number, value: string) => {
    const newValue = parseInt(value) || 0;
    const newInputValues = [...inputValues];
    newInputValues[index] = newValue;
    setInputValues(newInputValues);
  };

  const getStaff = async () => {
    try {
      const response = await fetch(
        "https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/getStaff/" +
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

      console.log("responseGetStaff", response);
      console.log("responseGetStaff", json);
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const [newData, setNewData] = useState();

  const makeNewData = () => {
    //заполнить массив newData с полями "id" из data.id, "personnelPlan" из data.personnelPlan, "personnelFact" из inputValues, "date" из data.date
    if (!data || !Array.isArray(data)) return;

    // Создаем новый массив данных на основе data и inputValues
    const updatedData = data.map((item, index) => ({
      id: item.id, // берем id из исходных данных
      personnelPlan: item.personnelPlan, // берем план из исходных данных
      personnelFact: inputValues[index], // берем факт из inputValues
      date: item.date//formatDate(item.date), // берем дату из исходных данных
    }));
    console.log("updatedData", updatedData);
    setNewData(updatedData);
    //console.log("JSON to update staff", JSON.stringify(newData));
    updateStaff(updatedData);
  };

  function formatDate(inputDate) {
  // Разбиваем строку на день, месяц и год
  const [day, month, year] = inputDate.split('.');
  
  // Форматируем в 'YYYY-MM-DD' (год-месяц-день)
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

  const updateStaff = async (dataToUpdate) => {
    try {
      console.log("JSON to update staff body", JSON.stringify(dataToUpdate));
      let response = await fetch(
        `https://xn----7sbpwlcifkq8d.xn--p1ai:8443/capitals/updateStaffInf`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToUpdate), //надо сформировать коллекцию значений
        }
      );
      console.log("updateStaffInf", response);
      if (response.ok) {
        const jsonData = await response.json();
        setData(dataToUpdate);
        Alert.alert("", "Данные по персоналу обновлены", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      } else {
        throw new Error("Не удалось сохранить данные.");
      }
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
    } finally {
      setModalStatus(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "58%" }}>
            <Text
              style={{
                color: "#1A4072",
                fontSize: ts(16),
                fontWeight: "bold",
                alignSelf: "flex-end",
              }}
            >
              {title}
            </Text>
          </View>
          <TouchableOpacity
            style={{ width: "40%", alignItems: "flex-end" }}
            onPress={() => setModalStatus(true)}
          >
            <Ionicons
              name="person-add-outline"
              size={20}
              color={"#0072C8"}
            ></Ionicons>
            {/** man-outline person-add-outline person-circle-outline*/}
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: ts(10),
            borderRadius: 20,
            borderColor: "#1A4072",
            borderWidth: 2,
            backgroundColor: "#F2F2F2", //'#F2F2F2'
            height: 105,
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View
            style={{ width: "25%", alignSelf: "center", flexDirection: "row" }}
          >
            <Text
              style={{
                fontSize: ts(30),
                color: "#0072C8",
                fontWeight: "bold",
                alignSelf: "center",
                marginLeft: 10,
              }}
            >
              {lineData[3].value}
            </Text>

            {lineData[3].value - lineData[2].value >=
            0 /**ВОЗМОЖНО ПРИДЕТСЯ ПОМЕНЯТЬ ЛОГИКУ */ ? (
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{
                    width: 34,
                    height: 34,
                    tintColor: "#16a34a",
                    alignItems: "flex-end",
                  }}
                  source={require("../assets/images/arm.svg")}
                />
                <View style={{ marginBottom: -0.5, marginLeft: -10 }}>
                  <Text
                    style={{
                      fontSize: ts(14),
                      color: "#16a34a",
                      fontWeight: "bold",
                      marginTop: 6,
                      marginRight: 5,
                    }}
                  >
                    {lineData[3].value - lineData[2].value}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{
                    width: 34,
                    height: 34,
                    tintColor: "#E24831",
                    alignItems: "flex-end",
                  }}
                  source={require("../assets/images/redArm.svg")}
                />
                <View style={{ marginBottom: -0.5, marginLeft: -10 }}>
                  <Text
                    style={{
                      fontSize: ts(14),
                      color: "#E24831",
                      fontWeight: "bold",
                      marginTop: 6,
                      marginRight: 5,
                    }}
                  >
                    {Math.abs(lineData[3].value - lineData[2].value)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              height: 90,
              alignSelf: "flex-end",
              width: "80%",
              marginBottom: -5,
            }}
          >
            <LineChart
              initialSpacing={15}
              data={lineData}
              textColor1="black"
              width={Dimensions.get("window").width * 0.62} //238
              height={65}
              stepValue={8}
              //adjustToWidth={true}
              // dataPointLabelWidth={0}
              //stepHeight={}

              textShiftY={-5}
              textShiftX={-7}
              textFontSize={13}
              //thickness={5}
              hideRules
              hideYAxisText={true}
              hideAxesAndRules={true} //скрывает оси
              spacing={Dimensions.get("window").width * 0.092} //расстояние между метками - 34
              showXAxisIndices
              xAxisIndicesHeight={1}
              xAxisIndicesWidth={250}
              xAxisColor={"gray"}
              xAxisIndicesColor={"#A9A9A9"}
              xAxisLabelTextStyle={{
                fontSize: ts(10),
                color: "#1A4072", //#E24831
                //fontFamily: 'Arial'
              }}
              spacing1={Dimensions.get("window").width * 0.092} //расстояние между точками - 34
              yAxisColor="#0BA5A4"
              // showVerticalLines
              verticalLinesColor="rgba(14,164,164,0.5)"
              color="#0072C8"
              // curved={true}
              //hideOrigin={true}
              
               lineSegments={[
        {startIndex: 0, endIndex: 3, },             // 1st segmant from 0th to 1st index
             // break (transparent = invisible)
             // 2nd segment from 2nd to 4th index
        {startIndex: 3, endIndex: 7, color: 'rgba(0, 114, 200, 0.4)', strokeDashArray: [6,2]},       // 2nd break from 4th to 7th index
               ]}
            />
          </View>
        </View>
      </View>

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
              height: 400,
              padding: 5,
              backgroundColor: "white",
              borderRadius: 10,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setModalStatus(false)}
              style={{ alignSelf: "flex-end" }}
            >
              <Ionicons name="close-outline" size={30} />
            </TouchableOpacity>
            <View style={{ justifyContent: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "54%", alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#1A4072",
                      fontSize: ts(14),
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    Дата
                  </Text>
                </View>
                <View style={{ width: "46%", alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#1A4072",
                      fontSize: ts(14),
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    Количество
                  </Text>
                </View>
              </View>

              {lineData.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    paddingVertical: 3,
                  }}
                >
                  <TextInput
                    style={{
                      textAlign: "center",
                      borderColor: "#E0F2FE",
                      borderWidth: 2,
                      borderRadius: 6,
                      height: 36,
                      width: 90,
                      includeFontPadding: false,
                      textAlignVertical: "center",
                      lineHeight: ts(12),
                      fontSize: ts(14),
                    }}
                    editable={false}
                    value={
                      data?.[index]?.date
                        ? data[index].date.replace(/\.\d{4}$/, "")
                        : item.label
                    }
                  />
                  <TextInput
                    keyboardType={"number-pad"}
                    style={{
                      borderColor: "#E0F2FE",
                      borderWidth: 2,
                      borderRadius: 6,
                      height: 36,
                      width: 70,
                      paddingBottom: 7,
                      textAlignVertical: "center",
                      fontSize: ts(14),
                      textAlign: "center",
                    }}
                    value={inputValues[index]?.toString()}
                    onChangeText={(text) => handleInputChange(index, text)}
                  />
                </View>
              ))}

              <CustomButton title="Сохранить" handlePress={makeNewData} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Linechart;
