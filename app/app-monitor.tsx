import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

type AppEntry = {
  id: string;
  name: string;
  icon: string;
  sent: number;
  received: number;
  total: number;
  category: string;
  blocked: boolean;
};

const MOCK_APPS: AppEntry[] = [
  { id: '1', name: 'YouTube',    icon: '▶️',  sent: 120,  received: 4800, total: 4920, category: 'Streaming',   blocked: false },
  { id: '2', name: 'Instagram',  icon: '📸',  sent: 340,  received: 1200, total: 1540, category: 'Social',      blocked: false },
  { id: '3', name: 'Spotify',    icon: '🎵',  sent: 20,   received: 980,  total: 1000, category: 'Music',       blocked: false },
  { id: '4', name: 'WhatsApp',   icon: '💬',  sent: 180,  received: 420,  total: 600,  category: 'Messaging',   blocked: false },
  { id: '5', name: 'Chrome',     icon: '🌐',  sent: 280,  received: 890,  total: 1170, category: 'Browser',     blocked: false },
  { id: '6', name: 'TikTok',     icon: '🎬',  sent: 90,   received: 2400, total: 2490, category: 'Streaming',   blocked: false },
  { id: '7', name: 'Twitter/X',  icon: '🐦',  sent: 60,   received: 380,  total: 440,  category: 'Social',      blocked: false },
  { id: '8', name: 'Gmail',      icon: '📧',  sent: 45,   received: 120,  total: 165,  category: 'Productivity',blocked: false },
  { id: '9', name: 'Netflix',    icon: '🎥',  sent: 30,   received: 3600, total: 3630, category: 'Streaming',   blocked: false },
  { id: '10',name: 'Maps',       icon: '🗺️',  sent: 12,   received: 280,  total: 292,  category: 'Navigation',  blocked: false },
];

const CATEGORIES = ['All', 'Streaming', 'Social', 'Music', 'Messaging', 'Browser'];

function formatMB(mb: number): string {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  return `${mb} MB`;
}

export default function AppMonitorScreen() {
  const [apps, setApps]         = useState<AppEntry[]>(MOCK_APPS);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy]     = useState<'total' | 'sent' | 'received'>('total');

  const totalData = apps.reduce((sum, a) => sum + a.total, 0);
  const maxTotal  = Math.max(...apps.map((a) => a.total));

  const toggleBlock = (id: string) => {
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, blocked: !a.blocked } : a));
  };

  const filtered = apps
    .filter((a) => category === 'All' || a.category === category)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const renderItem = ({ item }: { item: AppEntry }) => {
    const barWidth = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
    return (
      <View style={[styles.appRow, item.blocked && styles.appRowBlocked]}>
        <View style={styles.appIcon}>
          <Text style={styles.appEmoji}>{item.icon}</Text>
        </View>
        <View style={styles.appInfo}>
          <View style={styles.appNameRow}>
            <Text style={[styles.appName, item.blocked && styles.appNameBlocked]}>{item.name}</Text>
            <Text style={styles.appCategory}>{item.category}</Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${barWidth}%` as any, opacity: item.blocked ? 0.3 : 1 }]} />
          </View>
          <View style={styles.appStats}>
            <Text style={styles.appStatText}>⬇ {formatMB(item.received)}</Text>
            <Text style={styles.appStatText}>⬆ {formatMB(item.sent)}</Text>
            <Text style={[styles.appTotal, item.blocked && { color: C.txtDark3 }]}>{formatMB(item.total)}</Text>
          </View>
        </View>
        <Pressable
          style={[styles.blockBtn, item.blocked && styles.blockBtnActive]}
          onPress={() => toggleBlock(item.id)}
        >
          <MaterialIcons
            name={item.blocked ? 'lock' : 'lock-open'}
            size={16}
            color={item.blocked ? C.red : C.txtDark3}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="App Data Monitor" dark />

        {/* Summary */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Total Used', value: formatMB(totalData), icon: '📊' },
            { label: 'Apps Tracked', value: String(apps.length), icon: '📱' },
            { label: 'Blocked', value: String(apps.filter((a) => a.blocked).length), icon: '🚫' },
          ].map((s) => (
            <View key={s.label} style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>{s.icon}</Text>
              <Text style={styles.summaryValue}>{s.value}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Sort */}
        <View style={styles.sortRow}>
          {(['total', 'received', 'sent'] as const).map((s) => (
            <Pressable
              key={s}
              style={[styles.sortBtn, sortBy === s && styles.sortBtnActive]}
              onPress={() => setSortBy(s)}
            >
              <Text style={[styles.sortText, sortBy === s && styles.sortTextActive]}>
                {s === 'total' ? 'Total' : s === 'received' ? '⬇ Download' : '⬆ Upload'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Category filter */}
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.catList}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.catChip, category === item && styles.catChipActive]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.catText, category === item && styles.catTextActive]}>{item}</Text>
            </Pressable>
          )}
        />

        {/* App list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  summaryValue: { fontFamily: 'Oxanium_700Bold', fontSize: 16, color: C.teal },
  summaryLabel: { fontFamily: 'Oxanium_400Regular', fontSize: 10, color: C.txtDark2, textAlign: 'center' },

  sortRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 10 },
  sortBtn: {
    flex: 1,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.borderDark,
  },
  sortBtnActive:  { backgroundColor: C.teal },
  sortText:       { fontFamily: 'Oxanium_600SemiBold', fontSize: 11, color: C.txtDark2 },
  sortTextActive: { color: '#000' },

  catList: { paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.cardDark,
    borderWidth: 1,
    borderColor: C.borderDark,
  },
  catChipActive:  { backgroundColor: C.tealBg, borderColor: C.tealBorder },
  catText:        { fontFamily: 'Oxanium_600SemiBold', fontSize: 12, color: C.txtDark2 },
  catTextActive:  { color: C.teal },

  list:      { paddingHorizontal: 16, paddingBottom: 32 },
  separator: { height: 8 },

  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 12,
  },
  appRowBlocked: { opacity: 0.6 },
  appIcon:       { width: 40, height: 40, borderRadius: 12, backgroundColor: C.dark2, alignItems: 'center', justifyContent: 'center' },
  appEmoji:      { fontSize: 20 },
  appInfo:       { flex: 1, gap: 5 },
  appNameRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appName:       { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark },
  appNameBlocked:{ textDecorationLine: 'line-through', color: C.txtDark3 },
  appCategory:   { fontFamily: 'Oxanium_400Regular', fontSize: 10, color: C.txtDark3 },
  barTrack:      { height: 4, backgroundColor: C.borderDark, borderRadius: 2, overflow: 'hidden' },
  barFill:       { height: '100%', backgroundColor: C.teal, borderRadius: 2 },
  appStats:      { flexDirection: 'row', gap: 10 },
  appStatText:   { fontFamily: 'Oxanium_400Regular', fontSize: 11, color: C.txtDark3 },
  appTotal:      { fontFamily: 'Oxanium_700Bold', fontSize: 12, color: C.teal, marginLeft: 'auto' },

  blockBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.dark2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.borderDark,
  },
  blockBtnActive: { borderColor: C.red, backgroundColor: 'rgba(239,68,68,0.12)' },
});
