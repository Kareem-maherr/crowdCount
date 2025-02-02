import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Pressable, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  useSharedValue,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SharedElement } from "react-navigation-shared-element";
import { BlurView } from 'expo-blur';
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function VisitorsModal() {
  const router = useRouter();
  const scale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);
  const chartProgress = useSharedValue(0);

  // Visitor data
  const visitors = [
    { id: 1, name: "John Smith", entryTime: "14:30", location: "Main Entrance", status: "active" },
    { id: 2, name: "Emma Wilson", entryTime: "14:25", location: "Section A", status: "active" },
    { id: 3, name: "Michael Brown", entryTime: "14:20", location: "Food Court", status: "active" },
    { id: 4, name: "Sarah Davis", entryTime: "14:15", location: "Exhibition Hall", status: "active" },
    { id: 5, name: "James Johnson", entryTime: "14:10", location: "Main Hall", status: "active" },
    { id: 6, name: "Lisa Anderson", entryTime: "14:05", location: "Section B", status: "active" },
    { id: 7, name: "Robert Taylor", entryTime: "14:00", location: "Main Entrance", status: "active" },
    { id: 8, name: "Emily White", entryTime: "13:55", location: "Section C", status: "active" }
  ];

  // Animated styles
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const chartStyle = useAnimatedStyle(() => ({
    opacity: chartProgress.value,
    transform: [
      { 
        translateY: interpolate(
          chartProgress.value,
          [0, 1],
          [50, 0],
          Extrapolate.CLAMP
        )
      }
    ],
  }));

  const statsStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      { 
        translateY: interpolate(
          contentOpacity.value,
          [0, 1],
          [30, 0],
          Extrapolate.CLAMP
        )
      }
    ],
  }));

  // Start animations
  React.useEffect(() => {
    contentOpacity.value = withDelay(300, withSpring(1));
    chartProgress.value = withDelay(500, withSpring(1, { damping: 15 }));
  }, []);

  // Hourly data for the chart with more realistic numbers
  const hourlyData = {
    labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
    datasets: [{ 
      data: [45, 82, 168, 235, 412, 378, 245, 190],
      color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`, // blue color scheme
      strokeWidth: 2
    }],
  };

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSpring(0.95, {}, () => {
      contentOpacity.value = withTiming(0, { duration: 200 });
      chartProgress.value = withTiming(0, { duration: 200 }, () => {
        router.back();
      });
    });
  };

  return (
    <AnimatedPressable 
      style={styles.container} 
      onPress={handleClose}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="light" />
      
      <Animated.View 
        style={styles.content}
        entering={SlideInDown.springify().damping(15)}
        exiting={SlideOutDown.duration(200)}
      >
        <SharedElement id="visitors.card">
          <AnimatedLinearGradient
            colors={['#4CAF50', '#45a049']}
            style={[styles.card, cardStyle]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <SharedElement id="visitors.title">
                <Text style={styles.title}>Total Visitors</Text>
              </SharedElement>
              <SharedElement id="visitors.icon">
                <MaterialIcons name="trending-up" size={24} color="#fff" style={{ opacity: 0.8 }} />
              </SharedElement>
            </View>
            <View style={styles.statsContent}>
              <SharedElement id="visitors.count">
                <Text style={styles.count}>{visitors.length}</Text>
              </SharedElement>
              <SharedElement id="visitors.subtitle">
                <Text style={styles.subtitle}>Last 24 hours</Text>
              </SharedElement>
            </View>
          </AnimatedLinearGradient>
        </SharedElement>

        <Animated.View style={[styles.details, chartStyle]}>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Visitor Traffic</Text>
            <LineChart
              data={hourlyData}
              width={SCREEN_WIDTH - 48}
              height={220}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#4CAF50",
                },
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <Animated.View style={[styles.statsGrid, statsStyle]}>
            <View style={styles.statItem}>
              <MaterialIcons name="schedule" size={24} color="#4CAF50" style={styles.statIcon} />
              <Text style={styles.statLabel}>Peak Hours</Text>
              <Text style={styles.statValue}>12:00 - 14:00</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="timer" size={24} color="#4CAF50" style={styles.statIcon} />
              <Text style={styles.statLabel}>Average Stay</Text>
              <Text style={styles.statValue}>23 mins</Text>
            </View>

            {/* Visitors List */}
            <ScrollView style={styles.visitorsList} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Current Visitors</Text>
              {visitors.map((visitor) => (
                <View key={visitor.id} style={styles.visitorItem}>
                  <View style={styles.visitorInfo}>
                    <Text style={styles.visitorName}>{visitor.name}</Text>
                    <Text style={styles.visitorDetails}>
                      Entered at {visitor.entryTime} • {visitor.location}
                    </Text>
                  </View>
                  <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.View>

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleClose}
        >
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  statsContent: {
    justifyContent: 'center',
  },
  count: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  details: {
    marginTop: 24,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statItem: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  visitorsList: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  visitorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  visitorInfo: {
    flex: 1,
    marginRight: 12,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  visitorDetails: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
