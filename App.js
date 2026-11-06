
import React, { useContext } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  Bookmark,
  Home,
  Shirt,
  User,
  LogOut,
} from 'lucide-react-native';

import { AuthContext, AuthProvider } from './context/AuthContext';
import { PhotoProvider } from './context/PhotoContext';
import { HistoryProvider } from './context/HistoryContext';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ResultScreen from './screens/result';
import WardrobeScreen from './screens/WardrobeScreen';
import UploadClothesScreen from './screens/uploadclothes';
import UpdateClothesScreen from './screens/update';
import HistoryScreen from './screens/history';
import SHistoryScreen from './screens/shistory';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const WardrobeStackNav = createNativeStackNavigator();
const SavedStackNav = createNativeStackNavigator();

// ==============================
// HOME STACK
// ==============================
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
      />

      <Stack.Screen
        name="Result"
        component={ResultScreen}
      />
    </Stack.Navigator>
  );
}

// ==============================
// WARDROBE STACK
// ==============================
function WardrobeStack() {
  return (
    <WardrobeStackNav.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        gestureEnabled: true,
      }}
    >
      <WardrobeStackNav.Screen
        name="WardrobeMain"
        component={WardrobeScreen}
      />

      <WardrobeStackNav.Screen
        name="UploadClothes"
        component={UploadClothesScreen}
      />

      <WardrobeStackNav.Screen
        name="UpdateClothes"
        component={UpdateClothesScreen}
      />
    </WardrobeStackNav.Navigator>
  );
}

// ==============================
// HISTORY STACK
// ==============================
function SavedStack() {
  return (
    <SavedStackNav.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        gestureEnabled: true,
      }}
    >
      <SavedStackNav.Screen
        name="HistoryMain"
        component={HistoryScreen}
      />

      <SavedStackNav.Screen
        name="HistoryDetail"
        component={SHistoryScreen}
      />
    </SavedStackNav.Navigator>
  );
}

// ==============================
// PROFILE SCREEN
// ==============================
function ProfileScreen() {
  const { logout, user } = useContext(AuthContext);

  return (
    <View style={styles.profileScreen}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <User size={38} color="#C58A68" />
        </View>

        <Text style={styles.profileTitle}>
          My Profile
        </Text>

        <Text style={styles.profileSubtitle}>
          จัดการบัญชี OutfitReady ของคุณ
        </Text>
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.infoLabel}>
          ACCOUNT
        </Text>

        <Text style={styles.userText}>
          {user?.email || user?.name || 'Guest'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
        activeOpacity={0.8}
      >
        <LogOut size={19} color="#FFFFFF" />

        <Text style={styles.logoutText}>
          ออกจากระบบ
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ==============================
// BOTTOM TAB
// ==============================
function AppTabs() {
  const icons = {
    Home,
    Wardrobe: Shirt,
    Saved: Bookmark,
    Profile: User,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const Icon = icons[route.name] || Home;

        return {
          headerShown: false,

          // Bottom Tab Animation
          animation: 'shift',

          tabBarShowLabel: true,

          tabBarStyle: styles.tabBar,

          tabBarItemStyle: styles.tabItem,

          tabBarActiveTintColor: '#C17D55',

          tabBarInactiveTintColor: '#A5A09B',

          tabBarLabelStyle: styles.tabLabel,

          tabBarActiveBackgroundColor: '#F8EEE6',

          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <Icon
                size={22}
                color={color}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </View>
          ),
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'Home' }}
      />

      <Tab.Screen
        name="Wardrobe"
        component={WardrobeStack}
        options={{ title: 'Wardrobe' }}
      />

      <Tab.Screen
        name="Saved"
        component={SavedStack}
        options={{ title: 'History' }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// ==============================
// AUTH STACK
// ==============================
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 300,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
}

// ==============================
// APP NAVIGATOR
// ==============================
function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingText}>
          OutfitReady
        </Text>

        <Text style={styles.loadingSubtitle}>
          กำลังเตรียมแอป...
        </Text>
      </View>
    );
  }

  if (!user) {
    return <AuthStack />;
  }

  return <AppTabs />;
}

// ==============================
// MAIN APP
// ==============================
export default function App() {
  return (
    <AuthProvider>
      <PhotoProvider>
        <HistoryProvider>
          <SafeAreaProvider>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="#F8F5F1"
            />

            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </HistoryProvider>
      </PhotoProvider>
    </AuthProvider>
  );
}

// ==============================
// STYLES
// ==============================
const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: '#F8F5F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#C17D55',
    letterSpacing: 1,
  },

  loadingSubtitle: {
    fontSize: 13,
    color: '#99918A',
    marginTop: 8,
  },

  screen: {
    flex: 1,
    backgroundColor: '#F8F5F1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#292522',
    marginTop: 18,
  },

  screenSubtitle: {
    fontSize: 13,
    color: '#99918A',
    marginTop: 8,
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: '#F2E5DA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileScreen: {
    flex: 1,
    backgroundColor: '#F8F5F1',
    paddingHorizontal: 24,
    paddingTop: 70,
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 35,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: '#F2E5DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  profileTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#292522',
  },

  profileSubtitle: {
    fontSize: 13,
    color: '#99918A',
    marginTop: 7,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0E8E1',
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C17D55',
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  userText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#39332E',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#292522',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 25,
    gap: 10,
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  tabBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,

    height: 76,

    backgroundColor: '#FFFFFF',

    borderRadius: 25,

    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: '#F0E8E1',

    paddingTop: 7,
    paddingBottom: 7,
    paddingHorizontal: 7,

    elevation: 8,

    shadowColor: '#8C7666',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.10,
    shadowRadius: 12,
  },

  tabItem: {
    borderRadius: 18,
    marginHorizontal: 3,
    marginVertical: 4,
    overflow: 'hidden',
  },

  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 2,
  },

  iconContainer: {
    width: 38,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  activeIconContainer: {
    backgroundColor: '#F8EEE6',
  },
});
