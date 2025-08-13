import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Scroll from "./Scroll";

type Props = {
  nameTab?: string; //Структура/Документация/Замечания и тд
  capitalCSName: string;
};

export default function HeaderForTabs({ nameTab, capitalCSName}: Props) {
    const BOTTOM_SAFE_AREA =
        Platform.OS === "android" ? StatusBar.currentHeight : 0;
    const scrollRef = useRef(null); //для скрола заголовка
    const [lineCount, setLineCount] = useState(1);//количество строк в заголовке 
    const textRef = useRef(null); //для скрола заголовка
    const router = useRouter();
    const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(1);
      const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);
      const [isScrollable, setIsScrollable] = React.useState(false);
      const scrollIndicator = useRef(new Animated.Value(0)).current;

return (
    <View style={{ flexDirection: "row", paddingTop: BOTTOM_SAFE_AREA + 15, marginBottom: 0, width: '100%' }}>
        <TouchableOpacity onPress={() => router.replace("/objs/objects")}>
          <Ionicons
            name="home-outline"
            size={25}
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: 'column', }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', width: '94%' }}>
              <ScrollView
                style={{
                  maxHeight: lineCount > 1 ? 52: 26,//20 размер шрифта, т.е высота одной строки
                  overflowY: lineCount > 1 ? 'scroll' : 'scroll'//hidden
                }}
                ref={scrollRef}
                onContentSizeChange={() => scrollRef.current?.scrollTo({ y: 0, animated: false })}
                showsVerticalScrollIndicator={false}
                persistentScrollbar={false}
                scrollEventThrottle={16}
                    onContentSizeChange={(_, height) => {
                      setCompleteScrollBarHeight(height);
                      setIsScrollable(height > visibleScrollBarHeight);
                    }}
                    onLayout={({ nativeEvent }) => {
                      const height = nativeEvent.layout.height;
                      setVisibleScrollBarHeight(height);
                      setIsScrollable(completeScrollBarHeight > height);
                    }}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { y: scrollIndicator } } }],
                      { useNativeDriver: false }
                    )}
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
                  onTextLayout={({ nativeEvent: { lines } }) => setLineCount(lines.length)}
                >
                  {capitalCSName}
                </Text>
              </ScrollView>
            </View>
          
            {isScrollable &&
              <Scroll completeScrollBarHeight={completeScrollBarHeight} 
              visibleScrollBarHeight={visibleScrollBarHeight} 
              scrollIndicator={scrollIndicator}
              height={lineCount > 1 ? 52: 26}/>
               }

          </View>
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