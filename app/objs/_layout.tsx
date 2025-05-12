import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Stack } from 'expo-router';
import { default as React } from 'react';
import { useWindowDimensions } from 'react-native';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
export default function TabLayout() {
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
        name="objects"
        options={{
          title: 'Объекты',

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

      <Stack.Screen
        name="add_obj"
        options={{
          title: 'Добавить объект',

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
     
     <Stack.Screen
        name="diagrams"
        options={{
          title: ' ',

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
  )
}