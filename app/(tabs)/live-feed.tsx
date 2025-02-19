import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, Text } from 'react-native';

export default function LiveFeedScreen() {
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.videoContainer}>
          <div style={{
            width: '100%',
            height: '100%',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <iframe
              src="https://www.youtube.com/embed/AdUw5RdyZxI"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </View>
      </SafeAreaView>
    );
  }

  // For non-web platforms, show a message
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <Text style={styles.text}>Live feed is only available on web platform</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF3F5',
  },
  videoContainer: {
    flex: 1,
    padding: 20,
    maxWidth: 1000,
    height: 200,
    alignSelf: 'center',
    marginTop: 40,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: '#4B5563',
  },
});
