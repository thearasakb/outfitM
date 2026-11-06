import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { CalendarDays, Clock3, Sparkles, Trash2 } from 'lucide-react-native';

import { HistoryContext } from '../context/HistoryContext';

export default function HistoryScreen({ navigation }) {
  const { history, deleteHistoryEntry, clearHistory } = useContext(HistoryContext);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>ประวัติการแนะนำชุดของคุณ</Text>
        </View>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Sparkles size={34} color="#C17D55" />
          </View>

          <Text style={styles.emptyTitle}>ยังไม่มีประวัติ</Text>
          <Text style={styles.emptyText}>
            ไปที่หน้าหลักแล้วลองแนะนำชุดเพื่อสร้างประวัติของคุณ
          </Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              Alert.alert('ลบประวัติทั้งหมด', 'คุณต้องการลบประวัติทั้งหมดใช่ไหม', [
                { text: 'ยกเลิก', style: 'cancel' },
                { text: 'ลบทั้งหมด', style: 'destructive', onPress: clearHistory },
              ]);
            }}
            activeOpacity={0.8}
          >
            <Trash2 size={16} color="#FFFFFF" />
            <Text style={styles.clearButtonText}>ลบทั้งหมด</Text>
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {history.map((item) => (
              <View key={item.id} style={styles.card}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('HistoryDetail', { item })}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.badge}>
                      <Sparkles size={14} color="#C17D55" />
                      <Text style={styles.badgeText}>AI</Text>
                    </View>

                    <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                  </View>

                  <Text style={styles.itemTitle}>{item.title}</Text>

                  <Text style={styles.itemPreview} numberOfLines={2}>
                    {item.text}
                  </Text>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <CalendarDays size={14} color="#8B8078" />
                      <Text style={styles.metaText}>วันที่</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Clock3 size={14} color="#8B8078" />
                      <Text style={styles.metaText}>เวลา</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    Alert.alert('ลบประวัติ', 'คุณต้องการลบรายการนี้ใช่ไหม', [
                      { text: 'ยกเลิก', style: 'cancel' },
                      {
                        text: 'ลบ',
                        style: 'destructive',
                        onPress: () => deleteHistoryEntry(item.id),
                      },
                    ]);
                  }}
                  activeOpacity={0.8}
                >
                  <Trash2 size={15} color="#FFFFFF" />
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
    backgroundColor: '#F5F1EA',
    paddingTop: 15,
  },
  header: {
    paddingHorizontal: 22,
    marginTop: 45,
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#292522',
  },
  subtitle: {
    fontSize: 13,
    color: '#998A80',
    marginTop: 5,
  },
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
    borderColor: '#EFE2D7',
    padding: 18,
    paddingRight: 52,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8EEE6',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 5,
  },
  badgeText: {
    color: '#C17D55',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  dateText: {
    color: '#8B8078',
    fontSize: 11,
    fontWeight: '600',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#292522',
    marginBottom: 8,
  },
  itemPreview: {
    color: '#5E5551',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#8B8078',
    fontSize: 11,
    fontWeight: '600',
  },
  clearButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C17D55',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 18,
    marginBottom: 14,
    gap: 6,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteButton: {
    position: 'absolute',
    right: 12,
    top: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D66A6A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: '#F2E5DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#292522',
  },
  emptyText: {
    fontSize: 14,
    color: '#8A7F78',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
});
