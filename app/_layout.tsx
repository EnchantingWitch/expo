import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const fontScale = useWindowDimensions().fontScale;

 /* const ts = (fontSize) => {
    return (fontSize / fontScale)
  }*/

  return (
   // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        
       <Stack.Screen name="index"  options={{ headerShown: false, title: 'Стартовая страница'}} />
       <Stack.Screen name="objs"  options={{ headerShown: false}} />
        <Stack.Screen name="(tabs)"  options={{ headerShown: false}} />
        <Stack.Screen name="notes"  options={{ headerShown: false}} />
        <Stack.Screen name="structures"  options={{ headerShown: false}} />
        <Stack.Screen name="sign"  options={{ headerShown: false}} />
        <Stack.Screen name="admin"  options={{ headerShown: false}} />
        <Stack.Screen name="user"  options={{ headerShown: false}} />
        <Stack.Screen name="modal" options={{ presentation: 'modal'}} />

        
      </Stack>
   // </ThemeProvider>
   // //<Stack.Screen name="objects"  options={{ headerShown: false}} />
  );
}

