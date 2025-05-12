import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useGlobalSearchParams } from 'expo-router';
import React from 'react';
import { useWindowDimensions } from 'react-native';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {


  const fontScale = useWindowDimensions().fontScale;

  const ts = (fontSize: number) => {
    return (Math.round(fontSize / fontScale))};

    
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

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
          headerShown: false,
          tabBarLabel: "Объект", 
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#1E1E1E',
          tabBarIcon: ({ color }) => <TabBarIcon name="building-o" color={color} />,
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          tabBarLabelStyle: { fontSize: ts(10) },
          headerStyle: { 
            backgroundColor: '#FFFFFF',
            
          },
          headerTitleStyle: {
           // flexWrap: 'wrap',
            textAlign: 'center',
            maxWidth: '95%',
            lineHeight: ts(32),
            fontSize: ts(20)
          },
        }}
      />
      <Tabs.Screen
        name="docs"
        options={{
          headerShown: false,
          tabBarLabel: "Документация", 
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#1E1E1E',
          tabBarIcon: ({ color }) => <TabBarIcon name='folder-open-o' color={color} />,
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          tabBarLabelStyle: { fontSize: ts(10) },
          headerStyle: { 
            backgroundColor: '#FFFFFF',
            
          },
          headerTitleStyle: {
           // flexWrap: 'wrap',
            textAlign: 'center',
            maxWidth: '95%',
            lineHeight: ts(32),
            fontSize: ts(20)
          },
        }}
      />
      <Tabs.Screen
        name="structure"
        
        options={{
          headerShown: false,
          title: capitalCSName,
          tabBarLabel: "Структура", 
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#1E1E1E',
          tabBarIcon: ({ color }) => <TabBarIcon name="sticky-note-o" color={color} />,
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          tabBarLabelStyle: { fontSize: ts(10) },
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Замечания',
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#1E1E1E',
          tabBarIcon: ({ color }) => <TabBarIcon name="pencil-square-o" color={ color } />,
          //tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerTintColor: '#1E1E1E',
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabelStyle: {fontSize: ts(10)},
          headerStyle: { backgroundColor: '#FFFFFF'},
          headerTitleStyle: {
            // flexWrap: 'wrap',
             textAlign: 'center',
             fontSize: ts(20)
           },
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