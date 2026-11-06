
import React, { useContext, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Sparkles, Home, ArrowRight } from "lucide-react-native";
import * as ImageManipulator from "expo-image-manipulator";

import { HistoryContext } from "../context/HistoryContext";
import { PhotoContext } from "../context/PhotoContext";

// ========================================
// OLLAMA CONFIG
// ========================================

const OLLAMA_URL = "http://10.10.50.77:11434";
const OLLAMA_MODEL = "qwen3-vl:8b-custom";
const BATCH_SIZE = 4;

// ========================================
// HELPER FUNCTIONS
// ========================================

// ดึง URI รูปจากข้อมูลเสื้อผ้า
const getPhotoUri = (item) => {
  if (!item || typeof item !== "object") return null;

  const value =
    item.uri ||
    item.imageUri ||
    item.image ||
    item.url ||
    null;

  if (typeof value === "string") return value;

  if (value && typeof value.uri === "string") {
    return value.uri;
  }

  return null;
};

// แปลงรูปภาพเป็น Base64
async function convertImageToBase64(uri) {
  if (!uri) {
    throw new Error("ไม่พบที่อยู่รูปภาพ");
  }

  // ตรวจสอบว่าฟังก์ชันของ ImageManipulator พร้อมใช้งาน
  if (typeof ImageManipulator.manipulateAsync !== "function") {
    throw new Error(
      "ไม่พบ ImageManipulator กรุณาติดตั้ง expo-image-manipulator แล้วเปิด Expo ใหม่"
    );
  }

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [
      {
        resize: {
          width: 768,
        },
      },
    ],
    {
      compress: 0.65,
      format:
        ImageManipulator.SaveFormat?.JPEG || "jpeg",
      base64: true,
    }
  );

  if (!result || !result.base64) {
    throw new Error("ไม่สามารถแปลงรูปภาพเป็น Base64 ได้");
  }

  return result.base64;
}

// แปลงข้อความ JSON ที่ AI ตอบกลับ
function parseAIResponse(responseText) {
  if (!responseText) {
    throw new Error("AI ไม่ได้ส่งคำตอบกลับมา");
  }

  let cleaned = responseText.trim();

  // รองรับกรณี AI ส่ง Markdown กลับมา
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    // ลองดึงเฉพาะส่วน JSON ออกมา
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.substring(start, end + 1));
    }

    throw new Error("รูปแบบคำตอบจาก AI ไม่ถูกต้อง");
  }
}

// ========================================
// CALL OLLAMA
// ========================================

async function callOllama(prompt, images = []) {
  let response;

  try {
    response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        images,
        stream: false,
        format: "json",
        options: {
          num_ctx: 16384,
          temperature: 0.2,
        },
      }),
    });
  } catch (error) {
    throw new Error(
      "เชื่อมต่อ Ollama ไม่ได้ กรุณาตรวจสอบว่าเปิด Local AI และเชื่อมต่อเครือข่ายเดียวกันแล้ว"
    );
  }

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Ollama Error (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.response) {
    throw new Error("Ollama ไม่ได้ส่งผลลัพธ์กลับมา");
  }

  return data.response;
}

// ========================================
// ANALYZE CLOTHING IMAGES
// ========================================

async function analyzeClothingBatch(batch, batchNumber) {
  // แปลงรูปทุกภาพในชุดนี้
  const images = await Promise.all(
    batch.map(async (item) => {
      const uri = getPhotoUri(item);
      return await convertImageToBase64(uri);
    })
  );

  // ข้อมูลกำกับรูปแต่ละภาพ
  const imageInformation = batch.map((item, index) => ({
    index,
    name: item.name || "ไม่ทราบชื่อ",
    category: item.category || "ไม่ระบุหมวดหมู่",
    notes: item.notes || "",
  }));

  const prompt = `
คุณคือ AI ผู้เชี่ยวชาญด้านแฟชั่นและการวิเคราะห์เสื้อผ้า

ฉันจะส่งรูปเสื้อผ้าจำนวน ${batch.length} รูปให้คุณ

ข้อมูลกำกับรูป:
${JSON.stringify(imageInformation, null, 2)}

หน้าที่ของคุณ:
1. วิเคราะห์รูปภาพแต่ละภาพจากสิ่งที่เห็นจริง
2. ระบุประเภทเสื้อผ้า เช่น เสื้อยืด เสื้อเชิ้ต กางเกงยีนส์ กระโปรง รองเท้า
3. วิเคราะห์สีของเสื้อผ้า
4. วิเคราะห์ลักษณะและรูปแบบของเสื้อผ้า
5. วิเคราะห์สไตล์ เช่น Casual, Formal, Streetwear
6. แยกแต่ละภาพออกจากกัน ห้ามรวมเสื้อผ้าหลายชิ้นเป็นชิ้นเดียว
7. ใช้ข้อมูลกำกับรูปประกอบการวิเคราะห์ แต่ให้ยึดภาพจริงเป็นหลัก

ข้อสำคัญ:
- วิเคราะห์ให้ครบทุกภาพ
- ห้ามข้ามภาพ
- ห้ามแต่งข้อมูลที่มองไม่เห็น
- index ต้องตรงกับลำดับภาพที่ส่งให้

ตอบกลับเป็น JSON เท่านั้น ตามรูปแบบนี้:

{
  "items": [
    {
      "index": 0,
      "visualDescription": "คำอธิบายเสื้อผ้าจากภาพ"
    }
  ]
}
`;

  const responseText = await callOllama(prompt, images);
  const result = parseAIResponse(responseText);

  if (!Array.isArray(result.items)) {
    throw new Error("AI วิเคราะห์รูปภาพไม่ถูกต้อง");
  }

  return result.items;
}

// ========================================
// GENERATE OUTFIT RECOMMENDATION
// ========================================

async function generateOutfit(destination, wardrobe) {
  const prompt = `
คุณคือ AI Stylist ผู้เชี่ยวชาญด้านการแต่งตัว

สถานการณ์ของผู้ใช้:
${destination}

ข้อมูลเสื้อผ้าทั้งหมดในตู้:
${JSON.stringify(wardrobe, null, 2)}

หน้าที่:
1. วิเคราะห์สถานการณ์และกิจกรรมของผู้ใช้
2. เลือกเสื้อผ้าที่มีอยู่จริงในตู้
3. จัดชุดให้เข้ากันทั้งสีและสไตล์
4. เลือกเสื้อผ้าที่เหมาะกับสถานการณ์
5. ห้ามเลือกเสื้อผ้าที่ไม่มีอยู่ในรายการ
6. ห้ามสร้าง ID ขึ้นมาเอง
7. พยายามเลือกชุดที่ประกอบด้วยเสื้อ กางเกงหรือกระโปรง และรองเท้า หากมี
8. เลือกเฉพาะชิ้นที่เข้ากันจริง ไม่จำเป็นต้องเลือกครบทุกหมวด

ตอบเป็น JSON เท่านั้น:

{
  "title": "ชื่อสไตล์การแต่งตัว",
  "text": "อธิบายเหตุผลในการเลือกชุดและวิธีแต่งตัว",
  "selectedIds": ["id ของเสื้อผ้าที่เลือก"]
}

ข้อสำคัญ:
selectedIds ต้องเป็น ID ที่มีอยู่ในข้อมูลเสื้อผ้าที่ได้รับเท่านั้น
`;

  const responseText = await callOllama(prompt);
  const result = parseAIResponse(responseText);

  if (
    !result ||
    !Array.isArray(result.selectedIds) ||
    result.selectedIds.length === 0
  ) {
    throw new Error("AI ไม่สามารถเลือกชุดจากตู้เสื้อผ้าได้");
  }

  return result;
}

// ========================================
// HOME SCREEN
// ========================================

export default function HomeScreen({ navigation }) {
  const { saveHistoryEntry } = useContext(HistoryContext);
  const { photos } = useContext(PhotoContext);

  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");

  // ========================================
  // HANDLE RECOMMENDATION
  // ========================================

  const handleSuggest = async () => {
    if (!destination.trim()) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกกิจกรรมของคุณก่อน");
      return;
    }

    if (loading) return;

    // เตรียมข้อมูลเสื้อผ้าที่มีรูปภาพ
    const wardrobeItems = (photos || [])
      .filter((item) => item && getPhotoUri(item))
      .map((item, index) => ({
        ...item,
        id: String(item.id || `photo-${index}`),
        uri: getPhotoUri(item),
      }));

    if (wardrobeItems.length === 0) {
      Alert.alert(
        "ยังไม่มีรูปภาพเสื้อผ้า",
        "กรุณาเพิ่มเสื้อผ้าพร้อมรูปภาพในตู้เสื้อผ้าก่อน"
      );
      return;
    }

    try {
      setLoading(true);

      // ------------------------------------
      // STEP 1: ANALYZE ALL IMAGES
      // ------------------------------------

      const analyzedWardrobe = [];

      const totalBatches = Math.ceil(
        wardrobeItems.length / BATCH_SIZE
      );

      for (
        let i = 0;
        i < wardrobeItems.length;
        i += BATCH_SIZE
      ) {
        const batch = wardrobeItems.slice(
          i,
          i + BATCH_SIZE
        );

        const batchNumber =
          Math.floor(i / BATCH_SIZE) + 1;

        setProgress(
          `กำลังวิเคราะห์รูปภาพ ${batchNumber}/${totalBatches}`
        );

        const analysis = await analyzeClothingBatch(
          batch,
          batchNumber
        );

        // ตรวจสอบผลการวิเคราะห์
        batch.forEach((item, index) => {
          const result = analysis.find(
            (entry) => Number(entry.index) === index
          );

          if (
            !result ||
            typeof result.visualDescription !== "string"
          ) {
            throw new Error(
              `AI ไม่สามารถวิเคราะห์รูปภาพ ${item.name || index + 1} ได้`
            );
          }

          analyzedWardrobe.push({
            id: item.id,
            name: item.name || "เสื้อผ้า",
            category: item.category || "",
            uri: item.uri,
            visualDescription: result.visualDescription,
          });
        });
      }

      // ------------------------------------
      // STEP 2: GENERATE OUTFIT
      // ------------------------------------

      setProgress("กำลังจัดชุดให้เหมาะกับกิจกรรมของคุณ...");

      const recommendation = await generateOutfit(
        destination,
        analyzedWardrobe
      );

      // ------------------------------------
      // STEP 3: MATCH SELECTED ITEMS
      // ------------------------------------

      const selectedIds = recommendation.selectedIds.map(
        (id) => String(id)
      );

      const selectedItems = analyzedWardrobe.filter(
        (item) => selectedIds.includes(item.id)
      );

      if (selectedItems.length === 0) {
        throw new Error(
          "ไม่พบเสื้อผ้าที่ AI เลือก กรุณาลองอีกครั้ง"
        );
      }

      // ------------------------------------
      // STEP 4: PREPARE RESULT
      // ------------------------------------

      const resultData = {
        title: recommendation.title || "ชุดแนะนำสำหรับคุณ",
        text:
          recommendation.text ||
          "ชุดที่ AI เลือกให้เหมาะกับกิจกรรมของคุณ",
        items: selectedItems.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          uri: item.uri,
        })),
      };

      // ------------------------------------
      // STEP 5: SAVE HISTORY
      // ------------------------------------

      setProgress("กำลังบันทึกคำแนะนำ...");

      await saveHistoryEntry(resultData);

      // ------------------------------------
      // STEP 6: NAVIGATE TO RESULT
      // ------------------------------------

      navigation.navigate("Result", {
        recommendation: resultData,
      });
    } catch (error) {
      console.log("AI Recommendation Error:", error);

      Alert.alert(
        "ไม่สามารถแนะนำชุดได้",
        error?.message ||
          "เกิดข้อผิดพลาด กรุณาตรวจสอบ Local AI แล้วลองใหม่อีกครั้ง"
      );
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.appBar}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Home size={27} color="#C17D55" />
          </View>

          <Text style={styles.appName}>OutfitReady</Text>
        </View>

        <Text style={styles.appSubtitle}>
          Your personal wardrobe assistant
        </Text>
      </View>

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
          editable={!loading}
        />

        <Text style={styles.inputHint}>
          ยิ่งบอกรายละเอียดมาก AI ก็ยิ่งแนะนำได้ตรงขึ้น
        </Text>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!destination.trim() || loading) &&
              styles.disabledButton,
          ]}
          onPress={handleSuggest}
          activeOpacity={0.85}
          disabled={!destination.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Sparkles size={19} color="#FFFFFF" />
          )}

          <Text style={styles.primaryButtonText}>
            {loading ? "กำลังวิเคราะห์..." : "แนะนำชุดให้ฉัน"}
          </Text>

          {!loading && (
            <ArrowRight size={19} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {loading && (
          <View style={styles.progressContainer}>
            <ActivityIndicator
              size="small"
              color="#C17D55"
            />

            <Text style={styles.progressText}>
              {progress || "กำลังเตรียมข้อมูล..."}
            </Text>

            <Text style={styles.progressHint}>
              กรุณารอสักครู่ การวิเคราะห์รูปภาพอาจใช้เวลา
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ========================================
// STYLES
// ========================================

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

  progressContainer: {
    alignItems: "center",
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F8F4EF",
    borderRadius: 15,
  },

  progressText: {
    marginTop: 10,
    fontSize: 13,
    color: "#C17D55",
    fontWeight: "700",
    textAlign: "center",
  },

  progressHint: {
    marginTop: 6,
    fontSize: 11,
    color: "#998A80",
    textAlign: "center",
  },
});
