import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Stack } from 'expo-router';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { getGlobalStyles } from '../../constants/globalStyles';


export default function TabLayout() {
  const fontScale = useWindowDimensions().fontScale;
  const globalStyles = getGlobalStyles(fontScale);

  return (

    <Stack
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      
      <Stack.Screen
        name="update_user_inf"
        options={{
          title: 'Подробная информация',
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF',  },
          headerTitleStyle: globalStyles.headerTitleStyle,
        }}
      />
      
    </Stack>
  )}