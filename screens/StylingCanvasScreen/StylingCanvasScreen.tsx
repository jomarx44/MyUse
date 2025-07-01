import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Colors } from '../../constant/Color';
import { MyUseStrings } from '../../constant/Strings';
import DraggableImage from '../../components/DraggableImage/DraggableImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { useRef } from 'react';
import { CLOTHING_LIBRARY_KEY, STORAGE_KEY } from '../../constant/StorageKeys';
import Button from '../../components/Button/Button';


interface CanvasItem {
  id: string;
  uri: string;
  x: number;
  y: number;
}

export default function StylingCanvasScreen() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const canvasRef = useRef(null);

  useEffect(() => {
    loadCanvas();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const newItem: CanvasItem = {
        id: uuid.v4().toString(),
        uri,
        x: 0,
        y: 0,
      };
      setItems((prev) => [...prev, newItem]);
      await saveToClothingLibrary({ id: newItem.id, uri: newItem.uri });
    }
  };
  const updateItemPosition = (id: string, x: number, y: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, x, y } : item
      )
    );
  };

  const saveCanvas = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      Alert.alert('Success', 'Canvas saved!');
    } catch (error) {
      console.error('Failed to save canvas', error);
    }
  };

  const loadCanvas = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: CanvasItem[] = JSON.parse(saved);
        setItems(parsed);
      }
    } catch (error) {
      console.error('Failed to load canvas', error);
    }
  };
  const clearCanvas = async () => {
    Alert.alert('Clear Canvas?', 'Are you sure?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          setItems([]);
          await AsyncStorage.removeItem(STORAGE_KEY);
        },
      },
    ]);
  };

  const exportCanvas = async () => {
    try {
      if (!permissionResponse?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert('Permission required', 'Please allow media access');
          return;
        }
      }

      if (!canvasRef.current || items.length === 0) {
        Alert.alert('Nothing to export');
        return;
      }

      const uri = await captureRef(canvasRef, {
        format: 'png',
        quality: 1,
      });

      await MediaLibrary.createAssetAsync(uri);
      Alert.alert('Saved!', `Canvas image saved to gallery.`);
    } catch (error) {
      console.error('Export failed', error);
      Alert.alert('Error', 'Failed to export canvas.');
    }
  };

  const saveToClothingLibrary = async (item: { id: string; uri: string }) => {
    try {
      const existing = await AsyncStorage.getItem(CLOTHING_LIBRARY_KEY);
      const library = existing ? JSON.parse(existing) : [];
      const alreadyExists = library.some((clothing: { uri: string }) => clothing.uri === item.uri);
      if (!alreadyExists) {
        library.push(item);
        await AsyncStorage.setItem(CLOTHING_LIBRARY_KEY, JSON.stringify(library));
      }
    } catch (error) {
      console.error('Error saving to clothing library', error);
    }
  };
  const bringToFront = () => {
    if (!selectedItemId) return;
    setItems(prev => {
      const index = prev.findIndex(item => item.id === selectedItemId);
      if (index === -1) return prev;
      const newItems = [...prev];
      const [item] = newItems.splice(index, 1);
      newItems.push(item);
      return newItems;
    });
    setSelectedItemId(null);
  };

  const deleteItem = () => {
    if (!selectedItemId) return;
    setItems(prev => prev.filter(item => item.id !== selectedItemId));
    setSelectedItemId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{MyUseStrings.stylingCanvas}</Text>
      <Button
        title={MyUseStrings.addClothingItem}
        titleStyle={styles.buttonText}
        style={styles.button}
        onPress={pickImage}
      />

      <Button
        title={MyUseStrings.saveCanvas}
        titleStyle={styles.buttonText}
        style={[styles.button, { backgroundColor: Colors.green }]}
        onPress={saveCanvas}
      />
      <Button
        title={MyUseStrings.clearCanvas}
        titleStyle={styles.buttonText}
        style={[styles.button, { backgroundColor: Colors.red }]}
        onPress={clearCanvas}
      />

      {/* <TouchableOpacity onPress={exportCanvas} style={[styles.button, { backgroundColor: '#4b7bec' }]}>
        <Text style={styles.buttonText}>{MyUseStrings.exportCanvas}</Text>
      </TouchableOpacity> */}
       {selectedItemId && (
        <View style={styles.actionButtons}>
          <Button
            title={MyUseStrings.bringToFront}
            titleStyle={styles.buttonText}
            style={[styles.button, { backgroundColor: Colors.blue }]}
            onPress={bringToFront}
          />
          <Button
            title={MyUseStrings.delete}
            titleStyle={styles.buttonText}
            style={[styles.button, { backgroundColor: Colors.pink }]}
            onPress={deleteItem}
          />
        </View>
      )}

      <View style={styles.canvasContainer}>
        <View style={styles.canvas}>
          {items.map((item) => (
            <DraggableImage
              key={item.id}
              id={item.id}
              uri={item.uri}
              initialX={item.x}
              initialY={item.y}
              onPositionChange={updateItemPosition}
              onPress={() => setSelectedItemId(item.id)}
              selected={selectedItemId === item.id}
            />
          ))}
        </View>
        {/* <ViewShot ref={canvasRef} style={{ position: 'absolute', opacity: 0 }} options={{ format: 'png', quality: 1 }}>
          <View style={{ height: 400, backgroundColor: Colors.lightGray, position: 'relative' }}>
            {items.map((item) => (
              <Image
                key={item.id}
                source={{ uri: item.uri }}
                style={{
                  position: 'absolute',
                  left: item.x,
                  top: item.y,
                  width: 120,
                  height: 120,
                  borderRadius: 10,
                }}
                resizeMode="contain"
              />
            ))}
          </View>
        </ViewShot> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: Colors.white,
  },
  canvasContainer: {
    height: 400,
    margin: 12,
    borderRadius: 16,
  },
  canvas: {
    height: 400,
    backgroundColor: Colors.lightGray,
    position: 'relative',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
});
