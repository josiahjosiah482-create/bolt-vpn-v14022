import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C } from '@/constants/C';

const { width: SCREEN_W } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🛡️',
    title: 'Military-Grade\nEncryption',
    subtitle: 'Your data is protected with AES-256 encryption. Browse, stream, and communicate with complete privacy.',
    accent: C.teal,
  },
  {
    id: '2',
    emoji: '📡',
    title: 'WiFi Security\nScanner',
    subtitle: 'Detect which apps on your network send unencrypted data. Powered by Phone Guardian technology.',
    accent: C.red,
  },
  {
    id: '3',
    emoji: '🎬',
    title: 'Unlock Global\nStreaming',
    subtitle: 'Access Netflix, Disney+, BBC iPlayer, Hulu and more from any country with one tap.',
    accent: C.violet,
  },
  {
    id: '4',
    emoji: '✅',
    title: 'Zero Logs,\nVerified',
    subtitle: 'Independently audited. We never log your browsing history, IP address, or connection timestamps.',
    accent: C.amber,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem('bolt_onboarding_done', 'true');
    router.replace('/(auth)/login' as any);
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('bolt_onboarding_done', 'true');
    router.replace('/(tabs)' as any);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Skip button */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <Pressable onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
            setActiveIndex(idx);
          }}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width: SCREEN_W }]}>
              <View style={[styles.emojiCircle, { borderColor: item.accent + '40', backgroundColor: item.accent + '15' }]}>
                <Text style={styles.slideEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
            </View>
          )}
        />

        {/* Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => {
                flatListRef.current?.scrollToIndex({ index: i });
                setActiveIndex(i);
              }}
              style={[
                styles.dot,
                i === activeIndex && [styles.dotActive, { backgroundColor: SLIDES[activeIndex].accent }],
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <View style={styles.btnWrap}>
          <Pressable
            style={[styles.nextBtn, { backgroundColor: SLIDES[activeIndex].accent }]}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>
              {activeIndex === SLIDES.length - 1 ? 'Get Started →' : 'Next →'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.dark },
  safe:      { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  skipBtn:  { padding: 8 },
  skipText: { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark2 },

  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 20,
  },
  emojiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  slideEmoji:    { fontSize: 56 },
  slideTitle: {
    fontFamily: 'Oxanium_700Bold',
    fontSize: 26,
    color: C.txtDark,
    textAlign: 'center',
    lineHeight: 34,
  },
  slideSubtitle: {
    fontFamily: 'Oxanium_400Regular',
    fontSize: 15,
    color: C.txtDark2,
    textAlign: 'center',
    lineHeight: 22,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.borderDark,
  },
  dotActive: { width: 24 },

  btnWrap: { paddingHorizontal: 24, paddingBottom: 32 },
  nextBtn: {
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontFamily: 'Oxanium_700Bold',
    fontSize: 16,
    color: '#000',
    letterSpacing: 0.5,
  },
});
