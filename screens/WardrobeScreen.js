
import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  PanResponder,
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  Heart,
  Shirt,
  Plus,
  Palette,
  Trash2,
  ChevronRight,
} from "lucide-react-native";

import { PhotoContext } from "../context/PhotoContext";

// ------------------------------
// หมวดหมู่ (ไม่มีไอคอน)
// ------------------------------

const categories = [
  { label: "รายการโปรด", icon: "heart" },
  { label: "เสื้อ" },
  { label: "กางเกง" },
  { label: "กระโปรง" },
  { label: "เดรส" },
  { label: "รองเท้า" },
  { label: "เครื่องประดับ" },
];

// ------------------------------
// ตั้งค่าการปัด
// ------------------------------

const ACTION_WIDTH = 160;
const ACTION_BUTTON_WIDTH = 80;

// ------------------------------
// ปุ่มด้านหลัง
// ------------------------------

function ActionButtons({ liked, onLike, onDelete }) {
  return (
    <View style={styles.actionsBehind}>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={onLike}
        activeOpacity={0.8}
      >
        <Heart
          size={27}
          color="#FFFFFF"
          fill={liked ? "#FFFFFF" : "transparent"}
        />

        <Text style={styles.actionText}>ถูกใจ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        activeOpacity={0.8}
      >
        <Trash2 size={27} color="#FFFFFF" />

        <Text style={styles.actionText}>ลบ</Text>
      </TouchableOpacity>
    </View>
  );
}

// ------------------------------
// เนื้อหารายการเสื้อผ้า
// ------------------------------

function RowContent({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.rowContent}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.clothesImage}
      />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>

        <Text style={styles.itemCategory}>
          {item.category}
        </Text>

        <Text style={styles.itemHint}>
          แตะเพื่อดูรายละเอียด
        </Text>
      </View>

      <ChevronRight size={26} color="#A9A09A" />
    </TouchableOpacity>
  );
}

// ------------------------------
// รายการเสื้อผ้าที่ปัดได้
// ------------------------------

function SwipeClothesItem({
  item,
  isOpen,
  onRequestOpen,
  onView,
  onLike,
  onDelete,
}) {
  const [translateX] = useState(() => new Animated.Value(0));
  let startX = 0;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isOpen ? -ACTION_WIDTH : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }, [isOpen, translateX]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,

        onMoveShouldSetPanResponder: (_, gesture) => {
          return (
            Math.abs(gesture.dx) > 8 &&
            Math.abs(gesture.dx) >
              Math.abs(gesture.dy) * 1.2
          );
        },

        onPanResponderGrant: () => {
          startX = isOpen ? -ACTION_WIDTH : 0;
        },

        onPanResponderMove: (_, gesture) => {
          const nextX = startX + gesture.dx;
          const limitedX = Math.max(-ACTION_WIDTH, Math.min(0, nextX));
          translateX.setValue(limitedX);
        },

        onPanResponderRelease: (_, gesture) => {
          const nextX = startX + gesture.dx;
          const shouldOpen = nextX < -ACTION_WIDTH / 2;
          onRequestOpen(shouldOpen ? item.id : null);
        },

        onPanResponderTerminate: () => {
          onRequestOpen(isOpen ? item.id : null);
        },
      }),
    [isOpen, item.id, onRequestOpen, translateX]
  );

  const handleLike = () => {
    onRequestOpen(null);
    onLike(item);
  };

  const handleDelete = () => {
    onRequestOpen(null);
    onDelete(item);
  };

  const handleViewPress = () => {
    onRequestOpen(null);
    onView(item);
  };

  return (
    <View style={styles.rowWrap}>
      <ActionButtons
        liked={item.favorite}
        onLike={handleLike}
        onDelete={handleDelete}
      />

      <Animated.View
        style={[
          styles.animatedRow,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <RowContent item={item} onPress={handleViewPress} />
      </Animated.View>
    </View>
  );
}

// ------------------------------
// Wardrobe Screen
// ------------------------------

export default function WardrobeScreen({ navigation }) {
  const {
    photos,
    loading,
    toggleFavorite,
    removePhoto,
  } = useContext(PhotoContext);

  const [activeCategory, setActiveCategory] =
    useState("รายการโปรด");

  const [openItemId, setOpenItemId] =
    useState(null);

  const savedItems = (photos || []).map((photo) => ({
    id: photo.id,
    name: photo.name,
    category: photo.category,
    image: photo.uri,
    favorite: photo.favorite,
    isSaved: true,
  }));

  const items = savedItems;

  // กรองหมวดหมู่
  const filteredItems = items.filter((item) => {
    if (activeCategory === "รายการโปรด") {
      return item.favorite;
    }

    return item.category === activeCategory;
  });

  // เพิ่มเสื้อผ้า
  const addItem = () => {
    navigation.navigate("UploadClothes");
  };

  // ดูรายละเอียด
  const handleView = (item) => {
    navigation.navigate("UpdateClothes", {
      item,
    });
  };

  // ถูกใจ
  const handleLike = (item) => {
    toggleFavorite(item.id);
  };

  // ลบเสื้อผ้า
  const handleDelete = (item) => {
    Alert.alert(
      "ลบรายการเสื้อผ้า",
      `ต้องการลบ ${item.name} หรือไม่?`,
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ลบ",
          style: "destructive",
          onPress: () => {
            removePhoto(item.id);
            setOpenItemId(null);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.logoRow}>
            <View style={styles.headerIcon}>
              <Shirt size={27} color="#C17D55" />
            </View>

            <Text style={styles.logo}>OutfitReady</Text>
          </View>

          <Text style={styles.subtitle}>
            จัดการตู้เสื้อผ้าของคุณ
          </Text>
        </View>
      </View>

      {/* Category - ไม่มีไอคอน */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => {
          const active =
            activeCategory === category.label;
          const isFavorites = category.label === "รายการโปรด";

          return (
            <TouchableOpacity
              key={category.label}
              style={[
                styles.categoryButton,
                active && styles.categoryButtonActive,
              ]}
              onPress={() => {
                setActiveCategory(category.label);
                setOpenItemId(null);
              }}
              activeOpacity={0.8}
            >
              {isFavorites && (
                <Heart
                  size={14}
                  color={active ? "#FFFFFF" : "#C17D55"}
                  fill={active ? "#FFFFFF" : "#C17D55"}
                  style={styles.categoryIcon}
                />
              )}

              <Text
                style={[
                  styles.categoryText,
                  active && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* จำนวนรายการ */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {activeCategory}
        </Text>

        <Text style={styles.itemCount}>
          {filteredItems.length} รายการ
        </Text>
      </View>

      {/* รายการเสื้อผ้า */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator
            size="large"
            color="#C17D55"
          />

          <Text style={styles.emptyText}>
            กำลังโหลดเสื้อผ้า...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {filteredItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Palette size={42} color="#C17D55" />
              </View>

              <Text style={styles.emptyTitle}>
                ยังไม่มีเสื้อผ้า
              </Text>

              <Text style={styles.emptyText}>
                ลองเพิ่มเสื้อผ้าของคุณกันเถอะ
              </Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <SwipeClothesItem
                key={item.id}
                item={item}
                isOpen={openItemId === item.id}
                onRequestOpen={setOpenItemId}
                onView={handleView}
                onLike={handleLike}
                onDelete={handleDelete}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* ปุ่มเพิ่มเสื้อผ้า */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={addItem}
        activeOpacity={0.85}
      >
        <Plus size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// ------------------------------
// Styles
// ------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1EA",
    paddingTop: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    marginBottom: 22,
    marginTop: 45,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    fontSize: 27,
    fontWeight: "800",
    color: "#C17D55",
  },

  subtitle: {
    fontSize: 14,
    color: "#998A80",
    marginTop: 4,
  },

  headerIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 16,
    backgroundColor: "#F1E4D9",
    justifyContent: "center",
    alignItems: "center",
  },

  categoryScroll: {
    maxHeight: 52,
    flexGrow: 0,
  },

  categoryContainer: {
    paddingHorizontal: 18,
    gap: 9,
    alignItems: "center",
  },

  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
  },

  categoryButtonActive: {
    backgroundColor: "#C17D55",
  },

  categoryIcon: {
    marginRight: 6,
  },

  categoryText: {
    fontSize: 13,
    color: "#9B8171",
    fontWeight: "600",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    marginTop: 24,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#38302B",
  },

  itemCount: {
    fontSize: 13,
    color: "#A3948B",
  },

  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 140,
    gap: 16,
  },

  rowWrap: {
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    position: "relative",
  },

  actionsBehind: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    flexDirection: "row",
  },

  favoriteButton: {
    width: ACTION_BUTTON_WIDTH,
    backgroundColor: "#C17D55",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },

  deleteButton: {
    width: ACTION_BUTTON_WIDTH,
    backgroundColor: "#E84C5B",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },

  actionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  animatedRow: {
    height: 150,
    backgroundColor: "#FFFFFF",
    zIndex: 2,
  },

  rowContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 15,
  },

  clothesImage: {
    width: 125,
    height: 125,
    borderRadius: 16,
    backgroundColor: "#F1ECE7",
  },

  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },

  itemName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#38302B",
  },

  itemCategory: {
    fontSize: 14,
    color: "#C17D55",
    marginTop: 7,
  },

  itemHint: {
    fontSize: 12,
    color: "#B5AAA2",
    marginTop: 7,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 65,
  },

  emptyIcon: {
    width: 85,
    height: 85,
    borderRadius: 28,
    backgroundColor: "#F1E4D9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 17,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5B4C42",
  },

  emptyText: {
    fontSize: 14,
    color: "#A3948B",
    marginTop: 8,
  },

  addButton: {
    position: "absolute",
    bottom: 105,
    right: 10,
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "#C17D55",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    zIndex: 99,
  },
});
