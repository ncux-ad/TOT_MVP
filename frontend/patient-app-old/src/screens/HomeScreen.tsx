import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button, Title, Paragraph } from 'react-native-paper';
import * as Location from 'expo-location';

import { useAuth } from '../contexts/AuthContext';
import { geoAPI, bookingAPI } from '../services/api';
import { HomeStackParamList } from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeScreen'>;

interface NearbyDoctor {
  doctor_id: string;
  distance: number;
  latitude: number;
  longitude: number;
  address?: string;
  specialization?: string;
  rating?: number;
  experience_years?: number;
  estimated_arrival_time?: number;
}

interface RecentBooking {
  id: string;
  status: string;
  call_type: string;
  address: string;
  created_at: string;
  doctor_id?: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  
  const [nearbyDoctors, setNearbyDoctors] = useState<NearbyDoctor[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await getCurrentLocation();
      await loadNearbyDoctors();
      await loadRecentBookings();
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходим доступ к геолокации');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setUserLocation({ latitude, longitude });

      // Отправляем местоположение на сервер
      await geoAPI.trackLocation({
        latitude,
        longitude,
        accuracy: location.coords.accuracy,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadNearbyDoctors = async () => {
    if (!userLocation) return;

    try {
      const response = await geoAPI.getNearbyDoctors({
        lat: userLocation.latitude,
        lon: userLocation.longitude,
        radius: 5.0,
        limit: 5,
      });
      setNearbyDoctors(response.data);
    } catch (error) {
      console.error('Error loading nearby doctors:', error);
    }
  };

  const loadRecentBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings({
        limit: 3,
        status_filter: 'pending,assigned,in_progress',
      });
      setRecentBookings(response.data);
    } catch (error) {
      console.error('Error loading recent bookings:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'Экстренный вызов',
      'Вы уверены, что хотите вызвать экстренную помощь?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Вызвать',
          style: 'destructive',
          onPress: () => navigation.navigate('Emergency'),
        },
      ]
    );
  };

  const handleBookDoctor = () => {
    navigation.navigate('DoctorList', {});
  };

  const handleViewBooking = (bookingId: string) => {
    navigation.navigate('BookingDetails', { bookingId });
  };

  const handleChat = (bookingId: string) => {
    navigation.navigate('Chat', { bookingId });
  };

  const renderWelcomeSection = () => (
    <Card style={styles.welcomeCard}>
      <Card.Content>
        <Title style={styles.welcomeTitle}>
          Добро пожаловать, {user?.first_name}!
        </Title>
        <Paragraph style={styles.welcomeSubtitle}>
          ТОТ - Твоя Точка Опоры всегда рядом
        </Paragraph>
      </Card.Content>
    </Card>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Title style={styles.sectionTitle}>Быстрые действия</Title>
      
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryAction]}
          onPress={handleBookDoctor}
        >
          <Ionicons name="medical" size={32} color="white" />
          <Text style={styles.actionButtonText}>Вызвать врача</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.emergencyAction]}
          onPress={handleEmergencyCall}
        >
          <Ionicons name="warning" size={32} color="white" />
          <Text style={styles.actionButtonText}>Экстренный вызов</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={() => navigation.navigate('Events')}
        >
          <Ionicons name="calendar" size={32} color="white" />
          <Text style={styles.actionButtonText}>Мероприятия</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={() => navigation.navigate('Chat', { bookingId: 'general' })}
        >
          <Ionicons name="chatbubbles" size={32} color="white" />
          <Text style={styles.actionButtonText}>Поддержка</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNearbyDoctors = () => (
    <View style={styles.sectionContainer}>
      <Title style={styles.sectionTitle}>Врачи поблизости</Title>
      
      {nearbyDoctors.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {nearbyDoctors.map((doctor) => (
            <Card key={doctor.doctor_id} style={styles.doctorCard}>
              <Card.Content>
                <Title style={styles.doctorName}>
                  Доктор {doctor.specialization || 'Терапевт'}
                </Title>
                <Paragraph style={styles.doctorInfo}>
                  Расстояние: {doctor.distance.toFixed(1)} км
                </Paragraph>
                {doctor.rating && (
                  <Paragraph style={styles.doctorRating}>
                    Рейтинг: {doctor.rating.toFixed(1)} ⭐
                  </Paragraph>
                )}
                {doctor.estimated_arrival_time && (
                  <Paragraph style={styles.arrivalTime}>
                    Приедет через ~{doctor.estimated_arrival_time} мин
                  </Paragraph>
                )}
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('DoctorProfile', { doctorId: doctor.doctor_id })}
                >
                  Подробнее
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Paragraph style={styles.emptyText}>
              Врачи поблизости не найдены
            </Paragraph>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  const renderRecentBookings = () => (
    <View style={styles.sectionContainer}>
      <Title style={styles.sectionTitle}>Активные вызовы</Title>
      
      {recentBookings.length > 0 ? (
        recentBookings.map((booking) => (
          <Card key={booking.id} style={styles.bookingCard}>
            <Card.Content>
              <Title style={styles.bookingTitle}>
                {booking.call_type === 'urgent' ? '🚨 Срочный вызов' : '📋 Обычный вызов'}
              </Title>
              <Paragraph style={styles.bookingAddress}>
                Адрес: {booking.address}
              </Paragraph>
              <Paragraph style={styles.bookingStatus}>
                Статус: {getStatusText(booking.status)}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => handleViewBooking(booking.id)}
              >
                Детали
              </Button>
              {booking.doctor_id && (
                <Button
                  mode="contained"
                  onPress={() => handleChat(booking.id)}
                >
                  Чат
                </Button>
              )}
            </Card.Actions>
          </Card>
        ))
      ) : (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Paragraph style={styles.emptyText}>
              У вас нет активных вызовов
            </Paragraph>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'Ожидает врача',
      assigned: 'Врач назначен',
      in_progress: 'Врач в пути',
      completed: 'Завершен',
      cancelled: 'Отменен',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {renderWelcomeSection()}
      {renderQuickActions()}
      {renderNearbyDoctors()}
      {renderRecentBookings()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    margin: 16,
    backgroundColor: '#007AFF',
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    color: 'white',
    opacity: 0.9,
  },
  quickActionsContainer: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryAction: {
    backgroundColor: '#007AFF',
  },
  emergencyAction: {
    backgroundColor: '#FF3B30',
  },
  secondaryAction: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionContainer: {
    margin: 16,
  },
  doctorCard: {
    width: 280,
    marginRight: 12,
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  doctorInfo: {
    fontSize: 14,
    color: '#666',
  },
  doctorRating: {
    fontSize: 14,
    color: '#FF9500',
  },
  arrivalTime: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  bookingCard: {
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingAddress: {
    fontSize: 14,
    color: '#666',
  },
  bookingStatus: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: '#f8f8f8',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
});

export default HomeScreen; 