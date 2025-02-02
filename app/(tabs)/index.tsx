import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
  withDelay,
} from "react-native-reanimated";
import { LineChart, BarChart } from "react-native-chart-kit";
import { MaterialIcons } from "@expo/vector-icons";
import { Topbar } from "@/components/Topbar";
import { SharedElement } from "react-navigation-shared-element";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Sidebar } from "../../components/Sidebar";
import { VisitorsModal } from "../(modals)/visitors";

// Optional: Define an interface for the chart data
interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
  data: number[];
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVisitorsModalVisible, setIsVisitorsModalVisible] = useState(false);
  const slideAnim = useSharedValue(0);

  // Create shared values for each section
  const fadeAnims = {
    header: useSharedValue(0),
    stats: useSharedValue(0),
    lineChart: useSharedValue(0),
    barChart: useSharedValue(0),
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Create animated styles for each section
  const fadeStyles = {
    header: useAnimatedStyle(() => ({
      opacity: fadeAnims.header.value,
    })),
    stats: useAnimatedStyle(() => ({
      opacity: fadeAnims.stats.value,
    })),
    lineChart: useAnimatedStyle(() => ({
      opacity: fadeAnims.lineChart.value,
    })),
    barChart: useAnimatedStyle(() => ({
      opacity: fadeAnims.barChart.value,
    })),
  };

  useEffect(() => {
    // Sequence of animations
    fadeAnims.header.value = withDelay(0, withTiming(1, { duration: 500 }));
    fadeAnims.stats.value = withDelay(200, withTiming(1, { duration: 500 }));
    fadeAnims.lineChart.value = withDelay(
      400,
      withTiming(1, { duration: 500 })
    );
    fadeAnims.barChart.value = withDelay(600, withTiming(1, { duration: 500 }));
  }, []);

  // Add state for line chart data
  const [lineChartData, setLineChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }],
    data: []
  });
  const [isLineChartLoading, setIsLineChartLoading] = useState(true);

  // Fetch line chart data
  const fetchLineChartData = async () => {
    setIsLineChartLoading(true);
    try {
      console.log("Fetching line chart data...");
      const response = await fetch("http://192.168.11.134:8001/api/bar-chart");
      const data = await response.json();
      console.log("Line Chart API Response:", data);

      if (Array.isArray(data)) {
        // Transform the data into the format needed for the chart
        const transformedData = data.map(item => ({
          timestamp: new Date(item.timestamp),
          count: item.count
        }));

        // Sort by timestamp and get last 10 entries
        transformedData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        const lastTenEntries = transformedData.slice(-10);

        // Format the data for the chart
        const chartData = {
          labels: lastTenEntries.map(item => {
            const hour = item.timestamp.getHours();
            return hour.toString(); // Just the hour number
          }),
          datasets: [{ data: lastTenEntries.map(item => item.count) }],
          data: lastTenEntries.map(item => item.count),
        };

        console.log("Setting line chart data:", chartData);
        setLineChartData(chartData);
      } else {
        console.error(
          "Invalid data format received from API. Expected array of objects with timestamp and count",
          {
            expected: [{ timestamp: "ISO date string", count: "number" }],
          }
        );
        console.error("Received:", data);

        // Set fallback data
        const fallbackData = {
          labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          datasets: [{ data: [20, 45, 28, 80, 99, 43, 50, 35, 70, 90] }],
          data: [20, 45, 28, 80, 99, 43, 50, 35, 70, 90],
        };
        console.log("Setting fallback line chart data:", fallbackData);
        setLineChartData(fallbackData);
      }
    } catch (error) {
      console.error("Error fetching line chart data:", error);
      // Set fallback data on error
      const fallbackData = {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        datasets: [{ data: [20, 45, 28, 80, 99, 43, 50, 35, 70, 90] }],
        data: [20, 45, 28, 80, 99, 43, 50, 35, 70, 90],
      };
      console.log("Setting fallback line chart data due to error:", fallbackData);
      setLineChartData(fallbackData);
    } finally {
      setIsLineChartLoading(false);
    }
  };

  // Fetch line chart data when component mounts and when time range changes
  useEffect(() => {
    fetchLineChartData();
  }, []);

  // Dummy data for the charts
  const hourlyData: ChartData = {
    labels: [
      "00:00",
      "03:00",
      "06:00",
      "09:00",
      "12:00",
      "15:00",
      "18:00",
      "21:00",
    ],
    datasets: [{ data: [30, 45, 28, 80, 99, 43, 50, 70] }],
    data: [30, 45, 28, 80, 99, 43, 50, 70],
  };

  const weeklyData: ChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [320, 450, 280, 800, 990, 430, 500] }],
    data: [320, 450, 280, 800, 990, 430, 500],
  };

  const monthlyData: ChartData = {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [{ data: [1200, 1500, 1800, 2000] }],
    data: [1200, 1500, 1800, 2000],
  };

  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "24h" | "7d" | "30d"
  >("24h");
  const [selectedBarTimeRange, setSelectedBarTimeRange] = useState("24h");
  const cardExpanded = useSharedValue(0);
  const barCardExpanded = useSharedValue(0);

  const COLLAPSED_HEIGHT = 340;
  const EXPANDED_HEIGHT = 480;

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      cardExpanded.value,
      [0, 1],
      [COLLAPSED_HEIGHT, EXPANDED_HEIGHT]
    );
    return {
      height,
    };
  });

  const barCardAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      barCardExpanded.value,
      [0, 1],
      [COLLAPSED_HEIGHT, EXPANDED_HEIGHT]
    );
    return {
      height,
    };
  });

  const getDataForTimeRange = () => {
    switch (selectedTimeRange) {
      case "7d":
        return weeklyData;
      case "30d":
        return monthlyData;
      default:
        return hourlyData;
    }
  };

  const getSubtitleForTimeRange = () => {
    switch (selectedTimeRange) {
      case "7d":
        return "Last 7 days";
      case "30d":
        return "Last 30 days";
      default:
        return "Last 24 hours";
    }
  };

  const scale = useSharedValue(1);

  // State for bar chart data with proper initialization
  const [barChartData, setBarChartData] = useState({
    labels: ['In', 'Out'],
    datasets: [{
      data: [0, 0]
    }]
  });
  const [isBarChartLoading, setIsBarChartLoading] = useState(true);

  // Fetch bar chart data
  const fetchBarChartData = async (hours: number) => {
    setIsBarChartLoading(true);
    try {
      const response = await fetch(
        `http://192.168.11.134:8001/stats/bar?range_hours=${hours}`,
        {
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Transform API data into chart format
      const chartData = {
        labels: data.map((item: any) => {
          const date = new Date(item.bucket);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        }),
        datasets: [{
          data: data.flatMap((item: any) => [item.in_total, item.out_total]),
          labels: ['In', 'Out']  // Add labels for the legend
        }],
        barColors: data.flatMap(() => ['rgba(59, 130, 246, 1)', 'rgba(239, 68, 68, 1)']),
      };
      
      setBarChartData(chartData);
      console.log("Chart data:", chartData); // Debug log
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    } finally {
      setIsBarChartLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchBarChartData(24);
  }, []);

  // Update data when time range changes
  useEffect(() => {
    const hours = selectedBarTimeRange === "6h" ? 6 : 
                 selectedBarTimeRange === "48h" ? 48 : 24;
    fetchBarChartData(hours);
  }, [selectedBarTimeRange]);

  // Add state for stats with debug log
  const [statsData, setStatsData] = useState(() => {
    return {
      currentVisitors: 0,
      activeNow: "Active now",
      totalDay: 0,
      totalEnterToday: 0,
    };
  });

  // Fetch stats data
  const fetchStatsData = async () => {
    console.log("Fetching stats data...");
    try {
      const response = await fetch(
        "http://192.168.11.134:8001/stats/summary",
        {
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Stats API Response:", data);

      if (
        data &&
        typeof data.total_enter_today === "number" &&
        typeof data.total_exit_today === "number"
      ) {
        const currentCount = data.total_enter_today - data.total_exit_today;
        
        setStatsData((prevState) => {
          const newState = {
            currentVisitors: currentCount,
            activeNow: `Active now (as of ${new Date().toLocaleTimeString()})`,
            totalDay: data.total_enter_today,
            totalEnterToday: data.total_enter_today,
          };
          console.log("New state:", newState);
          return newState;
        });
      } else {
        console.error("Invalid stats data format. Expected fields: total_enter_today, total_exit_today");
        console.error("Received:", data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch stats on component mount and set up interval
  useEffect(() => {
    console.log("Setting up stats fetch interval");
    fetchStatsData(); // Initial fetch

    // Set up interval to fetch stats every 30 seconds
    const intervalId = setInterval(() => {
      console.log("Interval triggered, fetching stats...");
      fetchStatsData();
    }, 30000);

    // Cleanup interval on component unmount
    return () => {
      console.log("Cleaning up stats fetch interval");
      clearInterval(intervalId);
    };
  }, []);

  const [recentLogs, setRecentLogs] = useState([]);

  const fetchRecentLogs = async () => {
    try {
      const response = await fetch(
        "http://192.168.11.134:8001/logs?limit=5",
        {
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecentLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={fadeStyles.header}>
        <Topbar title="Dashboard" onMenuPress={toggleSidebar} />
      </Animated.View>
      <ScrollView style={styles.scrollView}>
        {/* Stats Cards */}
        <Animated.View
          style={[styles.statsContainer, fadeStyles.stats]}
          sharedTransitionTag="stats"
        >
          <TouchableOpacity
            style={[styles.statCard]}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              fetchRecentLogs();
              setIsVisitorsModalVisible(true);
              console.log("Current visitors card pressed");
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#6366f1", "#4f46e5"]}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>Current Visitors</Text>
                <MaterialIcons
                  name="people"
                  size={24}
                  color="#fff"
                  style={{ opacity: 0.9 }}
                />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>
                  {statsData.currentVisitors}
                </Text>
                <Text style={styles.statSubtext}>
                  {statsData.activeNow} • {statsData.totalEnterToday} Today
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard]}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              scale.value = withTiming(
                0.95,
                {
                  duration: 100,
                },
                () => {
                  scale.value = withTiming(1);
                  router.push("/visitors/total");
                }
              );
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#4ade80", "#22c55e"]}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statHeader}>
                <SharedElement id="visitors.title">
                  <Text style={styles.statLabel}>Total Visitors</Text>
                </SharedElement>
                <SharedElement id="visitors.icon">
                  <MaterialIcons
                    name="trending-up"
                    size={24}
                    color="#fff"
                    style={{ opacity: 0.9 }}
                  />
                </SharedElement>
              </View>
              <View style={styles.statContent}>
                <SharedElement id="visitors.count">
                  <Text style={styles.statValue}>
                    {statsData.totalDay}
                  </Text>
                </SharedElement>
                <SharedElement id="visitors.subtitle">
                  <Text style={styles.statSubtext}>Today</Text>
                </SharedElement>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Line Chart */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            cardExpanded.value = withSpring(cardExpanded.value === 0 ? 1 : 0);
          }}
        >
          <Animated.View
            style={[styles.chartCard, cardAnimatedStyle, fadeStyles.lineChart]}
          >
            <LinearGradient
              colors={["#ffffff", "#f8fafc"]}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.chartTitleContainer}>
                <MaterialIcons name="timeline" size={24} color="#111827" />
                <Text style={styles.chartTitle}>Traffic Over Time</Text>
              </View>
              <Text style={styles.chartSubtitle}>
                {getSubtitleForTimeRange()}
              </Text>
              <View style={styles.chartWrapper}>
                {isLineChartLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6366f1" />
                  </View>
                ) : (
                  <LineChart
                    data={lineChartData}
                    width={Dimensions.get("window").width - 64}
                    height={220}
                    chartConfig={{
                      backgroundColor: "#ffffff",
                      backgroundGradientFrom: "#ffffff",
                      backgroundGradientTo: "#ffffff",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(107, 114, 128, ${opacity})`,
                      propsForDots: {
                        r: "4",
                        strokeWidth: "2",
                        stroke: "#6366f1",
                      },
                      propsForBackgroundLines: {
                        strokeDasharray: "",
                        stroke: "#e2e8f0",
                      },
                    }}
                    bezier
                    style={styles.chart}
                  />
                )}
              </View>
              <Animated.View
                style={[
                  styles.timeRangeContainer,
                  {
                    opacity: cardExpanded,
                    transform: [
                      {
                        translateY: interpolate(
                          cardExpanded.value,
                          [0, 1],
                          [20, 0]
                        ),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.timeRangeButton,
                    selectedTimeRange === "24h" && styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setSelectedTimeRange("24h")}
                >
                  <Text
                    style={[
                      styles.timeRangeButtonText,
                      selectedTimeRange === "24h" &&
                        styles.timeRangeButtonTextActive,
                    ]}
                  >
                    24H
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeRangeButton,
                    selectedTimeRange === "7d" && styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setSelectedTimeRange("7d")}
                >
                  <Text
                    style={[
                      styles.timeRangeButtonText,
                      selectedTimeRange === "7d" &&
                        styles.timeRangeButtonTextActive,
                    ]}
                  >
                    7D
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeRangeButton,
                    selectedTimeRange === "30d" && styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setSelectedTimeRange("30d")}
                >
                  <Text
                    style={[
                      styles.timeRangeButtonText,
                      selectedTimeRange === "30d" &&
                        styles.timeRangeButtonTextActive,
                    ]}
                  >
                    30D
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
        {/* Bar Chart */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            barCardExpanded.value = withSpring(
              barCardExpanded.value === 0 ? 1 : 0
            );
          }}
        >
          <Animated.View
            style={[
              styles.chartCard,
              barCardAnimatedStyle,
              fadeStyles.barChart,
            ]}
          >
            <LinearGradient
              colors={["#ffffff", "#f8fafc"]}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.chartTitleContainer}>
                <MaterialIcons name="bar-chart" size={24} color="#111827" />
                <Text style={styles.chartTitle}>Traffic by Page</Text>
              </View>
              <Text style={styles.chartSubtitle}>Today</Text>
              <View style={styles.chartWrapper}>
                {isBarChartLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                ) : (
                  <BarChart
                    data={barChartData}
                    width={Dimensions.get("window").width - 64}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                      backgroundColor: "#ffffff",
                      backgroundGradientFrom: "#ffffff",
                      backgroundGradientTo: "#ffffff",
                      decimalPlaces: 0,
                      color: (opacity = 1, index) => {
                        return index % 2 === 0 
                          ? `rgba(59, 130, 246, ${opacity})` // blue for in
                          : `rgba(239, 68, 68, ${opacity})`; // red for out
                      },
                      labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                      strokeWidth: 2,
                      barPercentage: 0.8,
                      propsForLabels: {
                        fontSize: 9,
                        rotation: 45,
                      },
                      propsForBackgroundLines: {
                        strokeWidth: 1,
                        stroke: "rgba(226, 232, 240, 0.6)",
                      },
                    }}
                    withInnerLines={true}
                    showBarTops={true}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    style={styles.chart}
                  />
                )}
              </View>
              <Animated.View
                style={[
                  styles.timeRangeContainer,
                  {
                    opacity: barCardExpanded,
                    transform: [
                      {
                        translateY: interpolate(
                          barCardExpanded.value,
                          [0, 1],
                          [20, 0]
                        ),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.timeRangeButton,
                    selectedBarTimeRange === "6h" &&
                      styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setSelectedBarTimeRange("6h")}
                >
                  <Text
                    style={[
                      styles.timeRangeButtonText,
                      selectedBarTimeRange === "6h" &&
                        styles.timeRangeButtonTextActive,
                    ]}
                  >
                    6H
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeRangeButton,
                    selectedBarTimeRange === "24h" &&
                      styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setSelectedBarTimeRange("24h")}
                >
                  <Text
                    style={[
                      styles.timeRangeButtonText,
                      selectedBarTimeRange === "24h" &&
                        styles.timeRangeButtonTextActive,
                    ]}
                  >
                    24H
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeRangeButton,
                    selectedBarTimeRange === "48h" &&
                      styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setSelectedBarTimeRange("48h")}
                >
                  <Text
                    style={[
                      styles.timeRangeButtonText,
                      selectedBarTimeRange === "48h" &&
                        styles.timeRangeButtonTextActive,
                    ]}
                  >
                    48H
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </ScrollView>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPage="dashboard"
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisitorsModalVisible}
        onRequestClose={() => {
          setIsVisitorsModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recent Visitors</Text>
              <TouchableOpacity
                onPress={() => setIsVisitorsModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.visitorsList}>
              {recentLogs.map((log) => (
                <View key={log.id} style={styles.visitorItem}>
                  {Platform.OS === 'web' ? (
                    <img
                      src={`data:image/jpeg;base64,${log.face_image_b64}`}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        marginRight: 15,
                      }}
                      alt={`Visitor ${log.person_name}`}
                    />
                  ) : (
                    <Image
                      source={{ uri: `data:image/jpeg;base64,${log.face_image_b64}` }}
                      style={styles.visitorImage}
                    />
                  )}
                  <View style={styles.visitorInfo}>
                    <Text style={styles.visitorName}>{log.person_name}</Text>
                    <Text style={styles.visitorId}>ID: {log.id}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF3F5",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
    elevation: 9,
  },
  gradientBackground: {
    padding: 16,
    height: "100%",
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.9,
  },
  statContent: {
    marginTop: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  chartCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.46,
    elevation: 9,
    backgroundColor: "#fff",
  },
  chartTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  chartSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: "center",
    marginTop: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  timeRangeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  timeRangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  timeRangeButtonActive: {
    backgroundColor: "#6366f1",
  },
  timeRangeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  timeRangeButtonTextActive: {
    color: "#ffffff",
  },
  loadingContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  visitorsList: {
    maxHeight: 400,
  },
  visitorItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  visitorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: "500",
  },
  visitorId: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default Dashboard;
