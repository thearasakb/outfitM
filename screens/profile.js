
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

import {
  ArrowRight,
  Heart,
  LogOut,
  PencilLine,
  Shirt,
  User,
  CalendarDays,
  Sparkles,
} from 'lucide-react-native';

import { AuthContext } from '../context/AuthContext';
import { PhotoContext } from '../context/PhotoContext';

export default function ProfileScreen({ navigation }) {
  const { logout, user } = useContext(AuthContext);
  const { photos } = useContext(PhotoContext);

  const favoriteCount = (photos || []).filter(
    (item) => item?.favorite
  ).length;

  const joinedDate = user?.loggedInAt
    ? new Intl.DateTimeFormat('th-TH', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(user.loggedInAt))
    : '—';

  const handleLogout = () => {
    Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบใช่ไหม?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ออกจากระบบ',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.logoHeader}>
        <View style={styles.logoIcon}>
          <User size={27} color="#C17D55" />
        </View>

        <Text style={styles.appName}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={42} color="#A8795D" />
              </View>
            )}

            <View style={styles.onlineDot} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.welcomeText}>ยินดีต้อนรับ</Text>

            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'Guest'}
            </Text>

            <View style={styles.memberBadge}>
              <Sparkles size={12} color="#9B674B" />
              <Text style={styles.memberText}>
                OutfitReady Member
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.profileDivider} />

        <View style={styles.dateRow}>
          <View style={styles.dateIcon}>
            <CalendarDays size={17} color="#9B674B" />
          </View>

          <View>
            <Text style={styles.dateLabel}>วันที่สร้างบัญชี</Text>
            <Text style={styles.dateValue}>{joinedDate}</Text>
          </View>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.shirtIcon]}>
            <Shirt size={22} color="#A66F4D" />
          </View>

          <Text style={styles.statValue}>
            {photos?.length || 0}
          </Text>

          <Text style={styles.statLabel}>เสื้อผ้าทั้งหมด</Text>
          <Text style={styles.statUnit}>รายการ</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.heartIcon]}>
            <Heart size={22} color="#C47A76" fill="#C47A76" />
          </View>

          <Text style={styles.statValue}>
            {favoriteCount}
          </Text>

          <Text style={styles.statLabel}>รายการโปรด</Text>
          <Text style={styles.statUnit}>รายการ</Text>
        </View>
      </View>

      {/* Edit Profile */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('UpdateAcc')}
        activeOpacity={0.85}
      >
        <View style={styles.actionIcon}>
          <PencilLine size={21} color="#FFFFFF" />
        </View>

        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>
            แก้ไขข้อมูลส่วนตัว
          </Text>
          <Text style={styles.actionSubtitle}>
            เปลี่ยนชื่อ รูปโปรไฟล์ หรือรหัสผ่าน
          </Text>
        </View>

        <ArrowRight size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <View style={styles.logoutIcon}>
          <LogOut size={20} color="#B65F58" />
        </View>

        <Text style={styles.logoutText}>ออกจากระบบ</Text>

        <ArrowRight size={19} color="#B65F58" />
      </TouchableOpacity>

      <Text style={styles.footerText}>
        OUTFITREADY • YOUR STYLE, YOUR WAY
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE',
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 35,
  },

  // Logo Header
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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

  // Profile Card
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 21,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#EEE4DA',
    elevation: 3,
    shadowColor: '#8C6B55',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarContainer: {
    position: 'relative',
    marginRight: 17,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 25,
  },

  avatarPlaceholder: {
    width: 82,
    height: 82,
    borderRadius: 25,
    backgroundColor: '#F1E5DA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  onlineDot: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#83A887',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    right: -2,
    bottom: 2,
  },

  profileInfo: {
    flex: 1,
  },

  welcomeText: {
    fontSize: 12,
    color: '#A3958A',
    marginBottom: 5,
  },

  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#302720',
    marginBottom: 8,
  },

  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F7EEE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },

  memberText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9B674B',
  },

  profileDivider: {
    height: 1,
    backgroundColor: '#F0EAE4',
    marginVertical: 18,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  dateIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#F6EDE5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateLabel: {
    fontSize: 11,
    color: '#A3958A',
    marginBottom: 3,
  },

  dateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#55483F',
  },

  // Statistics
  statGrid: {
    flexDirection: 'row',
    gap: 13,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 19,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE4DA',
    elevation: 2,
    shadowColor: '#8C6B55',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  statIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  shirtIcon: {
    backgroundColor: '#F5E9DD',
  },

  heartIcon: {
    backgroundColor: '#F8E8E6',
  },

  statValue: {
    fontSize: 27,
    fontWeight: '900',
    color: '#302720',
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#68594F',
    marginTop: 3,
  },

  statUnit: {
    fontSize: 10,
    color: '#B0A197',
    marginTop: 3,
  },

  // Edit Button
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A96F50',
    padding: 17,
    borderRadius: 19,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#8C5B40',
    shadowOpacity: 0.15,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
  },

  actionIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  actionInfo: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  actionSubtitle: {
    fontSize: 10,
    color: '#F3DFD2',
    marginTop: 4,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0DEDA',
    padding: 15,
    borderRadius: 18,
  },

  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#FBEFEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  logoutText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#B65F58',
  },

  footerText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#B8A99D',
    textAlign: 'center',
    marginTop: 25,
  },
});
