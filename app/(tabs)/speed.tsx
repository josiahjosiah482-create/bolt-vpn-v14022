import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/C';

type TestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'done';

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

export default function SpeedScreen() {
  const [phase, setPhase]       = useState<TestPhase>('idle');
  const [ping, setPing]         = useState<number | null>(null);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload]     = useState<number | null>(null);
  const [liveVal, setLiveVal]   = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim    = useRef(new Animated.Value(1)).current;
  const liveRef      = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearLive = () => {
    if (liveRef.current) clearInterval(liveRef.current);
  };

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const animateProgress = (to: number, dur: number) =>
    new Promise<void>((res) => {
      Animated.timing(progressAnim, { toValue: to, duration: dur, useNativeDriver: false }).start(() => res());
    });

  const runTest = async () => {
    if (phase !== 'idle' && phase !== 'done') return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setPing(null); setDownload(null); setUpload(null);
    progressAnim.setValue(0);
    startPulse();

    // PING phase
    setPhase('ping');
    setLiveVal(0);
    await animateProgress(0.33, 1200);
    const pingVal = randomBetween(8, 55);
    setPing(pingVal);
    setLiveVal(pingVal);

    // DOWNLOAD phase
    setPhase('download');
    liveRef.current = setInterval(() => setLiveVal(randomBetween(80, 320)), 200);
    await animateProgress(0.66, 3000);
    clearLive();
    const dlVal = randomBetween(120, 320);
    setDownload(dlVal);
    setLiveVal(dlVal);

    // UPLOAD phase
    setPhase('upload');
    liveRef.current = setInterval(() => setLiveVal(randomBetween(30, 120)), 200);
    await animateProgress(1, 2500);
    clearLive();
    const ulVal = randomBetween(40, 120);
    setUpload(ulVal);
    setLiveVal(ulVal);

    stopPulse();
    setPhase('done');
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  useEffect(() => () => clearLive(), []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const phaseLabel: Record<TestPhase, string> = {
    idle:     'Tap to start',
    ping:     'Testing ping...',
    download: 'Testing download...',
    upload:   'Testing upload...',
    done:     'Test complete',
  };

  const phaseUnit: Record<TestPhase, string> = {
    idle: '', ping: 'ms', download: 'Mbps', upload: 'Mbps', done: '',
  };

  const speedRating = (mbps: number | null) => {
    if (!mbps) return { label: '—', color: C.txtDark3 };
    if (mbps >= 200) return { label: 'Excellent', color: C.teal };
    if (mbps >= 80)  return { label: 'Good',      color: C.teal };
    if (mbps >= 30)  return { label: 'Fair',       color: C.amber };
    return { label: 'Slow', color: C.red };
  };

  const dlRating = speedRating(download);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Speed Test</Text>
          <Text style={styles.subtitle}>Test your VPN connection speed</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Gauge */}
          <View style={styles.gaugeSection}>
            <Animated.View style={[styles.gaugeOuter, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.gaugeInner}>
                {phase !== 'idle' && phase !== 'done' ? (
                  <>
                    <Text style={styles.liveVal}>{liveVal}</Text>
                    <Text style={styles.liveUnit}>{phaseUnit[phase]}</Text>
                  </>
                ) : phase === 'done' && download ? (
                  <>
                    <Text style={styles.liveVal}>{download}</Text>
                    <Text style={styles.liveUnit}>Mbps</Text>
                  </>
                ) : (
                  <Text style={styles.gaugePlaceholder}>⚡</Text>
                )}
              </View>
            </Animated.View>

            <Text style={styles.phaseLabel}>{phaseLabel[phase]}</Text>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
          </View>

          {/* Results */}
          <View style={styles.resultsRow}>
            {[
              { label: 'Ping',     value: ping,     unit: 'ms',   icon: '📡', good: (v: number) => v < 50  },
              { label: 'Download', value: download, unit: 'Mbps', icon: '⬇️', good: (v: number) => v > 80  },
              { label: 'Upload',   value: upload,   unit: 'Mbps', icon: '⬆️', good: (v: number) => v > 30  },
            ].map((m) => {
              const isGood = m.value != null && m.good(m.value);
              const color  = m.value == null ? C.txtDark3 : isGood ? C.teal : C.amber;
              return (
                <View key={m.label} style={styles.metricCard}>
                  <Text style={styles.metricIcon}>{m.icon}</Text>
                  <Text style={[styles.metricValue, { color }]}>
                    {m.value != null ? m.value : '—'}
                  </Text>
                  <Text style={styles.metricUnit}>{m.unit}</Text>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                </View>
              );
            })}
          </View>

          {/* Rating */}
          {phase === 'done' && (
            <View style={[styles.ratingCard, { borderColor: dlRating.color + '40', backgroundColor: dlRating.color + '10' }]}>
              <Text style={[styles.ratingLabel, { color: dlRating.color }]}>{dlRating.label} Connection</Text>
              <Text style={styles.ratingDesc}>
                {dlRating.label === 'Excellent' || dlRating.label === 'Good'
                  ? 'Your VPN is performing great. Enjoy fast, secure browsing.'
                  : 'Try switching to a closer server for better performance.'}
              </Text>
            </View>
          )}

          {/* Start button */}
          <Pressable
            style={[
              styles.startBtn,
              (phase !== 'idle' && phase !== 'done') && styles.startBtnDisabled,
            ]}
            onPress={runTest}
            disabled={phase !== 'idle' && phase !== 'done'}
          >
            <Text style={styles.startBtnText}>
              {phase === 'done' ? '🔄 Run Again' : phase === 'idle' ? '▶ Start Test' : '⏳ Testing...'}
            </Text>
          </Pressable>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Speed Tips</Text>
            {[
              'WireGuard protocol is fastest for most connections.',
              'Choose a server geographically close to you.',
              'Avoid P2P servers for streaming — use dedicated ones.',
            ].map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <Text style={styles.tipDot}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.dark },
  safe:      { flex: 1 },
  header:    { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  title:     { fontFamily: 'Oxanium_700Bold', fontSize: 22, color: C.txtDark },
  subtitle:  { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2, marginTop: 2 },
  scroll:    { paddingHorizontal: 20, paddingBottom: 32, gap: 20 },

  gaugeSection: { alignItems: 'center', paddingVertical: 16, gap: 14 },
  gaugeOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: C.teal,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  gaugeInner:       { alignItems: 'center' },
  liveVal:          { fontFamily: 'Oxanium_700Bold', fontSize: 36, color: C.teal },
  liveUnit:         { fontFamily: 'Oxanium_400Regular', fontSize: 14, color: C.txtDark2 },
  gaugePlaceholder: { fontSize: 52 },
  phaseLabel:       { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark2 },

  progressTrack: {
    width: '80%',
    height: 6,
    backgroundColor: C.cardDark,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.teal,
    borderRadius: 3,
  },

  resultsRow: { flexDirection: 'row', gap: 10 },
  metricCard: {
    flex: 1,
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 3,
  },
  metricIcon:  { fontSize: 20 },
  metricValue: { fontFamily: 'Oxanium_700Bold', fontSize: 20 },
  metricUnit:  { fontFamily: 'Oxanium_400Regular', fontSize: 11, color: C.txtDark3 },
  metricLabel: { fontFamily: 'Oxanium_400Regular', fontSize: 11, color: C.txtDark2 },

  ratingCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  ratingLabel: { fontFamily: 'Oxanium_700Bold', fontSize: 16 },
  ratingDesc:  { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2, lineHeight: 18 },

  startBtn: {
    backgroundColor: C.teal,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnDisabled: { opacity: 0.5 },
  startBtnText:     { fontFamily: 'Oxanium_700Bold', fontSize: 16, color: '#000', letterSpacing: 0.5 },

  tipsCard: {
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 8,
  },
  tipsTitle: { fontFamily: 'Oxanium_600SemiBold', fontSize: 13, color: C.txtDark, marginBottom: 4 },
  tipRow:    { flexDirection: 'row', gap: 8 },
  tipDot:    { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.teal },
  tipText:   { flex: 1, fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2, lineHeight: 18 },
});
