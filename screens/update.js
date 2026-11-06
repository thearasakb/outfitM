import { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
  Check,
  Trash2,
  Camera,
  Image as ImageIcon,
  ArrowLeft,
  ChevronDown,
  X,
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

export default function UpdateClothesScreen({ navigation, route }) {
  const { setPhotos } = useContext(PhotoContext);
  const item = route?.params?.item;

  const [name, setName] = useState(item?.name || '');
  const [category, setCategory] = useState(item?.category || 'เสื้อ');
  const [notes, setNotes] = useState(item?.notes || '');
  const [selectedImage, setSelectedImage] = useState(
    item?.image || item?.uri || null
  );
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const canDelete = useMemo(() => !!item?.id, [item]);

  // ถ่ายภาพจากกล้อง
  const openCamera = async () => {
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
  };

  // เลือกภาพจากคลังรูป
  const pickFromLibrary = async () => {
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
  };

  // บันทึกข้อมูล
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

  // ลบรายการ
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
          setPhotos((prev) =>
            prev.filter((photo) => photo.id !== item.id)
          );
          navigation.navigate('WardrobeMain');
        },
      },
    ]);
  };

  return (
    <>
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
            <ArrowLeft size={21} color="#49382E" />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>แก้ไขชุด</Text>
            <Text style={styles.subtitle}>
              จัดการรายละเอียดเสื้อผ้าของคุณ
            </Text>
          </View>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
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
              <Text style={styles.photoButtonTextSecondary}>
                เลือกรูป
              </Text>
            </TouchableOpacity>
          </View>

          {/* รูปตัวอย่าง */}
          {selectedImage ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setImageModalVisible(true)}
              style={styles.previewImageContainer}
            >
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
                resizeMode="cover"
              />

              <View style={styles.zoomHint}>
                <Text style={styles.zoomHintText}>
                  แตะเพื่อดูรูปใหญ่
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewPlaceholder}>
              <View style={styles.placeholderIcon}>
                <ImageIcon size={30} color="#C4A58E" />
              </View>
              <Text style={styles.previewPlaceholderText}>
                ยังไม่มีรูปภาพ
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

          <View style={styles.dropdownWrap}>
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
                {categoryOptions.map((itemName) => (
                  <TouchableOpacity
                    key={itemName}
                    style={[
                      styles.dropdownOption,
                      category === itemName &&
                        styles.dropdownOptionActive,
                    ]}
                    onPress={() => {
                      setCategory(itemName);
                      setCategoryOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        category === itemName &&
                          styles.dropdownOptionTextActive,
                      ]}
                    >
                      {itemName}
                    </Text>

                    {category === itemName && (
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
            <Text style={styles.saveButtonText}>
              บันทึกการเปลี่ยนแปลง
            </Text>
          </TouchableOpacity>

          {/* ปุ่มลบ */}
          {canDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.85}
            >
              <Trash2 size={18} color="#A84F4F" />
              <Text style={styles.deleteButtonText}>
                ลบรายการนี้
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Popup แสดงรูปภาพ */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.popupOverlay}>
          {/* แตะด้านนอกเพื่อปิด */}
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}
          />

          <View style={styles.popupContainer}>
            <View style={styles.popupHeader}>

              <TouchableOpacity
                style={styles.popupClose}
                onPress={() => setImageModalVisible(false)}
                activeOpacity={0.8}
              >
                <X size={22} color="#49382E" />
              </TouchableOpacity>
            </View>

            {/* กรอบรูปภาพมุมมน */}
            <View style={styles.popupImageWrapper}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.popupImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 110,
    flexGrow: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
    marginTop: 45,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE2D8',
    marginRight: 14,
  },

  title: {
    color: '#C17D55',
    fontSize: 27,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: 12,
    color: '#A8998E',
    marginTop: 3,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EFE5DC',
    shadowColor: '#7C604B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  label: {
    color: '#49382E',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 16,
  },

  imageActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  photoButton: {
    flex: 1,
    backgroundColor: '#B97955',
    borderRadius: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  photoButtonSecondary: {
    flex: 1,
    backgroundColor: '#F5EBE3',
    borderRadius: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#EDE0D5',
  },

  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  photoButtonTextSecondary: {
    color: '#9B674B',
    fontSize: 14,
    fontWeight: '700',
  },

  previewImageContainer: {
    width: '100%',
    height: 210,
    borderRadius: 19,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#F1E5DB',
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },

  zoomHint: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  zoomHintText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  previewPlaceholder: {
    height: 200,
    borderRadius: 19,
    backgroundColor: '#FAF7F3',
    borderWidth: 1,
    borderColor: '#EDE2D8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  placeholderIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#F1E5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  previewPlaceholderText: {
    color: '#79675B',
    fontSize: 14,
    fontWeight: '700',
  },

  placeholderHint: {
    color: '#B2A398',
    fontSize: 11,
    marginTop: 5,
  },

  // Popup
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  popupContainer: {
    width: '100%',
    maxWidth: 400,
    height: 430,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },

  popupHeader: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  popupClose: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5EBE3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  popupImageWrapper: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F7F3EE',
  },

  popupImage: {
    width: '100%',
    height: '100%',
  },

  input: {
    backgroundColor: '#FAF7F3',
    borderWidth: 1,
    borderColor: '#EDE3D9',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#49382E',
  },

  dropdownWrap: {
    marginBottom: 2,
    zIndex: 10,
  },

  dropdownButton: {
    backgroundColor: '#FAF7F3',
    borderWidth: 1,
    borderColor: '#EDE3D9',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownValue: {
    color: '#49382E',
    fontSize: 15,
    fontWeight: '600',
  },

  dropdownMenu: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE3D9',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },

  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3ECE6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownOptionActive: {
    backgroundColor: '#B97955',
  },

  dropdownOptionText: {
    color: '#49382E',
    fontSize: 14,
    fontWeight: '600',
  },

  dropdownOptionTextActive: {
    color: '#FFFFFF',
  },

  textArea: {
    backgroundColor: '#FAF7F3',
    borderWidth: 1,
    borderColor: '#EDE3D9',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 15,
    minHeight: 120,
    fontSize: 15,
    color: '#49382E',
  },

  saveButton: {
    marginTop: 26,
    backgroundColor: '#B97955',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    shadowColor: '#A66C4D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 3,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  deleteButton: {
    marginTop: 14,
    backgroundColor: '#FFF5F3',
    borderWidth: 1,
    borderColor: '#F0D9D5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
  },

  deleteButtonText: {
    color: '#A84F4F',
    fontSize: 14,
    fontWeight: '700',
  },

  bottomSpace: {
    height: 20,
  },
});
