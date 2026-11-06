
import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import {
  ArrowLeft,
  Sparkles,
  Shirt,
  Check,
} from "lucide-react-native";

export default function ResultScreen({ route, navigation }) {
  const recommendation = route?.params?.recommendation || {
    title: "Everyday Fresh",
    text: "No recommendation data available yet.",
    items: ["Classic", "Clean", "Comfort"],
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
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

      {/* Result Card */}
      <View style={styles.card}>
        <View style={styles.aiBadge}>
          <Sparkles size={15} color="#C17D55" />

          <Text style={styles.aiBadgeText}>
            AI STYLIST
          </Text>
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

        {/* Recommended Pieces */}
        <View style={styles.itemHeading}>
          <Text style={styles.itemLabel}>
            ไอเทมที่แนะนำ
          </Text>

          <Text style={styles.itemCount}>
            {recommendation.items.length} items
          </Text>
        </View>

        <View style={styles.itemsContainer}>
          {recommendation.items.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.itemCard}>
              <View style={styles.itemNumber}>
                <Text style={styles.itemNumberText}>
                  {index + 1}
                </Text>
              </View>

              <Text style={styles.chipText}>
                {item}
              </Text>

              <Check
                size={18}
                color="#C17D55"
              />
            </View>
          ))}
        </View>
      </View>

      {/* Back Home Button */}
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

  // Main Card
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

  // Recommended Items
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
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#EFE2D7",
  },

  itemNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F1E4D9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  itemNumberText: {
    color: "#C17D55",
    fontSize: 13,
    fontWeight: "800",
  },

  chipText: {
    color: "#5B4C42",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },

  // Back Button
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
