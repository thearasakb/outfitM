
import React, { useContext, useState } from 'react';
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
import {
  Check,
  Camera,
  Image as ImageIcon,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react-native';

import { PhotoContext } from '../context/PhotoContext';

const categoryOptions = [
  'เสื้อ',
  'กางเกง',
  'กระโปรง',
  'เดรส',
  'รองเท้า',
  'เครื่องประดับ',
];

export default function UploadClothesScreen({ navigation }) {
  const { addPhoto } = useContext(PhotoContext);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('เสื้อ');
  const [notes, setNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  // ถ่ายภาพจากกล้อง
  const openCamera = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

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
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเปิดกล้องได้');
    }
  };

  // เลือกภาพจากคลังรูป
  const pickFromLibrary = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

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
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเลือกรูปภาพได้');
    }
  };

  // บันทึกข้อมูล
  const handleSave = () => {
    if (!selectedImage) {
      Alert.alert('ยังไม่มีรูปภาพ', 'กรุณาถ่ายรูปหรือเลือกรูปก่อนบันทึก');
      return;
    }

    addPhoto({
      id: String(Date.now()),
      uri: selectedImage,
      name: name.trim() || 'ชุดใหม่',
      category,
      notes: notes.trim(),
      favorite: false,
    });

    setName('');
    setCategory('เสื้อ');
    setNotes('');
    setSelectedImage(null);

    navigation.navigate('WardrobeMain');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={21} color="#38302B" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>เพิ่มชุด</Text>
          <Text style={styles.subtitle}>
            เพิ่มเสื้อผ้าใหม่ลงในตู้เสื้อผ้าของคุณ
          </Text>
        </View>
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        {/* รูปภาพ */}
        <Text style={styles.label}>รูปภาพ</Text>

        <View style={styles.imageActionRow}>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={openCamera}
            activeOpacity={0.85}
          >
            <Camera size={19} color="#FFFFFF" />
            <Text style={styles.photoButtonText}>ถ่ายรูป</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.photoButtonSecondary}
            onPress={pickFromLibrary}
            activeOpacity={0.85}
          >
            <ImageIcon size={19} color="#A66C4D" />
            <Text style={styles.photoButtonTextSecondary}>เลือกรูป</Text>
          </TouchableOpacity>
        </View>

        {/* ภาพตัวอย่าง */}
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.previewPlaceholder}>
            <View style={styles.placeholderIcon}>
              <ImageIcon size={32} color="#C4A58E" />
            </View>
            <Text style={styles.previewPlaceholderText}>
              ยังไม่มีภาพ
            </Text>
            <Text style={styles.placeholderHint}>
              ถ่ายรูปหรือเลือกรูปจากคลังภาพ
            </Text>
          </View>
        )}

        {/* ชื่อชุด */}
        <Text style={styles.label}>ชื่อชุด</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="เช่น White Shirt"
          placeholderTextColor="#B6A79C"
        />

        {/* หมวดหมู่ */}
        <Text style={styles.label}>หมวดหมู่</Text>

        <View
          style={[
            styles.dropdownWrap,
            categoryOpen && styles.dropdownWrapOpen,
          ]}
        >
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setCategoryOpen((prev) => !prev)}
            activeOpacity={0.85}
          >
            <Text style={styles.dropdownValue}>{category}</Text>

            <ChevronDown
              size={20}
              color="#A66C4D"
              style={{
                transform: [
                  { rotate: categoryOpen ? '180deg' : '0deg' },
                ],
              }}
            />
          </TouchableOpacity>

          {categoryOpen && (
            <View style={styles.dropdownMenu}>
              {categoryOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.dropdownOption,
                    category === item && styles.dropdownOptionActive,
                  ]}
                  onPress={() => {
                    setCategory(item);
                    setCategoryOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      category === item &&
                        styles.dropdownOptionTextActive,
                    ]}
                  >
                    {item}
                  </Text>

                  {category === item && (
                    <Check size={17} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* บันทึกเพิ่มเติม */}
        <Text style={styles.label}>บันทึกเพิ่มเติม</Text>

        <TextInput
          style={styles.textArea}
          value={notes}
          onChangeText={setNotes}
          placeholder="เช่น สีขาว, ผ้าฝ้าย, ใช้ได้ทั้งวัน"
          placeholderTextColor="#B6A79C"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* ปุ่มบันทึก */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Check size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>

      {/* พื้นที่เว้นด้านล่าง ป้องกันปุ่มชนแถบเมนู */}
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1EA',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    marginTop: 45,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    marginRight: 14,
  },

  headerText: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#C17D55',
  },

  subtitle: {
    fontSize: 12,
    color: '#A8998E',
    marginTop: 3,
  },

  // Main Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EFE2D7',
  },

  label: {
    color: '#38302B',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 14,
  },

  // Image Buttons
  imageActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  photoButton: {
    flex: 1,
    backgroundColor: '#C17D55',
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  photoButtonSecondary: {
    flex: 1,
    backgroundColor: '#F1E4D9',
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#EFE2D7',
  },

  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  photoButtonTextSecondary: {
    color: '#2B241F',
    fontSize: 14,
    fontWeight: '700',
  },

  // Image Preview
  previewPlaceholder: {
    height: 200,
    borderRadius: 18,
    backgroundColor: '#F8F4EF',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  placeholderIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#F1E4D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  previewPlaceholderText: {
    color: '#998A80',
    fontSize: 14,
    fontWeight: '700',
  },

  placeholderHint: {
    color: '#B2A398',
    fontSize: 11,
    marginTop: 5,
  },

  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    marginBottom: 12,
    backgroundColor: '#F1E4D9',
  },

  // Text Input
  input: {
    backgroundColor: '#F8F4EF',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: '#38302B',
    marginBottom: 8,
  },

  // Dropdown
  dropdownWrap: {
    marginBottom: 10,
    position: 'relative',
    zIndex: 1,
    elevation: 1,
  },

  dropdownWrapOpen: {
    zIndex: 20,
    elevation: 20,
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

  dropdownMenu: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 5,
  },

  dropdownOption: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EEE8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  // Notes
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

  // Save Button
  saveButton: {
    marginTop: 24,
    backgroundColor: '#C17D55',
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    marginBottom: 10,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  // Bottom spacing
  bottomSpace: {
    height: 160,
  },
});
