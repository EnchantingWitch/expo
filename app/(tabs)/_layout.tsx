import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack, Tabs, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { Pressable, Button, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {capitalCSName} = useGlobalSearchParams();
  console.log(capitalCSName, 'tab object capitalCSName');
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),

      }}>

      <Tabs.Screen
        name="object"
        options={{
          title: capitalCSName,
          //title: 'Объект',
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#1E1E1E',
          //tabBarIcon: ({size,focused,color}) => {
           // return (
            //  <Image
             //   style={{ width: size, height: size }}
             //    src={'/assets/images/building-2'}
                  //uri:
                   // 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
                
             // />
           // );
        //  },
        tabBarIcon: () => <TabBarIcon name="building-o" color='#1E1E1E' />,
          //tabBarIcon: () => <Image src={'/assets/images/building-2'} style={{width: 10}}/>, 
          //tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
      <Tabs.Screen
        name="structure"
        options={{
          title: 'Структура',
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#1E1E1E',
          tabBarIcon: () => <TabBarIcon name="sticky-note-o" color='#1E1E1E' />,
          //tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Замечания',
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#1E1E1E',
          tabBarIcon: () => <TabBarIcon name="pencil-square-o" color='#1E1E1E' />,
          //tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },

        }}
      />
    </Tabs>
  )
}

/*
 <Tabs.Screen
      name="index"
      options={{
        title: 'Стартовый экран',
        tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        headerRight: () => (
          <Link href="/modal" asChild>
          
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="info-circle"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),
      }}
    />
    */