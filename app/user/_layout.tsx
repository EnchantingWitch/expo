import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack, Tabs } from 'expo-router';
import { Pressable, Button, useWindowDimensions } from 'react-native';
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
  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (fontSize / fontScale)};

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
          //  headerTitleStyle: {fontSize: ts(20)},
    
          headerTitleAlign: 'center',
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
         
        headerStyle: { backgroundColor: '#FFFFFF',  },
        }}
      />
      
    </Stack>
  )}