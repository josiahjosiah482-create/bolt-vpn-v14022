import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '@/constants/C';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim  = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
    ]).start();

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.8, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 1200, useNativeDriver: true }),
      ])
    );
    glow.start();

    const timer = setTimeout(() => {
      router.replace('/(auth)/login' as any);
    }, 2800);

    return () => { clearTimeout(timer); glow.stop(); };
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Animated.View style={[styles.glowRing, { opacity: glowAnim }]} />
          <Animated.View style={[styles.logoWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>⚡</Text>
            </View>
            <Text style={styles.logoText}>BOLT VPN</Text>
            <Text style={styles.tagline}>Your Digital Shield</Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <View style={styles.dotRow}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
            ))}
          </View>
          <Text style={styles.footerText}>Initializing secure connection...</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.dark },
  safe:      { flex: 1 },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },

  glowRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: C.teal,
    shadowColor: C.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },

  logoWrap:   { alignItems: 'center', gap: 16 },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.tealBg,
    borderWidth: 2,
    borderColor: C.tealBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 48 },
  logoText: {
    fontFamily: 'Oxanium_700Bold',
    fontSize: 32,
    color: C.txtDark,
    letterSpacing: 4,
  },
  tagline: {
    fontFamily: 'Oxanium_400Regular',
    fontSize: 14,
    color: C.txtDark2,
    letterSpacing: 1,
  },

  footer: { paddingBottom: 40, alignItems: 'center', gap: 12 },
  dotRow: { flexDirection: 'row', gap: 8 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.borderDark,
  },
  dotActive:   { backgroundColor: C.teal, width: 18 },
  footerText: {
    fontFamily: 'Oxanium_400Regular',
    fontSize: 12,
    color: C.txtDark3,
    letterSpacing: 0.5,
  },
});
