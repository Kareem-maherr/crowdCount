import * as React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Visitor {
  id: string;
  name: string;
  checkInTime: string;
  status: 'active' | 'left';
  avatar: string;
}

interface VisitorsModalProps {
  visible: boolean;
  onClose: () => void;
}

const dummyVisitors: Visitor[] = [
  {
    id: '1',
    name: 'John Smith',
    checkInTime: '09:15 AM',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Emma Wilson',
    checkInTime: '10:30 AM',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Michael Brown',
    checkInTime: '11:45 AM',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '4',
    name: 'Sarah Davis',
    checkInTime: '08:20 AM',
    status: 'left',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: '5',
    name: 'James Johnson',
    checkInTime: '13:10 PM',
    status: 'left',
    avatar: 'https://i.pravatar.cc/150?img=5'
  }
];

export function VisitorsModal({ visible, onClose }: VisitorsModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Today's Visitors</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.visitorsList}>
            {dummyVisitors.map((visitor) => (
              <View key={visitor.id} style={styles.visitorItem}>
                <Image
                  source={{ uri: visitor.avatar }}
                  style={styles.avatar}
                />
                <View style={styles.visitorInfo}>
                  <Text style={styles.visitorName}>{visitor.name}</Text>
                  <Text style={styles.visitorTime}>Check-in: {visitor.checkInTime}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  visitor.status === 'active' ? styles.activeBadge : styles.leftBadge
                ]}>
                  <Text style={styles.statusText}>
                    {visitor.status === 'active' ? 'Active' : 'Left'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  visitorsList: {
    marginTop: 10,
  },
  visitorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  visitorInfo: {
    flex: 1,
    marginLeft: 15,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  visitorTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
  },
  leftBadge: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});