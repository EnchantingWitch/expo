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
                headerShown: useClientOnlyValue(false, true),
            }}>

            <Stack.Screen
                name="sign_in"
                options={{
                    title: 'Вход',
                    headerShown: false,
                    headerTitleAlign: 'center',
                    headerTintColor: '#1E1E1E',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#FFFFFF', },
                    headerTitleStyle: globalStyles.headerTitleStyle,
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    title: 'Регистрация',
                    headerTitleAlign: 'center',
                    headerTintColor: '#1E1E1E',
                    headerShadowVisible: false,
                    headerTitleStyle: globalStyles.headerTitleStyle,
                    headerStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
        </Stack>
    )
}