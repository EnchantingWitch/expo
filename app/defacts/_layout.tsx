import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack } from 'expo-router';
import React from 'react';
import { useWindowDimensions } from 'react-native';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3}} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (Math.round(fontSize / fontScale))};

  return (

    <Stack
      screenOptions={{

        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),

      }}>
      
      <Stack.Screen
        name="see_defact"
        options={{
            title: 'Просмотр',
          //  headerTitleStyle: {fontSize: ts(20)},
    
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
         
        headerStyle: { backgroundColor: '#FFFFFF',  },
        headerTitleStyle: {
          fontSize: ts(20), // Укажите нужный размер шрифта
          //fontWeight: 'bold', // Опционально: можно добавить жирность
          // Другие стили для заголовка, если нужно
        },
        }}
      />
      <Stack.Screen
        name="change_defact"
        options={{
            title: 'Редактирование',
          //  headerTitleStyle: {fontSize: ts(20)},
    
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
         
        headerStyle: { backgroundColor: '#FFFFFF',  },
        headerTitleStyle: {
          fontSize: ts(20), // Укажите нужный размер шрифта
          //fontWeight: 'bold', // Опционально: можно добавить жирность
          // Другие стили для заголовка, если нужно
        },
        }}
      />
      <Stack.Screen
        name="create_defact"
        options={{
          title: 'Добавить дефект',
          //headerTitleStyle: {fontSize: ts(20)},
          
          headerTitleAlign: 'center',

          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          
          
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: {
          fontSize: ts(20), // Укажите нужный размер шрифта
          //fontWeight: 'bold', // Опционально: можно добавить жирность
          // Другие стили для заголовка, если нужно
        },
        }}
      />
      
    </Stack>
  )}