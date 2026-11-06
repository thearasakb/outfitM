
import React, { useContext, useMemo, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Sparkles, Shirt, ArrowRight } from "lucide-react-native";

import { HistoryContext } from "../context/HistoryContext";
import { PhotoContext } from "../context/PhotoContext";

export default function HomeScreen({ navigation }) {
  const { saveHistoryEntry } = useContext(HistoryContext);
  const { photos } = useContext(PhotoContext);
  const [destination, setDestination] = useState("");

  const recommendation = useMemo(() => {
    if (!destination.trim()) {
      return null;
    }

    const wardrobeItems = (photos || []).filter((item) => item && item.name);
    const getWardrobeSuggestions = (categories) => {
      const found = [];

      categories.forEach((category) => {
        const match = wardrobeItems.find((item) => item.category === category);
        if (match && !found.some((entry) => entry.id === match.id)) {
          found.push(match);
        }
      });

      if (found.length > 0) {
        return found.slice(0, 3).map((item) => item.name);
      }

      if (wardrobeItems.length > 0) {
        return wardrobeItems.slice(0, 3).map((item) => item.name);
      }

      return ["เสื้อที่คุณมีอยู่", "กางเกงที่คุณมีอยู่", "รองเท้าที่คุณมีอยู่"];
    };

    const lowerText = destination.trim().toLowerCase();

    if (
      lowerText.includes("ทำงาน") ||
      lowerText.includes("ประชุม") ||
      lowerText.includes("ออฟฟิศ")
    ) {
      return {
        title: "Smart Casual",
        text: "ลุคนี้เหมาะกับการดูดีแต่ไม่เครียด ให้ใช้สีพื้นกลมกลืน เช่น น้ำตาล ขาว หรือเทา ผสานกับเสื้อเชิ้ตหรือเสื้อผ้าที่มีความเรียบร้อย",
        items: getWardrobeSuggestions(["เสื้อ", "กางเกง", "รองเท้า"]),
      };
    }

    if (
      lowerText.includes("เที่ยว") ||
      lowerText.includes("คาเฟ่") ||
      lowerText.includes("เดินเล่น") ||
      lowerText.includes("นอกบ้าน")
    ) {
      return {
        title: "Weekend Chill",
        text: "สไตล์นี้ทำให้ดูสบายและมีความเป็นธรรมชาติ เหมาะกับการเดินและอยู่กับเพื่อน จัดวางด้วยสีอ่อนและผ้าเบา",
        items: getWardrobeSuggestions(["เสื้อ", "กางเกง", "กระโปรง"]),
      };
    }

    if (
      lowerText.includes("เดท") ||
      lowerText.includes("party") ||
      lowerText.includes("ค่ำ") ||
      lowerText.includes("อาหาร")
    ) {
      return {
        title: "Date Night",
        text: "ให้เน้นความเรียบหรูแบบไม่เคร่งเกินไป ใช้โทนเข้มและการตัดเย็บที่ดี",
        items: getWardrobeSuggestions(["เดรส", "เสื้อ", "รองเท้า"]),
      };
    }

    return {
      title: "Everyday Fresh",
      text: "สำหรับวันธรรมดา ลุคนี้ควรคงความสบายและดูมีพลัง เลือกชุดที่ใส่แล้วมั่นใจ",
      items: getWardrobeSuggestions(["เสื้อ", "กางเกง", "รองเท้า"]),
    };
  }, [destination, photos]);

  const handleSuggest = async () => {
    if (!recommendation) {
      return;
    }

    await saveHistoryEntry(recommendation);
    navigation.navigate("Result", { recommendation });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.appBar}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Shirt size={27} color="#C17D55" />
          </View>

          <Text style={styles.appName}>OutfitReady</Text>
        </View>

        <Text style={styles.appSubtitle}>
          Your personal wardrobe assistant
        </Text>
      </View>

      {/* Welcome Card */}
      <View style={styles.headerCard}>
        <View style={styles.aiBadge}>
          <Sparkles size={15} color="#C17D55" />

          <Text style={styles.aiBadgeText}>
            AI STYLIST
          </Text>
        </View>

        <Text style={styles.title}>
          วันนี้คุณจะไปไหน?
        </Text>

        <Text style={styles.subtitle}>
          บอกแพลนของคุณให้เรารู้ แล้วให้ OutfitReady
          ช่วยแนะนำสไตล์การแต่งตัวที่เหมาะกับวันของคุณ
        </Text>

        <View style={styles.decorCircle} />
      </View>

      {/* Input Card */}
      <View style={styles.formCard}>
        <View style={styles.cardHeading}>
          <View style={styles.headingIcon}>
            <Sparkles size={19} color="#C17D55" />
          </View>

          <Text style={styles.label}>
            อธิบายวันของคุณ
          </Text>
        </View>

        <Text style={styles.inputDescription}>
          วันนี้มีแพลนทำอะไรบ้าง?
        </Text>

        <TextInput
          style={styles.bigInput}
          placeholder="เช่น ไปทำงานที่ออฟฟิศ แล้วมีประชุมบ่าย..."
          placeholderTextColor="#B5AAA2"
          value={destination}
          onChangeText={setDestination}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <Text style={styles.inputHint}>
          ยิ่งบอกรายละเอียดมาก AI ก็ยิ่งแนะนำได้ตรงขึ้น
        </Text>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            !destination.trim() && styles.disabledButton,
          ]}
          onPress={handleSuggest}
          activeOpacity={0.85}
          disabled={!destination.trim()}
        >
          <Sparkles size={19} color="#FFFFFF" />

          <Text style={styles.primaryButtonText}>
            แนะนำชุดให้ฉัน
          </Text>

          <ArrowRight size={19} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

// ------------------------------
// Styles
// ------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1EA",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 120,
  },

  // Header
  appBar: {
    marginTop: 45,
    marginBottom: 24,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#F1E4D9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  appName: {
    color: "#C17D55",
    fontSize: 27,
    fontWeight: "800",
  },

  appSubtitle: {
    color: "#998A80",
    fontSize: 13,
    marginTop: 5,
  },

  // Welcome Card
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#EFE2D7",
    overflow: "hidden",
    marginBottom: 18,
  },

  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F8EEE6",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },

  aiBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#C17D55",
    letterSpacing: 1,
  },

  title: {
    marginTop: 17,
    color: "#38302B",
    fontSize: 27,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 10,
    color: "#998A80",
    fontSize: 14,
    lineHeight: 23,
  },

  decorCircle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F8EEE6",
    right: -35,
    bottom: -40,
    opacity: 0.8,
  },

  // Form Card
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EFE2D7",
  },

  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headingIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F8EEE6",
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    color: "#38302B",
    fontSize: 16,
    fontWeight: "700",
  },

  inputDescription: {
    color: "#998A80",
    fontSize: 13,
    marginTop: 17,
    marginBottom: 10,
  },

  bigInput: {
    backgroundColor: "#F8F4EF",
    borderWidth: 1,
    borderColor: "#EADDD1",
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 15,
    minHeight: 155,
    fontSize: 14,
    lineHeight: 22,
    color: "#38302B",
  },

  inputHint: {
    fontSize: 11,
    color: "#B5AAA2",
    marginTop: 9,
  },

  primaryButton: {
    marginTop: 20,
    backgroundColor: "#C17D55",
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  disabledButton: {
    opacity: 0.5,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },

});
