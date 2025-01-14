import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
export default function TabLayout() {
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
        }}
      />
     
     
    </Stack>
  )
}