import { Image, StyleSheet, Platform, TouchableOpacity, Linking } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

export default function HomeScreen() {
  const quoteButton = () => {
    Linking.openURL('https://example.com'); 
  };
  const quoteButton2 = () => {
    Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); 
  };


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/quotelingo_logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Quote History</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Here you will find all the quotes you have seen.</ThemedText>
      </ThemedView>

      <ThemedView style={styles.quoteContainer}>
        <TouchableOpacity onPress={quoteButton}>
          <ThemedText type="default" style={styles.quoteText}>
            "Quotes go here"
          </ThemedText>
        </TouchableOpacity>

      </ThemedView>
      <ThemedView style={styles.quoteContainer}>
        <TouchableOpacity onPress={quoteButton2}>
          <ThemedText type="default" style={styles.quoteText}>
            "This is a really long pile of text just to see how the TouchableOpacity will 
            look when it is really sctreched out for a bigger quote. DO NOT and I repeat DO NOT CLICK ME"
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.quoteContainer}>
        <TouchableOpacity onPress={quoteButton}>
          <ThemedText type="default" style={styles.quoteText}>
            "Quotes go here"
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.quoteContainer}>
        <TouchableOpacity onPress={quoteButton}>
          <ThemedText type="default" style={styles.quoteText}>
            "Quotes go here"
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 250,
    width: 410,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  quoteContainer: {
    margin: 0.1,
    padding: 5,
    backgroundColor: '#89cff0',
    borderRadius: 10,
  },
  quoteText: {
    fontSize: 16,
    color: '#333',
  },
});
