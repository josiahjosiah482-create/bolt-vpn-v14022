import { useState } from 'react';
import {
  Alert,
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

type DeviceType = 'phone' | 'tablet' | 'laptop' | 'desktop' | 'tv' | 'router';
type DeviceStatus = 'connected' | 'idle' | 'offline';

type ManagedDevice = {
  id: string;
  name: string;
  type: DeviceType;
  os: string;
  ip: string;
  location: string;
  server: string;
  status: DeviceStatus;
  lastSeen: string;
  dataUsed: number;
  isCurrent: boolean;
};

const MOCK_DEVICES: ManagedDevice[] = [
  { id: '1', name: 'iPhone 15 Pro',   type: 'phone',   os: 'iOS 17',       ip: '10.8.0.2',  location: 'New York, US',   server: 'US-NY #12', status: 'connected', lastSeen: 'Now',        dataUsed: 1240, isCurrent: true  },
  { id: '2', name: 'MacBook Pro M3',  type: 'laptop',  os: 'macOS 14',     ip: '10.8.0.3',  location: 'New York, US',   server: 'US-NY #12', status: 'connected', lastSeen: '5 min ago',  dataUsed: 4820, isCurrent: false },
  { id: '3', name: 'iPad Air',        type: 'tablet',  os: 'iPadOS 17',    ip: '10.8.0.4',  location: 'London, UK',     server: 'UK-LON #4', status: 'idle',      lastSeen: '2 hrs ago',  dataUsed: 380,  isCurrent: false },
  { id: '4', name: 'Windows PC',      type: 'desktop', os: 'Windows 11',   ip: '10.8.0.5',  location: 'Berlin, DE',     server: 'DE-BER #2', status: 'connected', lastSeen: '1 min ago',  dataUsed: 2100, isCurrent: false },
  { id: '5', name: 'Samsung TV',      type: 'tv',      os: 'Tizen 7',      ip: '—',         location: '—',              server: '—',         status: 'offline',   lastSeen: '3 days ago', dataUsed: 0,    isCurrent: false },
  { id: '6', name: 'Android Phone',   type: 'phone',   os: 'Android 14',   ip: '10.8.0.6',  location: 'Tokyo, JP',      server: 'JP-TYO #3', status: 'idle',      lastSeen: '30 min ago', dataUsed: 620,  isCurrent: false },
];

const DEVICE_ICONS: Record<DeviceType, string> = {
  phone: '📱', tablet: '📱', laptop: '💻', desktop: '🖥️', tv: '📺', router: '📡',
};

const STATUS_CONFIG: Record<DeviceStatus, { color: string; label: string }> = {
  connected: { color: C.teal,     label: 'Connected' },
  idle:      { color: C.amber,    label: 'Idle'      },
  offline:   { color: C.txtDark3, label: 'Offline'   },
};

function formatMB(mb: number): string {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  return `${mb} MB`;
}

export default function DevicesScreen() {
  const [devices, setDevices] = useState<ManagedDevice[]>(MOCK_DEVICES);
  const [filter, setFilter]   = useState<'all' | DeviceStatus>('all');

  const connectedCount = devices.filter((d) => d.status === 'connected').length;
  const maxDevices     = 6;
  const totalData      = devices.reduce((sum, d) => sum + d.dataUsed, 0);

  const disconnect = (id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDevices((prev) =>
      prev.map((d) => d.id === id && !d.isCurrent ? { ...d, status: 'idle' as DeviceStatus } : d)
    );
  };

  const remove = (id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const filtered = devices.filter((d) => filter === 'all' || d.status === filter);

  const renderDevice = ({ item }: { item: ManagedDevice }) => {
    const cfg = STATUS_CONFIG[item.status];
    return (
      <View style={[styles.deviceCard, item.isCurrent && styles.deviceCardCurrent]}>
        <View style={styles.deviceTop}>
          <View style={[styles.deviceIconWrap, { backgroundColor: cfg.color + '15' }]}>
            <Text style={styles.deviceEmoji}>{DEVICE_ICONS[item.type]}</Text>
          </View>
          <View style={styles.deviceInfo}>
            <View style={styles.deviceNameRow}>
              <Text style={styles.deviceName}>{item.name}</Text>
              {item.isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>THIS DEVICE</Text>
                </View>
              )}
            </View>
            <Text style={styles.deviceOs}>{item.os} · {item.ip}</Text>
            <View style={styles.deviceStatusRow}>
              <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
              <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
              <Text style={styles.deviceLocation}>· {item.location}</Text>
            </View>
          </View>
        </View>

        {item.status !== 'offline' && (
          <View style={styles.deviceMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Server</Text>
              <Text style={styles.metaValue}>{item.server}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Data Used</Text>
              <Text style={styles.metaValue}>{formatMB(item.dataUsed)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Last Seen</Text>
              <Text style={styles.metaValue}>{item.lastSeen}</Text>
            </View>
          </View>
        )}

        {!item.isCurrent && (
          <View style={styles.deviceActions}>
            {item.status === 'connected' && (
              <Pressable style={styles.disconnectBtn} onPress={() => disconnect(item.id)}>
                <Text style={styles.disconnectBtnText}>Disconnect</Text>
              </Pressable>
            )}
            <Pressable style={styles.removeBtn} onPress={() => remove(item.id)}>
              <MaterialIcons name="delete-outline" size={16} color={C.red} />
              <Text style={styles.removeBtnText}>Remove</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Multi-Device Manager" dark />

        {/* Summary */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Connected',    value: `${connectedCount}/${maxDevices}`, icon: '🔗', color: C.teal  },
            { label: 'Total Devices',value: String(devices.length),            icon: '📱', color: C.txtDark },
            { label: 'Data Used',    value: formatMB(totalData),               icon: '📊', color: C.amber },
          ].map((s) => (
            <View key={s.label} style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>{s.icon}</Text>
              <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Slot bar */}
        <View style={styles.slotSection}>
          <View style={styles.slotHeader}>
            <Text style={styles.slotTitle}>Device Slots</Text>
            <Text style={styles.slotCount}>{connectedCount}/{maxDevices} used</Text>
          </View>
          <View style={styles.slotBar}>
            {Array.from({ length: maxDevices }).map((_, i) => (
              <View
                key={i}
                style={[styles.slotSegment, i < connectedCount && styles.slotSegmentFilled]}
              />
            ))}
          </View>
        </View>

        {/* Filter */}
        <View style={styles.filterRow}>
          {(['all', 'connected', 'idle', 'offline'] as const).map((f) => (
            <Pressable
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Device list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderDevice}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListFooterComponent={
            <Pressable style={styles.addDeviceBtn}>
              <MaterialIcons name="add" size={20} color={C.teal} />
              <Text style={styles.addDeviceBtnText}>Add New Device</Text>
            </Pressable>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.dark },
  safe:      { flex: 1 },

  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
  summaryCard: {
    flex: 1,
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 3,
  },
  summaryIcon:  { fontSize: 18 },
  summaryValue: { fontFamily: 'Oxanium_700Bold', fontSize: 16 },
  summaryLabel: { fontFamily: 'Oxanium_400Regular', fontSize: 10, color: C.txtDark2, textAlign: 'center' },

  slotSection: { paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  slotHeader:  { flexDirection: 'row', justifyContent: 'space-between' },
  slotTitle:   { fontFamily: 'Oxanium_600SemiBold', fontSize: 13, color: C.txtDark2 },
  slotCount:   { fontFamily: 'Oxanium_600SemiBold', fontSize: 13, color: C.teal },
  slotBar:     { flexDirection: 'row', gap: 4 },
  slotSegment: { flex: 1, height: 8, borderRadius: 4, backgroundColor: C.borderDark },
  slotSegmentFilled: { backgroundColor: C.teal },

  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 6, marginBottom: 12 },
  filterBtn: {
    flex: 1,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.borderDark,
  },
  filterBtnActive:  { backgroundColor: C.teal },
  filterText:       { fontFamily: 'Oxanium_600SemiBold', fontSize: 11, color: C.txtDark3 },
  filterTextActive: { color: '#000' },

  list: { paddingHorizontal: 16, paddingBottom: 32 },

  deviceCard: {
    backgroundColor: C.cardDark,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 12,
  },
  deviceCardCurrent: { borderColor: C.tealBorder },
  deviceTop:         { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  deviceIconWrap:    { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  deviceEmoji:       { fontSize: 22 },
  deviceInfo:        { flex: 1, gap: 3 },
  deviceNameRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deviceName:        { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: C.txtDark },
  currentBadge:      { backgroundColor: C.tealBg, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: C.tealBorder },
  currentBadgeText:  { fontFamily: 'Oxanium_700Bold', fontSize: 8, color: C.teal, letterSpacing: 0.5 },
  deviceOs:          { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark3 },
  deviceStatusRow:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot:         { width: 7, height: 7, borderRadius: 4 },
  statusText:        { fontFamily: 'Oxanium_600SemiBold', fontSize: 12 },
  deviceLocation:    { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark3 },

  deviceMeta:  { flexDirection: 'row', backgroundColor: C.dark2, borderRadius: 10, padding: 10, gap: 4 },
  metaItem:    { flex: 1, alignItems: 'center', gap: 2 },
  metaLabel:   { fontFamily: 'Oxanium_400Regular', fontSize: 10, color: C.txtDark3 },
  metaValue:   { fontFamily: 'Oxanium_600SemiBold', fontSize: 12, color: C.txtDark },

  deviceActions:   { flexDirection: 'row', gap: 8 },
  disconnectBtn:   { flex: 1, height: 36, borderRadius: 10, backgroundColor: C.dark2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.borderDark },
  disconnectBtnText: { fontFamily: 'Oxanium_600SemiBold', fontSize: 12, color: C.txtDark2 },
  removeBtn:       { flexDirection: 'row', alignItems: 'center', gap: 4, height: 36, paddingHorizontal: 14, borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  removeBtnText:   { fontFamily: 'Oxanium_600SemiBold', fontSize: 12, color: C.red },

  addDeviceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.tealBorder,
    borderStyle: 'dashed',
  },
  addDeviceBtnText: { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: C.teal },
});
