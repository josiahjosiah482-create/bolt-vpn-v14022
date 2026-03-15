import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { Href } from 'expo-router';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C } from '@/constants/C';
import { trpc } from '@/lib/trpc';

const SERVERS = [
  { id: 1, flag: '🇺🇸', country: 'US East',    city: 'New York',   ping: 12,  premium: false },
  { id: 2, flag: '🇬🇧', country: 'UK',          city: 'London',     ping: 32,  premium: false },
  { id: 3, flag: '🇩🇪', country: 'Germany',     city: 'Frankfurt',  ping: 45,  premium: false },
  { id: 4, flag: '🇯🇵', country: 'Japan',       city: 'Tokyo',      ping: 88,  premium: true  },
  { id: 5, flag: '🇸🇬', country: 'Singapore',   city: 'Singapore',  ping: 72,  premium: true  },
];

const PROTOCOLS = ['WireGuard', 'OpenVPN', 'IKEv2'] as const;
type Protocol = typeof PROTOCOLS[number];

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

const QUICK_ACTIONS = [
  { icon: '📡', label: 'WiFi\nScan',       route: '/wifi-scanner'    },
  { icon: '🎬', label: 'Streaming',        route: '/streaming'       },
  { icon: '📊', label: 'App\nMonitor',     route: '/app-monitor'     },
  { icon: '🔄', label: 'Bandwidth',        route: '/bandwidth-share' },
  { icon: '🔍', label: 'Privacy\nAudit',   route: '/privacy-audit'   },
  { icon: '📱', label: 'My\nDevices',      route: '/devices'         },
] as const;

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('bolt_onboarding_done').then((val) => {
      if (!val) router.replace('/onboarding' as any);
    });
  }, []);

  const { data: userData } = trpc.auth.me.useQuery(undefined, { retry: false });
  const user = userData as any;
  const userInitial = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'B';

  const [isConnected, setIsConnected]       = useState(false);
  const [isConnecting, setIsConnecting]     = useState(false);
  const [selectedServer, setSelectedServer] = useState(SERVERS[0]);
  const [currentIp, setCurrentIp]           = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [liveDownload, setLiveDownload]     = useState(0);
  const [liveUpload, setLiveUpload]         = useState(0);
  const [livePing, setLivePing]             = useState(0);
  const [protocol, setProtocol]             = useState<Protocol>('WireGuard');

  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const pingRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const glowAnim  = useRef(new Animated.Value(0.4)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isConnected) {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 0.9, duration: 1600, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.4, duration: 1600, useNativeDriver: true }),
        ])
      );
      glow.start();
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
      return () => { glow.stop(); if (timerRef.current) clearInterval(timerRef.current); };
    } else {
      glowAnim.setValue(0.4);
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedSeconds(0);
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      const base = selectedServer.ping;
      setLivePing(base);
      setLiveDownload(Math.round(180 + Math.random() * 120));
      setLiveUpload(Math.round(60 + Math.random() * 60));
      pingRef.current = setInterval(() => {
        setLivePing(Math.round(base + (Math.random() - 0.5) * 12));
        setLiveDownload(Math.round(180 + (Math.random() - 0.5) * 40));
        setLiveUpload(Math.round(70 + (Math.random() - 0.5) * 20));
      }, 3000);
      return () => { if (pingRef.current) clearInterval(pingRef.current); };
    } else {
      if (pingRef.current) clearInterval(pingRef.current);
      setLivePing(0); setLiveDownload(0); setLiveUpload(0);
    }
  }, [isConnected, selectedServer]);

  const handleConnect = () => {
    if (isConnecting) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsConnecting(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 120, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      if (isConnected) {
        setIsConnected(false);
        setCurrentIp(null);
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        setIsConnected(true);
        const ip = `${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;
        setCurrentIp(ip);
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setIsConnecting(false);
    }, 1800);
  };

  const statusColor = isConnected ? C.teal : C.red;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⚡ BOLT VPN</Text>
          <View style={[styles.statusBadge, {
            backgroundColor: isConnected ? C.tealBg : C.redBg,
            borderColor: isConnected ? C.tealBorder : 'rgba(239,68,68,0.25)',
          }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusBadgeText, { color: statusColor }]}>
              {isConnecting ? 'CONNECTING' : isConnected ? 'CONNECTED' : 'NOT PROTECTED'}
            </Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/account' as Href)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </View>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Shield section */}
          <View style={styles.shieldSection}>
            <Animated.View style={[styles.glowRing, { opacity: glowAnim, borderColor: statusColor }]} />
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Pressable
                onPress={handleConnect}
                style={[styles.shieldCircle, { borderColor: statusColor, shadowColor: statusColor }]}
              >
                <Text style={styles.shieldEmoji}>
                  {isConnecting ? '⏳' : isConnected ? '✅' : '🛡️'}
                </Text>
              </Pressable>
            </Animated.View>
            <Text style={[styles.shieldStatus, { color: statusColor }]}>
              {isConnecting ? 'Connecting...' : isConnected ? 'Protected' : 'Not Protected'}
            </Text>

            {/* IP pill */}
            {isConnected && currentIp ? (
              <View style={styles.ipPill}>
                <Text style={styles.ipText}>IP: {currentIp}</Text>
              </View>
            ) : (
              <View style={[styles.ipPill, { borderColor: 'rgba(239,68,68,0.30)', backgroundColor: C.redBg }]}>
                <Text style={[styles.ipText, { color: C.red }]}>Your IP is exposed</Text>
              </View>
            )}

            {/* Timer */}
            {isConnected && (
              <Text style={styles.timer}>{formatDuration(elapsedSeconds)}</Text>
            )}

            {/* Power button */}
            <Pressable
              onPress={handleConnect}
              disabled={isConnecting}
              style={[styles.powerBtn, { backgroundColor: isConnected ? C.teal : C.dark3, borderColor: statusColor }]}
            >
              <MaterialIcons name="power-settings-new" size={28} color={isConnected ? '#000' : statusColor} />
            </Pressable>
          </View>

          {/* Connection Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.cardLabel}>CONNECTION DETAILS</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Server</Text>
              <Text style={styles.detailVal}>{selectedServer.flag} {selectedServer.country} — {selectedServer.city}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Protocol</Text>
              <View style={styles.protocolPill}>
                <Text style={styles.protocolPillText}>{protocol}</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Latency</Text>
              <Text style={[styles.detailVal, { color: C.teal }]}>
                {isConnected && livePing > 0 ? `${livePing}ms` : `${selectedServer.ping}ms`}
              </Text>
            </View>
            {isConnected && (
              <>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Download</Text>
                  <Text style={[styles.detailVal, { color: C.teal }]}>{liveDownload} Mbps</Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Upload</Text>
                  <Text style={[styles.detailVal, { color: C.teal }]}>{liveUpload} Mbps</Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Duration</Text>
                  <Text style={[styles.detailVal, { color: C.teal }]}>{formatDuration(elapsedSeconds)}</Text>
                </View>
              </>
            )}
          </View>

          {/* Server Location */}
          <Text style={styles.sectionLabel}>SERVER LOCATION</Text>
          <Pressable
            style={styles.serverCard}
            onPress={() => router.push('/(tabs)/servers' as Href)}
          >
            <Text style={styles.serverFlag}>{selectedServer.flag}</Text>
            <View style={styles.serverInfo}>
              <Text style={styles.serverName}>{selectedServer.country} — {selectedServer.city}</Text>
              <Text style={styles.serverCity}>Tap to change server</Text>
            </View>
            <Text style={[styles.serverPing, { color: C.teal }]}>{selectedServer.ping}ms</Text>
            <MaterialIcons name="chevron-right" size={20} color={C.txtDark3} />
          </Pressable>

          {/* Protocol selector */}
          <Text style={styles.sectionLabel}>PROTOCOL</Text>
          <View style={styles.protocolRow}>
            {PROTOCOLS.map((p) => (
              <Pressable
                key={p}
                onPress={() => setProtocol(p)}
                style={[
                  styles.protocolBtn,
                  protocol === p && styles.protocolBtnActive,
                ]}
              >
                <Text style={[styles.protocolBtnText, protocol === p && styles.protocolBtnTextActive]}>
                  {p}
                </Text>
                {protocol === p && <Text style={styles.protocolCheck}> ✓</Text>}
              </Pressable>
            ))}
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
          <View style={styles.quickActions}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.route}
                style={styles.quickBtn}
                onPress={() => router.push(action.route as Href)}
              >
                <Text style={styles.quickIcon}>{action.icon}</Text>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </Pressable>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle:     { fontFamily: 'Oxanium_700Bold', fontSize: 16, color: C.teal, letterSpacing: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot:       { width: 7, height: 7, borderRadius: 4 },
  statusBadgeText: { fontFamily: 'Oxanium_700Bold', fontSize: 10, letterSpacing: 0.8 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: '#000' },

  scroll: { paddingHorizontal: 20, paddingBottom: 32 },

  shieldSection: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  glowRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    top: 10,
  },
  shieldCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: C.cardDark,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  shieldEmoji:  { fontSize: 44 },
  shieldStatus: { fontFamily: 'Oxanium_700Bold', fontSize: 18, letterSpacing: 1 },
  ipPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.tealBorder,
    backgroundColor: C.tealBg,
  },
  ipText:   { fontFamily: 'Oxanium_600SemiBold', fontSize: 13, color: C.teal },
  timer:    { fontFamily: 'Oxanium_700Bold', fontSize: 22, color: C.txtDark, letterSpacing: 2 },
  powerBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginTop: 4,
  },

  detailsCard: {
    backgroundColor: C.cardDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderDark,
    marginBottom: 20,
  },
  cardLabel: {
    fontFamily: 'Oxanium_600SemiBold',
    fontSize: 10,
    color: C.txtDark3,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  detailRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  detailDivider: { height: 1, backgroundColor: C.borderDark },
  detailKey:     { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2 },
  detailVal:     { fontFamily: 'Oxanium_600SemiBold', fontSize: 13, color: C.txtDark },
  protocolPill: {
    backgroundColor: C.tealBg,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: C.tealBorder,
  },
  protocolPillText: { fontFamily: 'Oxanium_700Bold', fontSize: 11, color: C.teal },

  sectionLabel: {
    fontFamily: 'Oxanium_600SemiBold',
    fontSize: 10,
    color: C.txtDark3,
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  serverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 12,
    marginBottom: 20,
  },
  serverFlag: { fontSize: 28 },
  serverInfo: { flex: 1, gap: 2 },
  serverName: { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark },
  serverCity: { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2 },
  serverPing: { fontFamily: 'Oxanium_700Bold', fontSize: 13 },

  protocolRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  protocolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: C.cardDark,
    borderWidth: 1,
    borderColor: C.borderDark,
  },
  protocolBtnActive:     { borderColor: C.teal, backgroundColor: C.tealBg },
  protocolBtnText:       { fontFamily: 'Oxanium_600SemiBold', fontSize: 12, color: C.txtDark2 },
  protocolBtnTextActive: { color: C.teal },
  protocolCheck:         { fontFamily: 'Oxanium_700Bold', fontSize: 12, color: C.teal },

  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  quickBtn: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 6,
  },
  quickIcon:  { fontSize: 22 },
  quickLabel: {
    fontFamily: 'Oxanium_600SemiBold',
    fontSize: 10,
    color: C.txtDark2,
    textAlign: 'center',
    lineHeight: 14,
  },
});
