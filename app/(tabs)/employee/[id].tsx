import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Topbar } from '@/components/Topbar';

interface VisitLog {
  date: string;
  time: string;
  location: string;
  status: 'Granted' | 'Denied';
}

const generateDummyVisits = (): VisitLog[] => {
  const visits: VisitLog[] = [];
  const locations = ['CEO Office', 'Playground'];
  const currentDate = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    
    // Generate 1-3 visits per day
    const visitsPerDay = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < visitsPerDay; j++) {
      const hours = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
      const minutes = Math.floor(Math.random() * 60);
      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
      
      visits.push({
        date: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        time,
        location: locations[Math.floor(Math.random() * locations.length)],
        status: Math.random() > 0.1 ? 'Granted' : 'Denied', // 90% chance of access being granted
      });
    }
  }

  return visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const EmployeeDetails = () => {
  const { id, name, avatar } = useLocalSearchParams();
  const visits = generateDummyVisits();
  

  return (
    <SafeAreaView style={styles.container}>
      <Topbar 
        title="Employee Details" 
        onMenuPress={() => {}} 
        centerTitle={true}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: avatar as string }} 
            style={styles.avatar}
          />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.employeeId}>ID: {id}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{visits.length}</Text>
            <Text style={styles.statLabel}>Total Visits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {visits.filter(v => v.status === 'Granted').length}
            </Text>
            <Text style={styles.statLabel}>Granted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {visits.filter(v => v.status === 'Denied').length}
            </Text>
            <Text style={styles.statLabel}>Denied</Text>
          </View>
        </View>

        <View style={styles.visitsSection}>
          <Text style={styles.sectionTitle}>Recent Visits</Text>
          {visits.map((visit, index) => (
            <View key={index} style={styles.visitCard}>
              <View style={styles.visitHeader}>
                <View style={styles.visitDateTime}>
                  <Text style={styles.visitDate}>{visit.date}</Text>
                  <Text style={styles.visitTime}>{visit.time}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  visit.status === 'Granted' ? styles.statusGranted : styles.statusDenied
                ]}>
                  <MaterialIcons 
                    name={visit.status === 'Granted' ? 'check-circle' : 'cancel'} 
                    size={16} 
                    color={visit.status === 'Granted' ? '#22C55E' : '#EF4444'} 
                  />
                  <Text style={[
                    styles.statusText,
                    visit.status === 'Granted' ? styles.statusTextGranted : styles.statusTextDenied
                  ]}>
                    {visit.status}
                  </Text>
                </View>
              </View>
              <View style={styles.visitLocation}>
                <MaterialIcons name="location-on" size={16} color="#6B7280" />
                <Text style={styles.locationText}>{visit.location}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF3F5',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  employeeId: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  visitsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  visitCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  visitDateTime: {
    flex: 1,
  },
  visitDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  visitTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusGranted: {
    backgroundColor: '#DCFCE7',
  },
  statusDenied: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusTextGranted: {
    color: '#22C55E',
  },
  statusTextDenied: {
    color: '#EF4444',
  },
  visitLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default EmployeeDetails;
