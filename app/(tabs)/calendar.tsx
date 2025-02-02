import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Define interfaces for our data structures
interface LogEntry {
  id: number;
  name: string;
  time: string;
}

interface LogsData {
  [date: string]: LogEntry[];
}

// Dummy data for user logs
const dummyLogs: LogsData = {
  '2025-01-23': [
    { id: 1, name: 'John Doe', time: '09:15 AM' },
    { id: 2, name: 'Jane Smith', time: '10:30 AM' },
    { id: 3, name: 'Mike Johnson', time: '02:45 PM' },
  ],
  '2025-01-22': [
    { id: 4, name: 'Sarah Wilson', time: '08:00 AM' },
    { id: 5, name: 'Tom Brown', time: '11:20 AM' },
  ],
  '2025-01-21': [
    { id: 6, name: 'Emily Davis', time: '09:45 AM' },
    { id: 7, name: 'David Miller', time: '01:30 PM' },
    { id: 8, name: 'Lisa Anderson', time: '04:15 PM' },
  ],
  '2025-01-15': [
    { id: 9, name: 'Mohammed Salah', time: '07:00 AM' },
    { id: 10, name: 'Lionel Messi', time: '12:30 PM' },
    { id: 11, name: 'Neymar Jr', time: '03:45 PM' },
  ],
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLogs, setSelectedLogs] = useState<LogEntry[]>([]);

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setSelectedLogs(dummyLogs[day.dateString] || []);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Calendar</Text>
      </View>

      <View style={styles.content}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#4CAF50' },
            ...Object.keys(dummyLogs).reduce((acc, date) => ({
              ...acc,
              [date]: { marked: true, dotColor: '#4CAF50' }
            }), {})
          }}
          theme={{
            todayTextColor: '#4CAF50',
            selectedDayBackgroundColor: '#4CAF50',
            selectedDayTextColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#000000',
            dayTextColor: '#2d3748',
            arrowColor: '#4CAF50',
            monthTextColor: '#000000',
            textDayFontWeight: '400',
            textMonthFontWeight: '600',
            textDayHeaderFontWeight: '500',
          }}
          style={styles.calendar}
        />
        
        {selectedDate && (
          <View style={styles.logsContainer}>
            <Text style={styles.dateHeader}>Logs for {selectedDate}</Text>
            <ScrollView style={styles.scrollView}>
              {selectedLogs.length > 0 ? (
                selectedLogs.map((log) => (
                  <View key={log.id} style={styles.logItem}>
                    <View style={styles.logContent}>
                      <Text style={styles.userName}>{log.name}</Text>
                      <Text style={styles.timeText}>{log.time}</Text>
                    </View>
                    <MaterialIcons name="person" size={20} color="#4CAF50" />
                  </View>
                ))
              ) : (
                <View style={styles.noLogsContainer}>
                  <MaterialIcons name="event-busy" size={48} color="#9ca3af" />
                  <Text style={styles.noLogsText}>No logs for this date</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
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
  content: {
    flex: 1,
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 16,
    backgroundColor: '#fff',
  },
  logsContainer: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  logItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  noLogsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noLogsText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
  },
});
