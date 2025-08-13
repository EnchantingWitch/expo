import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import useDevice from '../hooks/useDevice';

type Props = {
  nameTab?: string; //Структура/Документация/Замечания и тд
  capitalCSName: string;
};

export default function HeaderForTabs({ nameTab, capitalCSName}: Props) {
    const { isMobileWeb } = useDevice();
    const scrollRef = useRef(null); //для скрола заголовка
    const [lineCount, setLineCount] = useState(1);//количество строк в заголовке 
    const textRef = useRef(null); //для скрола заголовка
    const router = useRouter();

    useEffect(() => {
          if (textRef.current) {
            // Веб-версия: рассчитываем количество строк через DOM
            const element = textRef.current;
            const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
            const height = element.clientHeight;
            const calculatedLineCount = Math.round(height / lineHeight);
            setLineCount(calculatedLineCount);
            console.log('lineCount', lineCount)
          }
    }, [isMobileWeb, textRef.current]);

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

return (
    <View style={{ flexDirection: "row", paddingTop: 15, marginBottom: 10, width: '100%' }}>
        <TouchableOpacity onPress={() => router.replace("/objs/objects")}>
          <Ionicons
            name="home-outline"
            size={25}
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
          <View style={{ flexDirection: 'column', width: '93%' }}>
              <ScrollView
                style={{
                  maxHeight: lineCount > 1 ? 52: 26,//20 размер шрифта, т.е высота одной строки
                  overflowY: lineCount > 1 ? 'scroll' : 'scroll'//hidden
                }}
                ref={scrollRef}
                onContentSizeChange={() => scrollRef.current?.scrollTo({ y: 0, animated: false })}
                showsVerticalScrollIndicator={lineCount > 1}
                persistentScrollbar={true}
              >
                <Text
                  ref={textRef}
                  style={{
                    fontWeight: '500',
                    fontSize: 20,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: "#111",
                    paddingVertical: 0,
                    lineHeight: 26,// display: 'inline-block',
                    width: '100%' 
                  }}
                >
                  {capitalCSName}
                </Text>
              </ScrollView>
              {nameTab? 
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 20,
                  textAlign: 'center',
                  color: "#111",
                  paddingVertical: 0,
                  paddingBottom: 8
                }}
              >
                {nameTab}
              </Text>
              : ''}
            </View>
      </View>
  );
}