
import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

import {
  ArrowLeft,
  Sparkles,
  Shirt,
  Check,
} from "lucide-react-native";

const getItemUri = (item) => {
  if (!item || typeof item !== "object") return null;

  const imageValue =
    item.uri ||
    item.imageUri ||
    item.image ||
    item.url ||
    null;

  if (typeof imageValue === "string") return imageValue;

  if (imageValue && typeof imageValue.uri === "string") {
    return imageValue.uri;
  }

  return null;
};

export default function ResultScreen({ route, navigation }) {
  const recommendation = route?.params?.recommendation || {
    title: "Everyday Fresh",
    text: "No recommendation data available yet.",
    items: [],
  };

  const items = Array.isArray(recommendation.items)
    ? recommendation.items
    : [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color="#C17D55" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>AI Result</Text>
          <Text style={styles.headerSubtitle}>
            Your outfit recommendation
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.aiBadge}>
          <Sparkles size={15} color="#C17D55" />
          <Text style={styles.aiBadgeText}>AI STYLIST</Text>
        </View>

        <View style={styles.resultIcon}>
          <Shirt size={35} color="#C17D55" />
        </View>

        <Text style={styles.resultLabel}>
          YOUR RECOMMENDED STYLE
        </Text>

        <Text style={styles.resultTitle}>
          {recommendation.title}
        </Text>

        <Text style={styles.resultText}>
          {recommendation.text}
        </Text>

        <View style={styles.divider} />

        <View style={styles.itemHeading}>
          <Text style={styles.itemLabel}>ไอเทมที่แนะนำ</Text>
          <Text style={styles.itemCount}>
            {items.length} items
          </Text>
        </View>

        <View style={styles.itemsContainer}>
          {items.length > 0 ? (
            items.map((item, index) => {
              const itemName =
                typeof item === "string"
                  ? item
                  : item?.name || item?.title || "เสื้อผ้า";

              const itemUri = getItemUri(item);

              const itemCategory =
                typeof item === "object" && item !== null
                  ? item.category
                  : null;

              return (
                <View
                  key={`${item?.id || itemName}-${index}`}
                  style={styles.itemCard}
                >
                  {itemUri ? (
                    <Image
                      source={{ uri: itemUri }}
                      style={styles.itemImage}
                      resizeMode="cover"
                      onError={(error) => {
                        console.log(
                          "Result image error:",
                          itemName,
                          itemUri,
                          error.nativeEvent
                        );
                      }}
                    />
                  ) : (
                    <View style={styles.itemImagePlaceholder}>
                      <Shirt size={30} color="#C17D55" />
                    </View>
                  )}

                  <View style={styles.itemDetails}>
                    <Text style={styles.chipText}>
                      {itemName}
                    </Text>

                    {itemCategory ? (
                      <Text style={styles.itemCategory}>
                        {itemCategory}
                      </Text>
                    ) : null}
                  </View>

                  <Check size={18} color="#C17D55" />
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Shirt size={35} color="#C17D55" />

              <Text style={styles.emptyTitle}>
                ยังไม่มีเสื้อผ้าที่แนะนำ
              </Text>

              <Text style={styles.emptyText}>
                กรุณาเพิ่มเสื้อผ้าพร้อมรูปภาพในตู้เสื้อผ้าก่อน
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <ArrowLeft size={19} color="#FFFFFF" />

        <Text style={styles.homeButtonText}>
          กลับหน้าหลัก
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 45,
    marginBottom: 24,
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFE2D7",
    marginRight: 13,
  },

  headerTitleContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#38302B",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#998A80",
    marginTop: 3,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#EFE2D7",
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
    color: "#C17D55",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  resultIcon: {
    width: 75,
    height: 75,
    borderRadius: 24,
    backgroundColor: "#F8EEE6",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 23,
    marginBottom: 18,
  },

  resultLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#B5AAA2",
    letterSpacing: 1.2,
  },

  resultTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: "#38302B",
    marginTop: 8,
  },

  resultText: {
    marginTop: 12,
    color: "#998A80",
    fontSize: 14,
    lineHeight: 23,
  },

  divider: {
    height: 1,
    backgroundColor: "#F0E5DC",
    marginVertical: 22,
  },

  itemHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  itemLabel: {
    color: "#38302B",
    fontSize: 16,
    fontWeight: "700",
  },

  itemCount: {
    color: "#B5AAA2",
    fontSize: 12,
  },

  itemsContainer: {
    gap: 11,
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F4EF",
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EFE2D7",
    minHeight: 105,
  },

  itemImage: {
    width: 75,
    height: 85,
    borderRadius: 12,
    backgroundColor: "#F1E4D9",
    marginRight: 12,
  },

  itemImagePlaceholder: {
    width: 75,
    height: 85,
    borderRadius: 12,
    backgroundColor: "#F1E4D9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },

  chipText: {
    color: "#5B4C42",
    fontSize: 14,
    fontWeight: "600",
  },

  itemCategory: {
    color: "#998A80",
    fontSize: 12,
    marginTop: 5,
  },

  emptyContainer: {
    backgroundColor: "#F8F4EF",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFE2D7",
  },

  emptyTitle: {
    color: "#5B4C42",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12,
  },

  emptyText: {
    color: "#998A80",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 6,
  },

  homeButton: {
    marginTop: 20,
    backgroundColor: "#C17D55",
    borderRadius: 15,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
