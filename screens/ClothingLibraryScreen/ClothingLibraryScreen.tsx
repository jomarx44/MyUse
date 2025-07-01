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

export default function ClothingLibraryScreen({ navigation }: any) {
  const [clothingItems, setClothingItems] = useState<any[]>([]);

  useEffect(() => {
    loadClothingLibrary();
  }, []);

  const loadClothingLibrary = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setClothingItems(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Failed to load clothing library', error);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirm', 'Remove this clothing item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedItems = clothingItems.filter(item => item.id !== id);
          setClothingItems(updatedItems);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.uri }} style={styles.image} resizeMode="contain" />
      <Button
        title={MyUseStrings.remove}
        titleStyle={styles.deleteText}
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      />
    </View>
  );

  return (
    <View style={styles.container}>

      {clothingItems.length === 0 ? (
        <Text style={styles.emptyText}>{MyUseStrings.noClothingItems}</Text>
      ) : (
        <FlatList
          data={clothingItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
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
  itemContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 10,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: Colors.red,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.darkGray,
    fontSize: 16,
    marginTop: 32,
  },
});
