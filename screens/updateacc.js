
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
  ArrowLeft,
  Camera,
  Save,
  Trash2,
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
} from 'lucide-react-native';

import { AuthContext } from '../context/AuthContext';

export default function UpdateAccScreen({ navigation }) {
  const { user, updateProfile, changePassword, deleteAccount } =
    useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // เลือกรูปโปรไฟล์
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('แจ้งเตือน', 'กรุณาอนุญาตให้เข้าถึงรูปภาพ');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        mediaTypes: ['images'],
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเลือกรูปภาพได้');
    }
  };

  // บันทึกข้อมูล
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกชื่อผู้ใช้');
      return;
    }

    const wantsPasswordChange =
      currentPassword || newPassword || confirmPassword;

    if (wantsPasswordChange) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert(
          'ข้อมูลไม่ครบ',
          'กรุณากรอกรหัสผ่านเดิม รหัสผ่านใหม่ และยืนยันรหัสผ่านให้ครบ'
        );
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert(
          'รหัสผ่านไม่ถูกต้อง',
          'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร'
        );
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert(
          'รหัสผ่านไม่ตรงกัน',
          'กรุณาตรวจสอบรหัสผ่านใหม่อีกครั้ง'
        );
        return;
      }
    }

    try {
      setSaving(true);

      await updateProfile({
        name: name.trim(),
        avatar,
      });

      if (wantsPasswordChange) {
        await changePassword(currentPassword, newPassword);
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      Alert.alert('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      Alert.alert(
        'บันทึกไม่สำเร็จ',
        error.message || 'กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setSaving(false);
    }
  };

  // ลบบัญชี
  const handleDeleteAccount = () => {
    Alert.alert(
      'ลบบัญชี',
      'คุณต้องการลบบัญชีใช่หรือไม่?',
      [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ลบบัญชี',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();

              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert(
                'เกิดข้อผิดพลาด',
                error.message || 'ไม่สามารถลบบัญชีได้'
              );
            }
          },
        },
      ]
    );
  };

  // ช่องกรอกรหัสผ่าน
  const renderPasswordInput = (label, value, setValue, placeholder) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputBox}>
        <LockKeyhole size={18} color="#B77A58" />

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor="#B8AAA0"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.7}
        >
          {showPassword ? (
            <EyeOff size={19} color="#9A8980" />
          ) : (
            <Eye size={19} color="#9A8980" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color="#B77A58" />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>แก้ไขโปรไฟล์</Text>
            <Text style={styles.subtitle}>
              จัดการข้อมูลบัญชีของคุณ
            </Text>
          </View>
        </View>

        {/* Card */}
        <View style={styles.card}>

          {/* รูปโปรไฟล์ */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarFrame}>
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <UserRound size={42} color="#B77A58" />
                </View>
              )}

              <TouchableOpacity
                style={styles.cameraButton}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <Camera size={17} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.avatarTitle}>รูปโปรไฟล์</Text>
            <Text style={styles.avatarSubtitle}>
              แตะไอคอนกล้องเพื่อเปลี่ยนรูป
            </Text>
          </View>

          {/* ข้อมูลส่วนตัว */}
          <Text style={styles.sectionTitle}>ข้อมูลส่วนตัว</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ชื่อผู้ใช้</Text>

            <View style={styles.inputBox}>
              <UserRound size={18} color="#B77A58" />

              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="กรอกชื่อผู้ใช้"
                placeholderTextColor="#B8AAA0"
              />
            </View>
          </View>

          <View style={styles.divider} />

          {/* เปลี่ยนรหัสผ่าน */}
          <Text style={styles.sectionTitle}>เปลี่ยนรหัสผ่าน</Text>

          <Text style={styles.passwordHint}>
            หากไม่ต้องการเปลี่ยนรหัสผ่าน สามารถเว้นช่องนี้ว่างไว้ได้
          </Text>

          {renderPasswordInput(
            'รหัสผ่านเดิม',
            currentPassword,
            setCurrentPassword,
            'กรอกรหัสผ่านเดิม'
          )}

          {renderPasswordInput(
            'รหัสผ่านใหม่',
            newPassword,
            setNewPassword,
            'กรอกรหัสผ่านใหม่'
          )}

          {renderPasswordInput(
            'ยืนยันรหัสผ่านใหม่',
            confirmPassword,
            setConfirmPassword,
            'กรอกรหัสผ่านใหม่อีกครั้ง'
          )}

          {/* ปุ่มบันทึก */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              saving && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Save size={19} color="#FFFFFF" />

            <Text style={styles.saveText}>
              {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ลบบัญชี */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          activeOpacity={0.85}
        >
          <Trash2 size={18} color="#D45A5A" />

          <Text style={styles.deleteText}>
            ลบบัญชีผู้ใช้
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          OutfitReady
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F5F1EA',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5F1EA',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 140,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 15,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    borderWidth: 1,
    borderColor: '#EFE2D7',
  },

  title: {
    color: "#C17D55",
    fontSize: 27,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 12,
    color: '#A4958B',
    marginTop: 3,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#EFE2D7',
    padding: 20,
  },

  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },

  avatarFrame: {
    position: 'relative',
    width: 110,
    height: 110,
    marginBottom: 12,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 35,
    backgroundColor: '#F8EEE6',
  },

  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 35,
    backgroundColor: '#F8EEE6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraButton: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 37,
    height: 37,
    borderRadius: 14,
    backgroundColor: '#B77A58',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#51443C',
  },

  avatarSubtitle: {
    fontSize: 11,
    color: '#A4958B',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#51443C',
    marginBottom: 15,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#766A62',
    marginBottom: 8,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F3',
    borderWidth: 1,
    borderColor: '#EADDD1',
    borderRadius: 15,
    paddingHorizontal: 13,
    minHeight: 52,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#312D2A',
    paddingVertical: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#F0E7DF',
    marginVertical: 23,
  },

  passwordHint: {
    fontSize: 11,
    color: '#A4958B',
    lineHeight: 18,
    marginTop: -7,
    marginBottom: 17,
  },

  saveButton: {
    backgroundColor: '#B77A58',
    borderRadius: 15,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.6,
  },

  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0DADA',
    borderRadius: 16,
    padding: 16,
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  deleteText: {
    color: '#D45A5A',
    fontSize: 13,
    fontWeight: '700',
  },

  footer: {
    textAlign: 'center',
    color: '#B4A69D',
    fontSize: 11,
    marginTop: 25,
  },
});
