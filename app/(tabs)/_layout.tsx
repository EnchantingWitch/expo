import { useColorScheme } from '@/components/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Tabs, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

// Типы для иконок
type IconProps = {
  name: string;
  color: string;
  size?: number;
  library?: 'FontAwesome' | 'Ionicons' | 'SimpleLineIcons' | 'AntDesign';
};

// Компонент иконки с поддержкой разных библиотек
function TabBarIcon({ name, color, size = 25, library = 'FontAwesome' }: IconProps) {
  const iconProps = { name, color, size, style: { marginBottom: -3 } };
  
  switch (library) {
    case 'Ionicons':
      return <Ionicons {...iconProps} />;
    case 'SimpleLineIcons':
      return <SimpleLineIcons {...iconProps} />;
    case 'AntDesign':
      return <AntDesign {...iconProps} />;
    case 'FontAwesome':
    default:
      return <FontAwesome {...iconProps} />;
  }
}

export default function TabLayout() {
  const BOTTOM_SAFE_AREA = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { fontScale } = useWindowDimensions();

  const ts = (fontSize: number) => Math.round(fontSize / fontScale);

  const tabs = [
    {
      name: 'object',
      label: 'Объект',
      icon: 'building-o',
      library: 'FontAwesome'
    },
    {
      name: 'jour',
      label: 'Журнал ПНР',
      icon: 'notebook',
      library: 'SimpleLineIcons'
      /* icon: 'journal-outline',
      library: 'Ionicons'*/
    },
    {
      name: 'docs',
      label: 'Документы',
      icon: 'folder-open-o',
      library: 'FontAwesome'
    },
    {
      name: 'structure',
      label: 'Структура',
      icon: 'layers-outline',
      library: 'Ionicons'
    },
    {
      name: 'two',
      label: 'Замечания',
      icon: 'warning',
      library: 'AntDesign'
    },
    {
      name: 'defacts',
      label: 'Дефекты',
      icon: 'build-outline',
      library: 'Ionicons'
    },
  ];

  const activeTab = segments[segments.length - 1] || 'object';

  return (
    <View style={{ flex: 1, paddingBottom: BOTTOM_SAFE_AREA + 65 }}>
      {/* Основной контент (экраны вкладок) */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        {/* Tabs.Screen */}
      </Tabs>

      {/* Кастомный TabBar */}
      <View style={[styles.tabBarWrapper, { paddingBottom: BOTTOM_SAFE_AREA + 5 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(`/${tab.name}`)}
              style={[
                styles.tabButton,
                activeTab === tab.name && styles.activeTab,
              ]}
            >
              <TabBarIcon
                name={tab.icon}
                color={activeTab === tab.name ? '#1E1E1E' : '#888'}
                library={tab.library}
              />
              <Text style={[
                styles.tabLabel, 
                { fontSize: ts(11) },
                activeTab === tab.name && styles.activeLabel
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

// Стили остаются без изменений
const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
    //fontFamily: 'HeliosCondC',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E1E1E',
  },
  activeLabel: {
    color: '#1E1E1E',
    fontWeight: '600',
  },
});