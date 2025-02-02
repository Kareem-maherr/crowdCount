import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface TopbarProps {
  title: string;
  onMenuPress: () => void;
  style?: StyleProp<ViewStyle>;
  showDateButton?: boolean;
  centerTitle?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  onMenuPress,
  style,
  showDateButton = true,
  centerTitle = false,
}) => {
  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <MaterialIcons name="menu" size={24} color="#1F2937" />
      </TouchableOpacity>
      <View
        style={[
          styles.headerTitleContainer,
          centerTitle && styles.headerTitleContainerCenter,
        ]}
      >
        <Text
          style={[styles.headerTitle, centerTitle && styles.headerTitleCenter]}
        >
          {title}
        </Text>
      </View>
      {showDateButton ? (
        <TouchableOpacity style={styles.dateButton}>
          <Text style={styles.dateButtonText}>Today</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#4A5568" />
        </TouchableOpacity>
      ) : (
        <View style={styles.menuButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  menuButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitleContainerCenter: {
    flex: 1,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerTitleCenter: {
    textAlign: "center",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  dateButtonText: {
    color: "#4A5568",
    marginRight: 4,
  },
});
