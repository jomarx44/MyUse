import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { MyUseScreen } from './constant/MyUseScreen';
import { HomeScreen, ClothingLibraryScreen, SavedOutfitScreen, StylingCanvasScreen } from './screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function App() {

  const Stack = createNativeStackNavigator();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={MyUseScreen.Home} component={HomeScreen} />
          <Stack.Screen name={MyUseScreen.ClothingLibrary} component={ClothingLibraryScreen} />
          <Stack.Screen name={MyUseScreen.SavedOutfit} component={SavedOutfitScreen} />
          <Stack.Screen name={MyUseScreen.StylingCanvas} component={StylingCanvasScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
