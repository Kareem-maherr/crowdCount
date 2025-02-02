import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { router } from 'expo-router';

interface Visitor {
  id: string;
  name: string;
  time: string;
  type: string;
}

const dummyVisitors: Visitor[] = [
  { id: '1', name: 'John Doe', time: '09:30 AM', type: 'Employee' },
  { id: '2', name: 'Jane Smith', time: '10:15 AM', type: 'Visitor' },
  { id: '3', name: 'Mike Johnson', time: '11:00 AM', type: 'Contractor' },
  { id: '4', name: 'Sarah Williams', time: '11:45 AM', type: 'Employee' },
  { id: '5', name: 'Robert Brown', time: '12:30 PM', type: 'Visitor' },
];

export default function VisitorsScreen() {
  const renderItem = ({ item }: { item: Visitor }) => (
    <View style={styles.visitorCard}>
      <View style={styles.visitorInfo}>
        <Text style={styles.visitorName}>{item.name}</Text>
        <Text style={styles.visitorTime}>{item.time}</Text>
      </View>
      <View style={styles.visitorType}>
        <Text style={[styles.typeText, { color: item.type === 'Employee' ? '#4CAF50' : item.type === 'Visitor' ? '#2196F3' : '#FF9800' }]}>
          {item.type}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Visitors</Text>
      </View>
      
      <FlatList
        data={dummyVisitors}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF3F5',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  listContainer: {
    padding: 16,
  },
  visitorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  visitorTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  visitorType: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
