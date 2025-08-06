import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Stack, useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { getGlobalStyles } from '../../constants/globalStyles';

export default function TabLayout() {
  const {systemName} = useGlobalSearchParams();//получение кода ОКС 
  const {ii} = useGlobalSearchParams();//получение кода ОКС 
  console.log(systemName, 'systemName');
  const [system, setSystem] = useState(' ');
  const [syst, setSyst] = useState(' ');
  const [ai, setAi] = useState(' ');
  const fontScale = useWindowDimensions().fontScale;
  const globalStyles = getGlobalStyles(fontScale);
   
  useEffect(() => {
    if (systemName!== undefined){setSyst(systemName);};

  }, [systemName, ii]);
  useEffect(() => {

    if (ii!== undefined){setAi(ii)};
  }, [ ii]);
  useEffect(() => {

    const str = ai+' '+syst+'           ';
    setSystem(str);
  }, [syst, ai]);

  console.log('system', system);

  return (

    <Stack
      screenOptions={{

        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),

      }}>
      <Stack.Screen
        name="load_registry"
        options={{
          title: 'Загрузка реестра',
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerTitleStyle: globalStyles.headerTitleStyle,
          headerStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
      <Stack.Screen
        name="system" 
        options={{
          title: system? system : ' ',
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF',  },
          headerTitleStyle: globalStyles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="structure_search"
        options={{
          title: 'Структура',
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerTitleStyle: globalStyles.headerTitleStyle,
          headerStyle: { backgroundColor: '#FFFFFF' 
          },
        }}
      />
    </Stack>
  )
}