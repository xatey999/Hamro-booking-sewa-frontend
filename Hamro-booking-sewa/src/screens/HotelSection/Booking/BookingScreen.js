import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Server from '../../../Server/Server';
import { UserContext } from '../../UserContext/UserContext';
import { useNavigation } from '@react-navigation/native';

const BookingScreen = () => {
  const [bookings, setBookings] = useState([]);
  const apiURL = Server.primaryUrl;
  const { user } = useContext(UserContext) || {};
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        try {
          const response = await fetch(`${apiURL}/dashboard/view-booking-json-listing/${user.id}`);
          const data = await response.json();
          setBookings(data);
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      }
    };

    fetchBookings();
  }, [user]);

  const renderBookingItem = ({ item }) => {
    const userIdString = user ? user.id.toString() : '';

    if (item.hotel_user_id === userIdString) {
      return (

        <View style={styles.bookingContainer}> 
          {/* <Text style={styles.bookingText}>Booking ID: {item.id}</Text> */}
          <Text style={styles.bookingText}>Booking ID: {item.booking_id}</Text>
          <Text style={styles.bookingText}>Total Guest: {item.total_people}</Text>
          <Text style={styles.bookingText}>Arrival Date: {item.arrival_date}</Text>
          <Text style={styles.bookingText}>Arrival Time: {item.arrival_time}</Text>
          <Text style={styles.bookingText}>Booked on: {item.created_at.split('T')[0]}</Text>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('BookingDetails', { booked_id: item.id })}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <Text style={styles.text}>Loading...</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  bookingContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  bookingText: {
    fontSize: 16,
    marginBottom: 8,
  },
  detailsButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BookingScreen;
