import { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

type StreamService = {
  id: string;
  name: string;
  icon: string;
  region: string;
  server: string;
  status: 'available' | 'limited' | 'unavailable';
  connected: boolean;
};

const SERVICES: StreamService[] = [
  { id: 'netflix',   name: 'Netflix',       icon: '🎥', region: 'US',  server: 'New York #12',    status: 'available',   connected: false },
  { id: 'disney',    name: 'Disney+',       icon: '🏰', region: 'US',  server: 'Los Angeles #3',  status: 'available',   connected: false },
  { id: 'hulu',      name: 'Hulu',          icon: '📺', region: 'US',  server: 'Chicago #7',      status: 'available',   connected: false },
  { id: 'hbomax',    name: 'Max (HBO)',      icon: '👑', region: 'US',  server: 'Dallas #5',       status: 'available',   connected: false },
  { id: 'bbc',       name: 'BBC iPlayer',   icon: '🇬🇧', region: 'UK',  server: 'London #4',       status: 'available',   connected: false },
  { id: 'amazon',    name: 'Prime Video',   icon: '📦', region: 'US',  server: 'Seattle #2',      status: 'available',   connected: false },
  { id: 'spotify',   name: 'Spotify',       icon: '🎵', region: 'US',  server: 'Miami #8',        status: 'available',   connected: false },
  { id: 'youtube',   name: 'YouTube Premium',icon: '▶️', region: 'US',  server: 'San Jose #1',     status: 'available',   connected: false },
  { id: 'crunchyroll',name: 'Crunchyroll',  icon: '🍥', region: 'JP',  server: 'Tokyo #3',        status: 'limited',     connected: false },
  { id: 'dazn',      name: 'DAZN',          icon: '⚽', region: 'DE',  server: 'Frankfurt #6',    status: 'available',   connected: false },
  { id: 'peacock',   name: 'Peacock',       icon: '🦚', region: 'US',  server: 'Atlanta #4',      status: 'available',   connected: false },
  { id: 'fubo',      name: 'FuboTV',        icon: '📡', region: 'US',  server: 'Phoenix #2',      status: 'limited',     connected: false },
];

const REGIONS = ['All', 'US', 'UK', 'JP', 'DE', 'CA', 'AU'];

const STATUS_COLORS: Record<string, string> = {
  available:   C.teal,
  limited:     C.amber,
  unavailable: C.red,
};

const STATUS_LABELS: Record<string, string> = {
  available:   '✓ Available',
  limited:     '⚠ Limited',
  unavailable: '✗ Blocked',
};

export default function StreamingScreen() {
  const [services, setServices] = useState<StreamService[]>(SERVICES);
  const [region, setRegion]     = useState('All');
  const [connecting, setConnecting] = useState<string | null>(null);

  const connect = (id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setConnecting(id);
    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, connected: !s.connected }
            : { ...s, connected: s.connected && s.id !== id ? false : s.connected }
        )
      );
      setConnecting(null);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1200);
  };

  const filtered = services.filter((s) => region === 'All' || s.region === region);
  const connectedService = services.find((s) => s.connected);

  const renderItem = ({ item }: { item: StreamService }) => {
    const isConnecting = connecting === item.id;
    const statusColor  = STATUS_COLORS[item.status];

    return (
      <View style={[styles.serviceCard, item.connected && styles.serviceCardActive]}>
        <View style={styles.serviceLeft}>
          <View style={[styles.serviceIcon, item.connected && { backgroundColor: C.tealBg }]}>
            <Text style={styles.serviceEmoji}>{item.icon}</Text>
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.serviceServer}>🌍 {item.region} · {item.server}</Text>
            <Text style={[styles.serviceStatus, { color: statusColor }]}>{STATUS_LABELS[item.status]}</Text>
          </View>
        </View>
        <Pressable
          style={[
            styles.connectBtn,
            item.connected && styles.connectBtnActive,
            item.status === 'unavailable' && styles.connectBtnDisabled,
          ]}
          onPress={() => item.status !== 'unavailable' && connect(item.id)}
          disabled={item.status === 'unavailable' || isConnecting}
        >
          <Text style={[styles.connectBtnText, item.connected && { color: '#000' }]}>
            {isConnecting ? '...' : item.connected ? 'Connected' : 'Connect'}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Streaming Unlocker" dark />

        {/* Active connection banner */}
        {connectedService && (
          <View style={styles.activeBanner}>
            <Text style={styles.activeBannerIcon}>{connectedService.icon}</Text>
            <View style={styles.activeBannerInfo}>
              <Text style={styles.activeBannerTitle}>Connected to {connectedService.name}</Text>
              <Text style={styles.activeBannerSub}>{connectedService.server}</Text>
            </View>
            <View style={styles.activeDot} />
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Services',  value: String(SERVICES.length), icon: '📺' },
            { label: 'Countries', value: '35+',                   icon: '🌍' },
            { label: 'Servers',   value: '500+',                  icon: '🖥️' },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Region filter */}
        <FlatList
          data={REGIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.regionList}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.regionChip, region === item && styles.regionChipActive]}
              onPress={() => setRegion(item)}
            >
              <Text style={[styles.regionText, region === item && styles.regionTextActive]}>{item}</Text>
            </Pressable>
          )}
        />

        {/* Services list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.dark },
  safe:      { flex: 1 },

  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.tealBg,
    borderWidth: 1,
    borderColor: C.tealBorder,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    gap: 10,
  },
  activeBannerIcon:  { fontSize: 22 },
  activeBannerInfo:  { flex: 1 },
  activeBannerTitle: { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: C.teal },
  activeBannerSub:   { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2 },
  activeDot:         { width: 10, height: 10, borderRadius: 5, backgroundColor: C.teal },

  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 3,
  },
  statIcon:  { fontSize: 18 },
  statValue: { fontFamily: 'Oxanium_700Bold', fontSize: 18, color: C.teal },
  statLabel: { fontFamily: 'Oxanium_400Regular', fontSize: 10, color: C.txtDark2, textAlign: 'center' },

  regionList: { paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  regionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.cardDark,
    borderWidth: 1,
    borderColor: C.borderDark,
  },
  regionChipActive:  { backgroundColor: C.tealBg, borderColor: C.tealBorder },
  regionText:        { fontFamily: 'Oxanium_600SemiBold', fontSize: 12, color: C.txtDark2 },
  regionTextActive:  { color: C.teal },

  list: { paddingHorizontal: 16, paddingBottom: 32 },

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 12,
  },
  serviceCardActive: { borderColor: C.tealBorder, backgroundColor: C.tealBg2 },
  serviceLeft:       { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  serviceIcon:       { width: 44, height: 44, borderRadius: 12, backgroundColor: C.dark2, alignItems: 'center', justifyContent: 'center' },
  serviceEmoji:      { fontSize: 22 },
  serviceInfo:       { flex: 1, gap: 2 },
  serviceName:       { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: C.txtDark },
  serviceServer:     { fontFamily: 'Oxanium_400Regular', fontSize: 11, color: C.txtDark3 },
  serviceStatus:     { fontFamily: 'Oxanium_600SemiBold', fontSize: 11 },

  connectBtn: {
    backgroundColor: C.dark2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: C.borderDark,
  },
  connectBtnActive:   { backgroundColor: C.teal, borderColor: C.teal },
  connectBtnDisabled: { opacity: 0.4 },
  connectBtnText:     { fontFamily: 'Oxanium_700Bold', fontSize: 12, color: C.txtDark2 },
});
