import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

type ThreatLevel = 'safe' | 'warning' | 'danger';
type ScanPhase = 'idle' | 'scanning' | 'done';

type NetworkDevice = {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: 'router' | 'phone' | 'laptop' | 'tv' | 'unknown';
  threat: ThreatLevel;
  detail: string;
};

type Threat = {
  id: string;
  title: string;
  desc: string;
  level: ThreatLevel;
  fixed: boolean;
};

const MOCK_DEVICES: NetworkDevice[] = [
  { id: '1', name: 'Home Router',     ip: '192.168.1.1',  mac: 'AA:BB:CC:DD:EE:01', type: 'router',  threat: 'warning', detail: 'Default admin password detected' },
  { id: '2', name: 'iPhone 15 Pro',   ip: '192.168.1.2',  mac: 'AA:BB:CC:DD:EE:02', type: 'phone',   threat: 'safe',    detail: 'No threats detected' },
  { id: '3', name: 'MacBook Pro',     ip: '192.168.1.3',  mac: 'AA:BB:CC:DD:EE:03', type: 'laptop',  threat: 'safe',    detail: 'No threats detected' },
  { id: '4', name: 'Smart TV',        ip: '192.168.1.4',  mac: 'AA:BB:CC:DD:EE:04', type: 'tv',      threat: 'danger',  detail: 'Unencrypted data transmission' },
  { id: '5', name: 'Unknown Device',  ip: '192.168.1.5',  mac: 'AA:BB:CC:DD:EE:05', type: 'unknown', threat: 'danger',  detail: 'Unauthorized device on network' },
  { id: '6', name: 'Amazon Echo',     ip: '192.168.1.6',  mac: 'AA:BB:CC:DD:EE:06', type: 'unknown', threat: 'warning', detail: 'Microphone always-on detected' },
];

const MOCK_THREATS: Threat[] = [
  { id: 't1', title: 'Default Router Password',   desc: 'Your router uses factory-default credentials. Change it now.', level: 'warning', fixed: false },
  { id: 't2', title: 'Unencrypted Smart TV',      desc: 'Your Smart TV sends data without encryption.', level: 'danger', fixed: false },
  { id: 't3', title: 'Unauthorized Device',       desc: 'An unknown device is connected to your network.', level: 'danger', fixed: false },
  { id: 't4', title: 'Always-On Microphone',      desc: 'Amazon Echo listens continuously. Consider muting.', level: 'warning', fixed: false },
];

const DEVICE_ICONS: Record<string, string> = {
  router: '📡', phone: '📱', laptop: '💻', tv: '📺', unknown: '❓',
};

const THREAT_COLORS: Record<ThreatLevel, string> = {
  safe: C.teal, warning: C.amber, danger: C.red,
};

export default function WifiScannerScreen() {
  const [phase, setPhase]     = useState<ScanPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [fixedIds, setFixedIds] = useState<Set<string>>(new Set());

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopPulse = () => { pulseAnim.stopAnimation(); pulseAnim.setValue(1); };

  const runScan = () => {
    if (phase === 'scanning') return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setPhase('scanning');
    setDevices([]);
    setThreats([]);
    setFixedIds(new Set());
    progressAnim.setValue(0);
    startPulse();

    let prog = 0;
    intervalRef.current = setInterval(() => {
      prog += Math.random() * 8 + 4;
      if (prog >= 100) {
        prog = 100;
        clearInterval(intervalRef.current!);
        stopPulse();
        setPhase('done');
        setDevices(MOCK_DEVICES);
        setThreats(MOCK_THREATS);
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setProgress(Math.min(prog, 100));
      Animated.timing(progressAnim, { toValue: Math.min(prog / 100, 1), duration: 200, useNativeDriver: false }).start();
    }, 200);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const fixThreat = (id: string) => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFixedIds((prev) => new Set([...prev, id]));
  };

  const safeCount    = devices.filter((d) => d.threat === 'safe').length;
  const warningCount = devices.filter((d) => d.threat === 'warning').length;
  const dangerCount  = devices.filter((d) => d.threat === 'danger').length;
  const openThreats  = threats.filter((t) => !fixedIds.has(t.id));
  const overallSafe  = phase === 'done' && dangerCount === 0 && warningCount === 0;

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="WiFi Security Scanner" dark />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Radar / Score */}
          <View style={styles.radarSection}>
            <Animated.View style={[styles.radarOuter, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.radarInner}>
                {phase === 'idle' && <Text style={styles.radarEmoji}>📡</Text>}
                {phase === 'scanning' && (
                  <>
                    <Text style={styles.radarPct}>{Math.round(progress)}%</Text>
                    <Text style={styles.radarSub}>Scanning...</Text>
                  </>
                )}
                {phase === 'done' && (
                  <>
                    <Text style={[styles.radarScore, { color: overallSafe ? C.teal : dangerCount > 0 ? C.red : C.amber }]}>
                      {overallSafe ? '✓' : dangerCount > 0 ? '!' : '⚠'}
                    </Text>
                    <Text style={styles.radarSub}>{overallSafe ? 'Network Safe' : `${dangerCount + warningCount} Issues`}</Text>
                  </>
                )}
              </View>
            </Animated.View>

            {phase === 'scanning' && (
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
            )}

            {phase === 'done' && (
              <View style={styles.scoreRow}>
                {[
                  { label: 'Safe',    count: safeCount,    color: C.teal  },
                  { label: 'Warning', count: warningCount, color: C.amber },
                  { label: 'Danger',  count: dangerCount,  color: C.red   },
                ].map((s) => (
                  <View key={s.label} style={styles.scoreItem}>
                    <Text style={[styles.scoreNum, { color: s.color }]}>{s.count}</Text>
                    <Text style={styles.scoreLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
            )}

            <Pressable
              style={[styles.scanBtn, phase === 'scanning' && styles.scanBtnDisabled]}
              onPress={runScan}
              disabled={phase === 'scanning'}
            >
              <Text style={styles.scanBtnText}>
                {phase === 'idle' ? '🔍 Scan Network' : phase === 'scanning' ? '⏳ Scanning...' : '🔄 Rescan'}
              </Text>
            </Pressable>
          </View>

          {/* Threats */}
          {phase === 'done' && openThreats.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>THREATS FOUND</Text>
              {openThreats.map((t) => (
                <View key={t.id} style={[styles.threatCard, { borderLeftColor: THREAT_COLORS[t.level] }]}>
                  <View style={styles.threatHeader}>
                    <Text style={[styles.threatLevel, { color: THREAT_COLORS[t.level] }]}>
                      {t.level === 'danger' ? '🔴' : '🟡'} {t.level.toUpperCase()}
                    </Text>
                    <Pressable style={styles.fixBtn} onPress={() => fixThreat(t.id)}>
                      <Text style={styles.fixBtnText}>Fix</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.threatTitle}>{t.title}</Text>
                  <Text style={styles.threatDesc}>{t.desc}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Devices */}
          {phase === 'done' && devices.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DEVICES ON NETWORK ({devices.length})</Text>
              {devices.map((d) => (
                <View key={d.id} style={styles.deviceRow}>
                  <View style={[styles.deviceIcon, { backgroundColor: THREAT_COLORS[d.threat] + '20' }]}>
                    <Text style={styles.deviceEmoji}>{DEVICE_ICONS[d.type]}</Text>
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{d.name}</Text>
                    <Text style={styles.deviceIp}>{d.ip} · {d.mac}</Text>
                    <Text style={[styles.deviceDetail, { color: THREAT_COLORS[d.threat] }]}>{d.detail}</Text>
                  </View>
                  <View style={[styles.threatDot, { backgroundColor: THREAT_COLORS[d.threat] }]} />
                </View>
              ))}
            </View>
          )}

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>🛡️ WiFi Security Tips</Text>
            {[
              'Always use WPA3 encryption on your router.',
              'Change default router admin passwords.',
              'Use Bolt VPN on public WiFi networks.',
              'Regularly check for unknown devices.',
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
  scroll:    { paddingHorizontal: 16, paddingBottom: 32, gap: 20 },

  radarSection: { alignItems: 'center', paddingVertical: 16, gap: 16 },
  radarOuter: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
  radarInner:  { alignItems: 'center' },
  radarEmoji:  { fontSize: 48 },
  radarPct:    { fontFamily: 'Oxanium_700Bold', fontSize: 32, color: C.teal },
  radarScore:  { fontFamily: 'Oxanium_700Bold', fontSize: 40 },
  radarSub:    { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2 },

  progressTrack: { width: '80%', height: 6, backgroundColor: C.cardDark, borderRadius: 3, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: C.teal, borderRadius: 3 },

  scoreRow:   { flexDirection: 'row', gap: 24 },
  scoreItem:  { alignItems: 'center', gap: 2 },
  scoreNum:   { fontFamily: 'Oxanium_700Bold', fontSize: 24 },
  scoreLabel: { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2 },

  scanBtn: {
    backgroundColor: C.teal,
    borderRadius: 14,
    paddingHorizontal: 32,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBtnDisabled: { opacity: 0.5 },
  scanBtnText:     { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: '#000' },

  section:      { gap: 10 },
  sectionTitle: { fontFamily: 'Oxanium_600SemiBold', fontSize: 10, color: C.txtDark3, letterSpacing: 1.5 },

  threatCard: {
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.borderDark,
    borderLeftWidth: 3,
    gap: 6,
  },
  threatHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  threatLevel:  { fontFamily: 'Oxanium_700Bold', fontSize: 11, letterSpacing: 0.5 },
  fixBtn:       { backgroundColor: C.teal, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  fixBtnText:   { fontFamily: 'Oxanium_700Bold', fontSize: 12, color: '#000' },
  threatTitle:  { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark },
  threatDesc:   { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2, lineHeight: 17 },

  deviceRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: C.cardDark, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: C.borderDark, gap: 12 },
  deviceIcon:  { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  deviceEmoji: { fontSize: 20 },
  deviceInfo:  { flex: 1 },
  deviceName:  { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark },
  deviceIp:    { fontFamily: 'Oxanium_400Regular', fontSize: 11, color: C.txtDark3, marginTop: 2 },
  deviceDetail:{ fontFamily: 'Oxanium_400Regular', fontSize: 12, marginTop: 2 },
  threatDot:   { width: 10, height: 10, borderRadius: 5 },

  tipsCard:  { backgroundColor: C.cardDark, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.borderDark, gap: 8 },
  tipsTitle: { fontFamily: 'Oxanium_600SemiBold', fontSize: 13, color: C.txtDark, marginBottom: 4 },
  tipRow:    { flexDirection: 'row', gap: 8 },
  tipDot:    { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.teal },
  tipText:   { flex: 1, fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2, lineHeight: 18 },
});
