import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../../constant/StorageKeys';
import { Colors } from '../../constant/Color';
import { MyUseStrings } from '../../constant/Strings';
import Button from '../../components/Button/Button';

export default function SavedOutfitScreen() {
  const [savedItems, setSavedItems] = useState<any[]>([]);

  useEffect(() => {
    loadSavedCanvas();
  }, []);

  const loadSavedCanvas = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setSavedItems(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Failed to load saved canvas', error);
    }
  };

  const clearSavedCanvas = async () => {
    Alert.alert('Confirm', 'Delete saved outfit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: MyUseStrings.delete,
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setSavedItems([]);
            Alert.alert('Deleted', 'Saved outfit cleared.');
          } catch (error) {
            console.error('Failed to clear saved canvas', error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.outfitContainer}>
      <Image
        source={{ uri: item.uri }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.positionText}>
        X: {Math.round(item.x)} Y: {Math.round(item.y)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {savedItems.length === 0 ? (
        <Text style={styles.emptyText}>{MyUseStrings.noSavedOutfits}</Text>
      ) : (
        <FlatList
          data={savedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {savedItems.length > 0 && (
        <Button
          title={MyUseStrings.clearSavedOutfit}
          titleStyle={styles.buttonText}
          style={styles.deleteButton}
          onPress={clearSavedCanvas}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.black,
    textAlign: 'center',
  },
  outfitContainer: {
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 12,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  positionText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  deleteButton: {
    marginTop: 16,
    backgroundColor: Colors.red,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.darkGray,
    fontSize: 16,
    marginTop: 32,
  },
});
