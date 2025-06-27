import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={25} style={{ marginBottom: -3 }} {...props} />;
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
    },
    {
      name: 'docs',
      label: 'Документы',
      icon: 'folder-open-o',
    },
    {
      name: 'structure',
      label: 'Структура',
      icon: 'sticky-note-o',
    },
    {
      name: 'two',
      label: 'Замечания',
      icon: 'pencil-square-o',
    },
    {
      name: 'defacts',
      label: 'Дефекты',
      icon: 'pencil-square-o',
    },
  ];

  const activeTab = segments[segments.length - 1] || 'object';

  return (
      <View style={{ flex: 1, paddingBottom: BOTTOM_SAFE_AREA + 65 }}>
      {/* Основной контент (экраны вкладок) */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Скрываем стандартный TabBar
        }}
      >
        {/* Ваши Tabs.Screen */}
      </Tabs>

      {/* Кастомный TabBar внизу экрана */}
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
                name={tab.icon as any}
                color={activeTab === tab.name ? '#1E1E1E' : '#888'}
              />
              <Text style={[styles.tabLabel, {fontSize: ts(11)}, activeTab === tab.name && styles.activeLabel]}>
                {[tab.label, ]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute', // Абсолютное позиционирование
    bottom: 0,            // Прижимаем к нижнему краю
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,    // Граница сверху (как у стандартного TabBar)
    borderTopColor: '#EEE',
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,           // Высота TabBar
    alignItems: 'center', // Центрируем элементы по вертикали
    paddingHorizontal: 10,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',       // Занимает всю высоту контейнера
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
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