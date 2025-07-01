import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constant/Color';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootStackParamList from '../../constant/RootStack';
import { MyUseStrings } from '../../constant/Strings';

import { MyUseScreen } from '../../constant/MyUseScreen';
import Button from '../../components/Button/Button';
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{MyUseStrings.title}</Text>
      <Button
        title={MyUseStrings.createNewOutfit}
        titleStyle={styles.buttonText}
        style={styles.button}
        onPress={() => navigation.navigate(MyUseScreen.StylingCanvas)}
      />
      <Button
        title={MyUseStrings.viewSavedOutfits}
        titleStyle={styles.buttonText}
        style={styles.button}
        onPress={() => navigation.navigate(MyUseScreen.SavedOutfit)}
      />
      <Button
        title={MyUseStrings.clothingLibrary}
        titleStyle={styles.buttonText}
        style={styles.button}
        onPress={() => navigation.navigate(MyUseScreen.ClothingLibrary)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.white
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: Colors.black
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
