import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  interpolate,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { router } from "expo-router";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: "dashboard" | "logs" | "live-feed" | "settings" | "help" | "calendar";
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPage = "dashboard",
}) => {
  const translateX = useSharedValue(-Dimensions.get("window").width * 0.75);
  const fadeAnim = useSharedValue(0);

  // Pre-define menu items
  const menuItems = [
    { icon: "dashboard", label: "Dashboard" },
    { icon: "calendar-today", label: "Calendar" },
    { icon: "history", label: "Activity Logs" },
    { icon: "videocam", label: "Live Feed" },
    { icon: "settings", label: "Settings" },
    { icon: "help-outline", label: "Help" },
  ];

  // Create fixed number of animations
  const menuItem1 = useSharedValue(0);
  const menuItem2 = useSharedValue(0);
  const menuItem3 = useSharedValue(0);
  const menuItem4 = useSharedValue(0);
  const menuItem5 = useSharedValue(0);
  const menuItem6 = useSharedValue(0);

  const menuItemAnims = [menuItem1, menuItem2, menuItem3, menuItem4, menuItem5, menuItem6];

  useEffect(() => {
    if (isOpen) {
      // Slide in sidebar
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 150,
      });
      // Fade in overlay
      fadeAnim.value = withTiming(1, { duration: 200 });
      // Animate menu items
      menuItemAnims.forEach((anim, index) => {
        anim.value = withDelay(
          index * 30,
          withSpring(1, {
            damping: 15,
            stiffness: 150,
          })
        );
      });
    } else {
      // Slide out sidebar
      translateX.value = withSpring(-Dimensions.get("window").width * 0.75, {
        damping: 20,
        stiffness: 150,
      });
      // Fade out overlay
      fadeAnim.value = withTiming(0, { duration: 150 });
      // Reset menu items
      menuItemAnims.forEach((anim) => {
        anim.value = withTiming(0, { duration: 150 });
      });
    }
  }, [isOpen]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [-Dimensions.get("window").width * 0.75, 0],
          [-20, 0]
        ),
      },
    ],
    opacity: interpolate(
      translateX.value,
      [-Dimensions.get("window").width * 0.75, 0],
      [0, 1]
    ),
  }));

  // Create fixed animated styles for menu items
  const menuItemStyles = menuItemAnims.map((anim, index) =>
    useAnimatedStyle(() => ({
      transform: [
        {
          translateX: interpolate(anim.value, [0, 1], [-20, 0]),
        },
      ],
      opacity: anim.value,
    }))
  );

  const handleNavigation = (route: string) => {
    router.push(route);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.sidebar, sidebarStyle]}>
        <Animated.View style={[styles.header, headerStyle]}>
          <Text style={styles.headerText}>PrimeGate</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#4A5568" />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              currentPage === "dashboard" && styles.activeMenuItem,
            ]}
            onPress={() => router.push("/")}
          >
            <MaterialIcons
              name="dashboard"
              size={24}
              color={currentPage === "dashboard" ? "#3B82F6" : "#4B5563"}
            />
            <Text
              style={[
                styles.menuItemText,
                currentPage === "dashboard" && styles.activeMenuItemText,
              ]}
            >
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              currentPage === "calendar" && styles.activeMenuItem,
            ]}
            onPress={() => router.push("/calendar")}
          >
            <MaterialIcons
              name="calendar-today"
              size={24}
              color={currentPage === "calendar" ? "#3B82F6" : "#4B5563"}
            />
            <Text
              style={[
                styles.menuItemText,
                currentPage === "calendar" && styles.activeMenuItemText,
              ]}
            >
              Calendar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              currentPage === "logs" && styles.activeMenuItem,
            ]}
            onPress={() => router.push("/logs")}
          >
            <MaterialIcons
              name="history"
              size={24}
              color={currentPage === "logs" ? "#3B82F6" : "#4B5563"}
            />
            <Text
              style={[
                styles.menuItemText,
                currentPage === "logs" && styles.activeMenuItemText,
              ]}
            >
              Activity Logs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              currentPage === "live-feed" && styles.activeMenuItem,
            ]}
            onPress={() => router.push("/live-feed")}
          >
            <MaterialIcons
              name="videocam"
              size={24}
              color={currentPage === "live-feed" ? "#3B82F6" : "#4B5563"}
            />
            <Text
              style={[
                styles.menuItemText,
                currentPage === "live-feed" && styles.activeMenuItemText,
              ]}
            >
              Live Feed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              currentPage === "settings" && styles.activeMenuItem,
            ]}
            onPress={() => router.push("/settings")}
          >
            <MaterialIcons
              name="settings"
              size={24}
              color={currentPage === "settings" ? "#3B82F6" : "#4B5563"}
            />
            <Text
              style={[
                styles.menuItemText,
                currentPage === "settings" && styles.activeMenuItemText,
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              currentPage === "help" && styles.activeMenuItem,
            ]}
            onPress={() => router.push("/help")}
          >
            <MaterialIcons
              name="help-outline"
              size={24}
              color={currentPage === "help" ? "#3B82F6" : "#4B5563"}
            />
            <Text
              style={[
                styles.menuItemText,
                currentPage === "help" && styles.activeMenuItemText,
              ]}
            >
              Help
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: Dimensions.get("window").width * 0.75,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  menuContainer: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#4A5568",
  },
  activeMenuItem: {
    backgroundColor: "#EBF5FF",
    borderRadius: 8,
  },
  activeMenuItemText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});
