import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

type EarningEntry = {
  id: string;
  date: string;
  amount: number;
  bandwidth: number;
};

const MOCK_HISTORY: EarningEntry[] = [
  { id: '1', date: 'Today',      amount: 0.42, bandwidth: 1.2 },
  { id: '2', date: 'Yesterday',  amount: 0.85, bandwidth: 2.4 },
  { id: '3', date: 'Mar 13',     amount: 0.63, bandwidth: 1.8 },
  { id: '4', date: 'Mar 12',     amount: 1.10, bandwidth: 3.1 },
  { id: '5', date: 'Mar 11',     amount: 0.77, bandwidth: 2.2 },
];

export default function BandwidthShareScreen() {
  const [enabled, setEnabled]   = useState(false);
  const [limit, setLimit]       = useState(5); // GB/day
  const [liveKbps, setLiveKbps] = useState(0);
  const totalEarned = MOCK_HISTORY.reduce((sum, e) => sum + e.amount, 0);
  const totalShared = MOCK_HISTORY.reduce((sum, e) => sum + e.bandwidth, 0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const liveRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (enabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 1000, useNativeDriver: true }),
        ])
      ).start();
      liveRef.current = setInterval(() => {
        setLiveKbps(Math.round(50 + Math.random() * 200));
      }, 1500);
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      if (liveRef.current) clearInterval(liveRef.current);
      setLiveKbps(0);
    }
    return () => { if (liveRef.current) clearInterval(liveRef.current); };
  }, [enabled]);

  const toggle = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEnabled(!enabled);
  };

  const adjustLimit = (delta: number) => {
    setLimit((prev) => Math.max(1, Math.min(50, prev + delta)));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Bandwidth Sharing" dark />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Main toggle card */}
          <Animated.View style={[styles.mainCard, enabled && styles.mainCardActive, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.mainTop}>
              <View style={styles.mainIcon}>
                <Text style={styles.mainEmoji}>🔄</Text>
              </View>
              <View style={styles.mainInfo}>
                <Text style={styles.mainTitle}>Bandwidth Sharing</Text>
                <Text style={styles.mainSub}>
                  {enabled ? `Sharing · ${liveKbps} KB/s` : 'Earn rewards by sharing unused bandwidth'}
                </Text>
              </View>
              <Switch
                value={enabled}
                onValueChange={toggle}
                trackColor={{ false: C.borderDark, true: C.teal }}
                thumbColor="#fff"
              />
            </View>

            {enabled && (
              <View style={styles.liveRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE — {liveKbps} KB/s being shared</Text>
              </View>
            )}
          </Animated.View>

          {/* Earnings summary */}
          <View style={styles.earningsRow}>
            {[
              { label: 'Total Earned',  value: `$${totalEarned.toFixed(2)}`, icon: '💰', color: C.amber },
              { label: 'GB Shared',     value: `${totalShared.toFixed(1)} GB`, icon: '📡', color: C.teal },
              { label: 'Days Active',   value: String(MOCK_HISTORY.length),    icon: '📅', color: C.violet },
            ].map((s) => (
              <View key={s.label} style={styles.earningCard}>
                <Text style={styles.earningIcon}>{s.icon}</Text>
                <Text style={[styles.earningValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.earningLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Daily limit */}
          <View style={styles.limitCard}>
            <Text style={styles.limitTitle}>Daily Bandwidth Limit</Text>
            <Text style={styles.limitSub}>Set how much bandwidth you're willing to share per day</Text>
            <View style={styles.limitRow}>
              <Pressable style={styles.limitBtn} onPress={() => adjustLimit(-1)}>
                <Text style={styles.limitBtnText}>−</Text>
              </Pressable>
              <View style={styles.limitValue}>
                <Text style={styles.limitNum}>{limit}</Text>
                <Text style={styles.limitUnit}>GB/day</Text>
              </View>
              <Pressable style={styles.limitBtn} onPress={() => adjustLimit(1)}>
                <Text style={styles.limitBtnText}>+</Text>
              </Pressable>
            </View>
            <View style={styles.limitBar}>
              {Array.from({ length: 10 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.limitBarSegment,
                    i < Math.round(limit / 5) && styles.limitBarSegmentFilled,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Earnings history */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>EARNINGS HISTORY</Text>
            {MOCK_HISTORY.map((entry) => (
              <View key={entry.id} style={styles.historyRow}>
                <View style={styles.historyIcon}>
                  <Text style={styles.historyEmoji}>💰</Text>
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                  <Text style={styles.historyBandwidth}>{entry.bandwidth} GB shared</Text>
                </View>
                <Text style={styles.historyAmount}>+${entry.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* How it works */}
          <View style={styles.howCard}>
            <Text style={styles.howTitle}>💡 How It Works</Text>
            {[
              'Enable sharing to contribute unused bandwidth.',
              'Other Bolt VPN users route traffic through your connection.',
              'Earn credits redeemable for premium subscription days.',
              'Your privacy is fully protected — no logs, no monitoring.',
            ].map((step, i) => (
              <View key={step} style={styles.howRow}>
                <View style={styles.howNum}>
                  <Text style={styles.howNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.howText}>{step}</Text>
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
  scroll:    { paddingHorizontal: 16, paddingBottom: 32, gap: 16 },

  mainCard: {
    backgroundColor: C.cardDark,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 12,
  },
  mainCardActive: { borderColor: C.tealBorder, backgroundColor: C.tealBg2 },
  mainTop:        { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mainIcon:       { width: 48, height: 48, borderRadius: 14, backgroundColor: C.dark2, alignItems: 'center', justifyContent: 'center' },
  mainEmoji:      { fontSize: 24 },
  mainInfo:       { flex: 1 },
  mainTitle:      { fontFamily: 'Oxanium_700Bold', fontSize: 16, color: C.txtDark },
  mainSub:        { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2, marginTop: 2 },
  liveRow:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: C.teal },
  liveText:       { fontFamily: 'Oxanium_600SemiBold', fontSize: 12, color: C.teal },

  earningsRow: { flexDirection: 'row', gap: 10 },
  earningCard: {
    flex: 1,
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 3,
  },
  earningIcon:  { fontSize: 20 },
  earningValue: { fontFamily: 'Oxanium_700Bold', fontSize: 16 },
  earningLabel: { fontFamily: 'Oxanium_400Regular', fontSize: 10, color: C.txtDark2, textAlign: 'center' },

  limitCard: {
    backgroundColor: C.cardDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 10,
  },
  limitTitle:   { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: C.txtDark },
  limitSub:     { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2 },
  limitRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  limitBtn:     { width: 40, height: 40, borderRadius: 12, backgroundColor: C.dark2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.borderDark },
  limitBtnText: { fontFamily: 'Oxanium_700Bold', fontSize: 20, color: C.txtDark },
  limitValue:   { alignItems: 'center' },
  limitNum:     { fontFamily: 'Oxanium_700Bold', fontSize: 32, color: C.teal },
  limitUnit:    { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2 },
  limitBar:     { flexDirection: 'row', gap: 4 },
  limitBarSegment: { flex: 1, height: 6, borderRadius: 3, backgroundColor: C.borderDark },
  limitBarSegmentFilled: { backgroundColor: C.teal },

  historySection: { gap: 10 },
  sectionTitle:   { fontFamily: 'Oxanium_600SemiBold', fontSize: 10, color: C.txtDark3, letterSpacing: 1.5 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 12,
  },
  historyIcon:      { width: 36, height: 36, borderRadius: 10, backgroundColor: C.amberBg, alignItems: 'center', justifyContent: 'center' },
  historyEmoji:     { fontSize: 18 },
  historyInfo:      { flex: 1 },
  historyDate:      { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark },
  historyBandwidth: { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2, marginTop: 2 },
  historyAmount:    { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: C.amber },

  howCard:  { backgroundColor: C.cardDark, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.borderDark, gap: 12 },
  howTitle: { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: C.txtDark },
  howRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  howNum:   { width: 24, height: 24, borderRadius: 12, backgroundColor: C.tealBg, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  howNumText: { fontFamily: 'Oxanium_700Bold', fontSize: 12, color: C.teal },
  howText:  { flex: 1, fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2, lineHeight: 18 },
});
