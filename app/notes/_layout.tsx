import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack, Tabs } from 'expo-router';
import { Pressable, Button } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Header } from 'react-native/Libraries/NewAppScreen';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3}} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

    <Stack
      screenOptions={{

        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),

      }}>
      
      <Stack.Screen
        name="see_note"
        options={{
            title: 'Просмотр',
    
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
         
        headerStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
      <Stack.Screen
        name="create_note"
        options={{
          title: 'Создание замечания',

          headerTitleAlign: 'center',

          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          
        headerStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
      <Stack.Screen
        name="add_photo"
        options={{
          title: 'Добавить фото',
         // tabBarLabel: 'jjj',
          headerTitleAlign: 'center',
  
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
         
        headerStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
    </Stack>
  )}