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
  ArrowLeft,
  CalendarDays,
  Clock3,
  Sparkles,
  Check,
  Shirt,
  Trash2,
} from 'lucide-react-native';

import { HistoryContext } from '../context/HistoryContext';

export default function SHistoryScreen({ route, navigation }) {
  const { deleteHistoryEntry } = useContext(HistoryContext);
  const item = route?.params?.item || {
    title: 'Everyday Fresh',
    text: 'No recommendation data available yet.',
    items: ['Classic', 'Clean', 'Comfort'],
    createdAt: new Date().toISOString(),
    id: 'demo',
  };

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color="#C17D55" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>รายละเอียดชุด</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert('ลบประวัติ', 'คุณต้องการลบรายการนี้ใช่ไหม', [
              { text: 'ยกเลิก', style: 'cancel' },
              {
                text: 'ลบ',
                style: 'destructive',
                onPress: () => {
                  deleteHistoryEntry(item.id);
                  navigation.goBack();
                },
              },
            ]);
          }}
          activeOpacity={0.8}
        >
          <Trash2 size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.aiBadge}>
          <Sparkles size={14} color="#C17D55" />
          <Text style={styles.aiBadgeText}>AI STYLIST</Text>
        </View>

        <View style={styles.resultIcon}>
          <Shirt size={34} color="#C17D55" />
        </View>

        <Text style={styles.resultLabel}>YOUR RECOMMENDED STYLE</Text>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultText}>{item.text}</Text>

        <View style={styles.metaBox}>
          <View style={styles.metaItem}>
            <CalendarDays size={15} color="#8B8078" />
            <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
          </View>

          <View style={styles.metaItem}>
            <Clock3 size={15} color="#8B8078" />
            <Text style={styles.metaText}>บันทึกอัตโนมัติ</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemHeading}>
          <Text style={styles.itemLabel}>ไอเทมที่แนะนำ</Text>
          <Text style={styles.itemCount}>{item.items?.length || 0} items</Text>
        </View>

        <View style={styles.itemsContainer}>
          {(item.items || []).map((entry, index) => (
            <View key={`${entry}-${index}`} style={styles.itemCard}>
              <View style={styles.itemNumber}>
                <Text style={styles.itemNumberText}>{index + 1}</Text>
              </View>

              <Text style={styles.chipText}>{entry}</Text>
              <Check size={18} color="#C17D55" />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1EA',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE2D7',
    marginRight: 13,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#38302B',
  },
  card: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#EFE2D7',
    paddingTop: 26,
  },
  deleteButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D66A6A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F8EEE6',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  aiBadgeText: {
    color: '#C17D55',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  resultIcon: {
    width: 75,
    height: 75,
    borderRadius: 24,
    backgroundColor: '#F8EEE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 23,
    marginBottom: 18,
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B5AAA2',
    letterSpacing: 1,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#292522',
    marginTop: 10,
  },
  resultText: {
    fontSize: 15,
    color: '#5E5551',
    lineHeight: 24,
    marginTop: 14,
  },
  metaBox: {
    backgroundColor: '#F7F1EC',
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    color: '#504A46',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0E8E1',
    marginTop: 22,
    marginBottom: 18,
  },
  itemHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemLabel: {
    color: '#38302B',
    fontSize: 15,
    fontWeight: '800',
  },
  itemCount: {
    color: '#8D8178',
    fontSize: 12,
    fontWeight: '700',
  },
  itemsContainer: {
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F3EF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  itemNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#C17D55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38302B',
    flex: 1,
  },
});
