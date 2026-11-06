
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>OR</Text>
        </View>

        <Text style={styles.title}>OutfitReady</Text>
        <Text style={styles.subtitle}>
          แต่งตัวให้พร้อมในทุกวัน
        </Text>

        <View style={styles.card}>
          <Text style={styles.heading}>เข้าสู่ระบบ</Text>
          <Text style={styles.description}>
            ยินดีต้อนรับกลับมา!
          </Text>

          <Text style={styles.label}>ชื่อผู้ใช้</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกชื่อผู้ใช้"
            placeholderTextColor="#AAAAAA"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>รหัสผ่าน</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกรหัสผ่าน"
            placeholderTextColor="#AAAAAA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              ยังไม่มีบัญชี?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.registerLink}> สมัครสมาชิก</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          OutfitReady Mobile
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#D58A5A",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1D2328",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1D2328",
  },
  description: {
    color: "#999999",
    marginTop: 5,
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 18,
    color: "#1D2328",
  },
  loginButton: {
    height: 52,
    backgroundColor: "#D58A5A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },
  registerText: {
    color: "#888888",
    fontSize: 14,
  },
  registerLink: {
    color: "#D58A5A",
    fontWeight: "700",
    fontSize: 14,
  },
  footer: {
    textAlign: "center",
    color: "#BBBBBB",
    fontSize: 12,
    marginTop: 25,
  },
});
