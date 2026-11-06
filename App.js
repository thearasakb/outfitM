
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
  Clock3,
  History,
  Home,
  Shirt,
  User,
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
import ProfileScreen from './screens/profile';
import UpdateAccScreen from './screens/updateacc';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const WardrobeStackNav = createNativeStackNavigator();
const SavedStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

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
// PROFILE STACK
// ==============================
function ProfileStack() {
  return (
    <ProfileStackNav.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        gestureEnabled: true,
      }}
    >
      <ProfileStackNav.Screen
        name="ProfileMain"
        component={ProfileScreen}
      />

      <ProfileStackNav.Screen
        name="UpdateAcc"
        component={UpdateAccScreen}
      />
    </ProfileStackNav.Navigator>
  );
}

// ==============================
// BOTTOM TAB
// ==============================
function AppTabs() {
  const icons = {
    Home,
    Wardrobe: Shirt,
    Saved: History,
    Profile: User,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const Icon = icons[route.name] || Home;

        return {
          headerShown: false,

          animation: 'shift',

          tabBarShowLabel: true,

          tabBarStyle: styles.tabBar,

          tabBarItemStyle: styles.tabItem,

          tabBarActiveTintColor: '#C17D55',

          tabBarInactiveTintColor: '#A5A09B',

          tabBarLabelStyle: styles.tabLabel,

          tabBarActiveBackgroundColor: '#F8EEE6',

          tabBarHideOnKeyboard: true,

          sceneStyle: {
            backgroundColor: '#F5F1EA',
            
          },

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
        component={ProfileStack}
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

  // Bottom Tab แบบลอย มีช่องว่างรอบด้าน
  tabBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 20,
    height: 76,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
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
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },

  tabItem: {
    borderRadius:30,
    marginHorizontal: 1,
    marginVertical: 0,
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
