import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import { Stack } from 'expo-router';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { getGlobalStyles } from '../../constants/globalStyles';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const fontScale = useWindowDimensions().fontScale;
  const globalStyles = getGlobalStyles(fontScale);

  return (

    <Stack
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
      }}>
      
      <Stack.Screen
        name="jour"
        options={{
          title: 'Smthing checked',
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF',  },
          headerTitleStyle: globalStyles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="create_jour"
        options={{
          title: 'Краткое описание работ',
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF',  },
          headerTitleStyle: globalStyles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="see_jour"
        options={{
          title: 'Просмотр',
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF',  },
          headerTitleStyle: globalStyles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="change_jour"
        options={{
          title: 'Краткое описание работ',
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF',  },
          headerTitleStyle: globalStyles.headerTitleStyle,
        }}
      />
     
    </Stack>
  )}