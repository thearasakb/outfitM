
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  CalendarDays,
  Clock3,
  History,
  Sparkles,
  Trash2,
} from 'lucide-react-native';

import { HistoryContext } from '../context/HistoryContext';

export default function HistoryScreen({ navigation }) {
  const { history, deleteHistoryEntry, clearHistory } =
    useContext(HistoryContext);

  const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'ลบประวัติทั้งหมด',
      'คุณต้องการลบประวัติทั้งหมดใช่ไหม?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบทั้งหมด',
          style: 'destructive',
          onPress: clearHistory,
        },
      ]
    );
  };

  const handleDeleteItem = (id) => {
    Alert.alert(
      'ลบประวัติ',
      'คุณต้องการลบรายการนี้ใช่ไหม?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบ',
          style: 'destructive',
          onPress: () => deleteHistoryEntry(id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.logoHeader}>
        <View style={styles.logoIcon}>
          <History size={27} color="#C17D55" />
        </View>

        <Text style={styles.appName}>History</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Sparkles size={36} color="#C17D55" />
          </View>

          <Text style={styles.emptyTitle}>ยังไม่มีประวัติ</Text>

          <Text style={styles.emptyText}>
            ไปที่หน้าหลักแล้วลองแนะนำชุด
            เพื่อสร้างประวัติของคุณ
          </Text>
        </View>
      ) : (
        <>
          {/* Clear History */}
          <View style={styles.actionRow}>
            <Text style={styles.historyCount}>
              {history.length} รายการ
            </Text>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearHistory}
              activeOpacity={0.85}
            >
              <Trash2 size={15} color="#FFFFFF" />
              <Text style={styles.clearButtonText}>ลบทั้งหมด</Text>
            </TouchableOpacity>
          </View>

          {/* History List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {history.map((item) => (
              <View key={item.id} style={styles.card}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('HistoryDetail', { item })
                  }
                >
                  <View style={styles.cardTop}>
                    <View style={styles.badge}>
                      <Sparkles size={13} color="#A96F50" />
                      <Text style={styles.badgeText}>AI</Text>
                    </View>

                    <Text style={styles.dateText}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>

                  <Text style={styles.itemTitle}>
                    {item.title}
                  </Text>

                  <Text
                    style={styles.itemPreview}
                    numberOfLines={2}
                  >
                    {item.text}
                  </Text>

                  <View style={styles.cardDivider} />

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <CalendarDays
                        size={14}
                        color="#A58E7D"
                      />
                      <Text style={styles.metaText}>วันที่บันทึก</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Clock3
                        size={14}
                        color="#A58E7D"
                      />
                      <Text style={styles.metaText}>ดูรายละเอียด</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteItem(item.id)}
                  activeOpacity={0.85}
                >
                  <Trash2 size={16} color="#B65F58" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE',
    paddingTop: 55,
  },

  // Header
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 22,
    marginBottom: 25,
    marginTop: 5,
  },

  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#F1E5DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  appName: {
    color: "#C17D55",
    fontSize: 27,
    fontWeight: "800",
  },

  // Action Row
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginBottom: 15,
  },

  historyCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9B8879',
  },

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A96F50',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 7,
    elevation: 2,
    shadowColor: '#8C5B40',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // History List
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 120,
    gap: 14,
  },

  card: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EEE4DA',
    padding: 18,
    paddingRight: 52,
    elevation: 2,
    shadowColor: '#8C6B55',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7EEE7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
  },

  badgeText: {
    color: '#A96F50',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  dateText: {
    color: '#A3958A',
    fontSize: 10,
    fontWeight: '600',
  },

  itemTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#302720',
    marginBottom: 8,
  },

  itemPreview: {
    color: '#76685E',
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 15,
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#F0EAE4',
    marginBottom: 13,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  metaText: {
    color: '#A3958A',
    fontSize: 10,
    fontWeight: '600',
  },

  // Delete Button
  deleteButton: {
    position: 'absolute',
    right: 12,
    top: 14,
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#FBEFEE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 80,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: '#F1E5DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#302720',
  },

  emptyText: {
    fontSize: 13,
    color: '#9B8C80',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
});
