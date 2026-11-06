import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Check, Trash2, Camera, Image as ImageIcon } from 'lucide-react-native';

import { PhotoContext } from '../context/PhotoContext';

const categoryOptions = ['เสื้อ', 'กางเกง', 'กระโปรง', 'เดรส', 'รองเท้า', 'เครื่องประดับ'];

export default function UpdateClothesScreen({ navigation, route }) {
  const { setPhotos } = useContext(PhotoContext);
  const item = route?.params?.item;

  const [name, setName] = useState(item?.name || '');
  const [category, setCategory] = useState(item?.category || 'เสื้อ');
  const [notes, setNotes] = useState(item?.notes || '');
  const [selectedImage, setSelectedImage] = useState(item?.image || item?.uri || null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const canDelete = useMemo(() => !!item?.id, [item]);

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('ไม่ได้รับอนุญาต', 'กรุณาอนุญาตให้เข้าถ่ายภาพก่อน');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickFromLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('ไม่ได้รับอนุญาต', 'กรุณาอนุญาตให้เข้าถึงรูปภาพก่อน');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!item?.id) {
      navigation.goBack();
      return;
    }

    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === item.id
          ? {
              ...photo,
              name: name.trim() || 'ชุดใหม่',
              category,
              notes: notes.trim(),
              uri: selectedImage || photo.uri,
            }
          : photo
      )
    );

    navigation.navigate('WardrobeMain');
  };

  const handleDelete = () => {
    if (!item?.id) {
      navigation.goBack();
      return;
    }

    Alert.alert('ลบรายการ', 'ต้องการลบชิ้นนี้ใช่ไหม', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: () => {
          setPhotos((prev) => prev.filter((photo) => photo.id !== item.id));
          navigation.navigate('WardrobeMain');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>แก้ไขชุด</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>รูปภาพ</Text>
        <View style={styles.imageActionRow}>
          <TouchableOpacity style={styles.photoButton} onPress={openCamera}>
            <View style={styles.iconButtonContent}>
              <Camera size={18} color="#FFFFFF" />
              <Text style={styles.photoButtonText}>ถ่ายรูป</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButtonSecondary} onPress={pickFromLibrary}>
            <View style={styles.iconButtonContent}>
              <ImageIcon size={18} color="#2b241f" />
              <Text style={styles.photoButtonTextSecondary}>เลือกรูป</Text>
            </View>
          </TouchableOpacity>
        </View>

        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Text style={styles.previewPlaceholderText}>ยังไม่มีภาพ</Text>
          </View>
        )}

        <Text style={styles.label}>ชื่อชุด</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="เช่น White Shirt"
        />

        <Text style={styles.label}>หมวดหมู่</Text>
        <View style={styles.dropdownWrap}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setCategoryOpen((prev) => !prev)}
            activeOpacity={0.9}
          >
            <Text style={styles.dropdownValue}>{category}</Text>
            <Text style={styles.dropdownArrow}>{categoryOpen ? '▴' : '▾'}</Text>
          </TouchableOpacity>

          {categoryOpen && (
            <View style={styles.dropdownMenu}>
              {categoryOptions.map((itemName) => (
                <TouchableOpacity
                  key={itemName}
                  style={[
                    styles.dropdownOption,
                    category === itemName && styles.dropdownOptionActive,
                  ]}
                  onPress={() => {
                    setCategory(itemName);
                    setCategoryOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      category === itemName && styles.dropdownOptionTextActive,
                    ]}
                  >
                    {itemName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.label}>บันทึกเพิ่มเติม</Text>
        <TextInput
          style={styles.textArea}
          value={notes}
          onChangeText={setNotes}
          placeholder="เช่น สีขาว, ผ้าฝ้าย, ใช้ได้ทั้งวัน"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <View style={styles.buttonContent}>
            <Check size={18} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>บันทึก</Text>
          </View>
        </TouchableOpacity>

        {canDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <View style={styles.buttonContent}>
              <Trash2 size={18} color="#7D2F2F" />
              <Text style={styles.deleteButtonText}>ลบรายการ</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1EA',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    marginRight: 14,
    marginTop: 45,
  },
  backIcon: {
    fontSize: 25,
    color: '#38302B',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#38302B',
    marginTop: 45,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EFE2D7',
  },
  imageActionRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#C17D55',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  photoButtonSecondary: {
    flex: 1,
    backgroundColor: '#F1E4D9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    marginLeft: 6,
  },
  iconButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  photoButtonTextSecondary: {
    color: '#2b241f',
    fontSize: 14,
    fontWeight: '700',
  },
  previewPlaceholder: {
    height: 190,
    borderRadius: 18,
    backgroundColor: '#F8F4EF',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  previewPlaceholderText: {
    color: '#998A80',
    fontSize: 14,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 190,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: '#F1E4D9',
  },
  label: {
    color: '#38302B',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 9,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8F4EF',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 15,
    color: '#38302B',
    marginBottom: 10,
  },
  dropdownWrap: {
    marginBottom: 10,
    position: 'relative',
    zIndex: 2,
  },
  dropdownButton: {
    backgroundColor: '#F8F4EF',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownValue: {
    color: '#38302B',
    fontSize: 15,
    fontWeight: '600',
  },
  dropdownArrow: {
    color: '#C17D55',
    fontSize: 17,
    fontWeight: '700',
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    borderRadius: 14,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EEE8',
  },
  dropdownOptionActive: {
    backgroundColor: '#C17D55',
  },
  dropdownOptionText: {
    color: '#38302B',
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownOptionTextActive: {
    color: '#FFFFFF',
  },
  textArea: {
    backgroundColor: '#F8F4EF',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    minHeight: 120,
    fontSize: 15,
    color: '#38302B',
  },
  saveButton: {
    marginTop: 22,
    backgroundColor: '#C17D55',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  deleteButton: {
    marginTop: 14,
    backgroundColor: '#F7D8D8',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#7D2F2F',
    fontSize: 15,
    fontWeight: '700',
  },
});
