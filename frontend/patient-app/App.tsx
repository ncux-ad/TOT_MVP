import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

// Экран авторизации
import AuthScreen from './src/screens/AuthScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// Основные экраны
import HomeScreen from './src/screens/HomeScreen';
import BookDoctorScreen from './src/screens/BookDoctorScreen';
import DoctorListScreen from './src/screens/DoctorListScreen';
import DoctorProfileScreen from './src/screens/DoctorProfileScreen';
import BookingScreen from './src/screens/BookingScreen';
import BookingDetailsScreen from './src/screens/BookingDetailsScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import EventsScreen from './src/screens/EventsScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import RatingScreen from './src/screens/RatingScreen';

// Контекст авторизации
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Типы
export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  BookDoctor: undefined;
  Bookings: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  DoctorList: { specialization?: string };
  DoctorProfile: { doctorId: string };
  Booking: { doctorId: string };
  BookingDetails: { bookingId: string };
  Chat: { bookingId: string };
  Emergency: undefined;
  Events: undefined;
  Payment: { bookingId: string };
  Rating: { bookingId: string };
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();

// Главный стек навигации
function MainNavigator() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}

// Табы для авторизованных пользователей
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'BookDoctor') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator}
        options={{ title: 'Главная' }}
      />
      <Tab.Screen 
        name="BookDoctor" 
        component={BookDoctorScreen}
        options={{ title: 'Вызвать врача' }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingScreen}
        options={{ title: 'Мои вызовы' }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ title: 'Чаты' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Профиль' }}
      />
    </Tab.Navigator>
  );
}

// Стек для главной страницы
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <HomeStack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{ title: 'ТОТ - Твоя Точка Опоры' }}
      />
      <HomeStack.Screen 
        name="DoctorList" 
        component={DoctorListScreen}
        options={{ title: 'Врачи поблизости' }}
      />
      <HomeStack.Screen 
        name="DoctorProfile" 
        component={DoctorProfileScreen}
        options={{ title: 'Профиль врача' }}
      />
      <HomeStack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ title: 'Заказ вызова' }}
      />
      <HomeStack.Screen 
        name="BookingDetails" 
        component={BookingDetailsScreen}
        options={{ title: 'Детали вызова' }}
      />
      <HomeStack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ title: 'Чат с врачом' }}
      />
      <HomeStack.Screen 
        name="Emergency" 
        component={EmergencyScreen}
        options={{ title: 'Экстренный вызов' }}
      />
      <HomeStack.Screen 
        name="Events" 
        component={EventsScreen}
        options={{ title: 'Мероприятия' }}
      />
      <HomeStack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ title: 'Оплата' }}
      />
      <HomeStack.Screen 
        name="Rating" 
        component={RatingScreen}
        options={{ title: 'Оценка' }}
      />
    </HomeStack.Navigator>
  );
}

// Основной компонент приложения
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Предотвращаем автоматическое скрытие splash screen
        await SplashScreen.preventAutoHideAsync();
        
        // Загружаем шрифты
        await Font.loadAsync({
          'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
          'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        });
        
        // Имитируем загрузку данных
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MainNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
} 