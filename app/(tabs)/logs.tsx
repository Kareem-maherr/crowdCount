import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInLeft,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { router } from "expo-router";

interface LogEntry {
  id: string;
  person_name: string;
  face_image_b64: string;
  event_time: string;
}

const LogsScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.11.134:8001/logs');
      const data = await response.json();
      
      // Take the last 10 entries
      const lastTenLogs = data.slice(-10).reverse();
      setLogs(lastTenLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch logs when component mounts and when filter changes
  useEffect(() => {
    fetchLogs();
    // Set up an interval to fetch logs every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, [selectedFilter]);

  const buttonScale = {
    today: useSharedValue(1),
    yesterday: useSharedValue(1),
    lastWeek: useSharedValue(1),
  };

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
    console.log("Selected filter:", filter);

    // Animate the pressed button
    buttonScale[filter as keyof typeof buttonScale].value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
  };

  const getAnimatedStyle = (filter: keyof typeof buttonScale) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: buttonScale[filter].value }],
      backgroundColor: selectedFilter === filter ? "#3B82F6" : "#F3F4F6",
    }));

  const LogCard = ({ log, index }: { log: LogEntry; index: number }) => {
    const scale = useSharedValue(0.8);
    const [isExpanded, setIsExpanded] = useState(false);
    const expandAnimation = useSharedValue(0);
    const avatarOpacity = useSharedValue(0);
    const buttonScale = useSharedValue(1);

    React.useEffect(() => {
      scale.value = withDelay(
        index * 100,
        withSpring(1, {
          damping: 12,
          stiffness: 100,
        })
      );
    }, []);

    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
      expandAnimation.value = withSpring(isExpanded ? 0 : 1, {
        damping: 12,
        stiffness: 100,
      });
      avatarOpacity.value = withSpring(isExpanded ? 0 : 1, {
        damping: 12,
        stiffness: 100,
      });
    };

    const handleViewPress = () => {
      buttonScale.value = withSequence(
        withSpring(0.95, { damping: 10, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
      router.push({
        pathname: "/employee/[id]",
        params: {
          id: log.id,
          name: log.person_name,
          face_image: log.face_image_b64,
        },
      });
    };

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const expandStyle = useAnimatedStyle(() => ({
      height: interpolate(expandAnimation.value, [0, 1], [90, 260]),
    }));

    const avatarStyle = useAnimatedStyle(() => ({
      opacity: avatarOpacity.value,
    }));

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: buttonScale.value }],
    }));

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100)}
        style={[styles.card, animatedStyle, expandStyle]}
      >
        <TouchableOpacity
          style={styles.cardContent}
          onPress={toggleExpand}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              {log.face_image_b64 ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${log.face_image_b64}` }}
                  style={styles.avatar}
                />
              ) : (
                <MaterialIcons name="account-circle" size={36} color="#6B7280" />
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{log.person_name}</Text>
              <Text style={styles.timestamp}>
                {new Date(log.event_time).toLocaleString()}
              </Text>
            </View>
            <MaterialIcons
              name={isExpanded ? "expand-less" : "expand-more"}
              size={24}
              color="#6B7280"
            />
          </View>

          {isExpanded && (
            <Animated.View entering={FadeIn} style={styles.expandedContent}>
              <View style={styles.expandedContentRow}>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="access-time" size={20} color="#6B7280" />
                    <Text style={styles.detailText}>
                      Time: {new Date(log.event_time).toLocaleTimeString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="calendar-today" size={20} color="#6B7280" />
                    <Text style={styles.detailText}>
                      Date: {new Date(log.event_time).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons
                      name="verified-user"
                      size={20}
                      color="#22C55E"
                    />
                    <Text style={[styles.detailText, styles.successText]}>
                      Detected
                    </Text>
                  </View>
                </View>

                {log.face_image_b64 && (
                  <Animated.View
                    entering={FadeIn.delay(200)}
                    style={[styles.avatarContainer, avatarStyle]}
                  >
                    <Image
                      source={{ uri: `data:image/jpeg;base64,${log.face_image_b64}` }}
                      style={styles.expandedAvatar}
                    />
                  </Animated.View>
                )}
              </View>
              <Animated.View 
                entering={FadeIn.delay(300)}
                style={[styles.viewButtonContainer]}
              >
                <TouchableOpacity
                  onPress={handleViewPress}
                  activeOpacity={0.8}
                >
                  <Animated.View style={[styles.viewButton, buttonAnimatedStyle]}>
                    <MaterialIcons name="visibility" size={20} color="#FFFFFF" />
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Topbar
        title="Activity Logs"
        onMenuPress={() => setIsSidebarOpen(true)}
        showDateButton={false}
        centerTitle={true}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.filterContainer}>
          <View style={styles.buttonGroup}>
            <Animated.View entering={FadeInLeft.delay(100).springify()}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  styles.filterButtonLeft,
                  selectedFilter === "today" && styles.filterButtonActive,
                ]}
                onPress={() => handleFilterPress("today")}
              >
                <Animated.View style={getAnimatedStyle("today")}>
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedFilter === "today" && styles.filterButtonTextActive,
                    ]}
                  >
                    Today
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.buttonDivider} />

            <Animated.View entering={FadeInLeft.delay(200).springify()}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedFilter === "yesterday" && styles.filterButtonActive,
                ]}
                onPress={() => handleFilterPress("yesterday")}
              >
                <Animated.View style={getAnimatedStyle("yesterday")}>
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedFilter === "yesterday" && styles.filterButtonTextActive,
                    ]}
                  >
                    Yesterday
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.buttonDivider} />

            <Animated.View entering={FadeInLeft.delay(300).springify()}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  styles.filterButtonRight,
                  selectedFilter === "lastWeek" && styles.filterButtonActive,
                ]}
                onPress={() => handleFilterPress("lastWeek")}
              >
                <Animated.View style={getAnimatedStyle("lastWeek")}>
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedFilter === "lastWeek" && styles.filterButtonTextActive,
                    ]}
                  >
                    Last Week
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* View Toggle Buttons */}
          <View style={styles.viewToggleContainer}>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === 'list' && styles.viewToggleButtonActive,
              ]}
              onPress={() => setViewMode('list')}
            >
              <MaterialIcons
                name="format-list-bulleted"
                size={24}
                color={viewMode === 'list' ? '#FFFFFF' : '#4B5563'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === 'grid' && styles.viewToggleButtonActive,
              ]}
              onPress={() => setViewMode('grid')}
            >
              <MaterialIcons
                name="grid-view"
                size={24}
                color={viewMode === 'grid' ? '#FFFFFF' : '#4B5563'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.logsContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          ) : (
            <View style={styles.listContainer}>
              {logs.map((log, index) => (
                <LogCard key={log.id} log={log} index={index} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPage="logs"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF3F5",
  },
  logsContainer: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  filterButton: {
    backgroundColor: "transparent",
  },
  filterButtonLeft: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  filterButtonRight: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  buttonDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
  },
  filterButtonActive: {
    backgroundColor: "#3B82F6",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 14,
    color: "#6B7280",
  },
  viewToggleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 'auto',
    marginRight: 16,
  },
  viewToggleButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  viewToggleButtonActive: {
    backgroundColor: '#3B82F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  expandedContent: {
    padding: 16,
  },
  expandedContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsGrid: {
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  successText: {
    color: "#22C55E",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: "hidden",
  },
  expandedAvatar: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  viewButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default LogsScreen;
