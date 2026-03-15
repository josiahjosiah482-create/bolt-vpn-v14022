import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';
import { trpc } from '@/lib/trpc';

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function StatsScreen() {
  const { data: history = [], isLoading } = trpc.connections.history.useQuery();

  const totalDataMB = history.reduce((sum, h) => sum + (h.dataDownMB ?? 0) + (h.dataUpMB ?? 0), 0);
  const totalDataGB = (totalDataMB / 1024).toFixed(2);
  const totalSessions = history.length;
  const totalDuration = history.reduce((sum, h) => sum + (h.durationSeconds ?? 0), 0);
  const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
  const uniqueServers = new Set(history.map((h) => h.serverId)).size;

  const SUMMARY_STATS = [
    { label: 'Total Data Used',      value: `${totalDataGB} GB`,             icon: '📊' },
    { label: 'Total Sessions',       value: String(totalSessions),            icon: '🔗' },
    { label: 'Avg Session Duration', value: formatDuration(avgDuration),      icon: '⏱️' },
    { label: 'Servers Used',         value: String(uniqueServers),            icon: '🌍' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Usage Stats" />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Summary stats */}
          {SUMMARY_STATS.map((s) => (
            <View key={s.label} style={styles.row}>
              <Text style={styles.icon}>{s.icon}</Text>
              <Text style={styles.label}>{s.label}</Text>
              <Text style={styles.value}>{s.value}</Text>
            </View>
          ))}

          {/* Connection history */}
          <Text style={styles.sectionTitle}>CONNECTION HISTORY</Text>
          {isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={C.teal} />
            </View>
          ) : history.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No connection history yet</Text>
              <Text style={styles.emptySub}>Connect to a server to start tracking sessions</Text>
            </View>
          ) : (
            history.map((h) => (
              <View key={h.id} style={styles.historyRow}>
                <View style={styles.historyIcon}>
                  <Text style={styles.historyEmoji}>🌐</Text>
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyDate}>{formatDate(h.connectedAt)}</Text>
                  <Text style={styles.historySub}>
                    {formatDuration(h.durationSeconds ?? 0)} · {((h.dataDownMB ?? 0) + (h.dataUpMB ?? 0)).toFixed(0)} MB
                  </Text>
                </View>
                <View style={styles.historyBadge}>
                  <Text style={styles.historyBadgeText}>↓{h.dataDownMB ?? 0} ↑{h.dataUpMB ?? 0} MB</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.light },
  safe:         { flex: 1 },
  scroll:       { padding: 16, gap: 8, paddingBottom: 32 },
  row:          { flexDirection: 'row', alignItems: 'center', backgroundColor: C.light2, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.borderLight, gap: 12 },
  icon:         { fontSize: 20 },
  label:        { flex: 1, fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight },
  value:        { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: C.teal },
  sectionTitle: { fontFamily: 'Oxanium_600SemiBold', fontSize: 10, color: C.txtLight3, letterSpacing: 1.5, marginTop: 8 },
  loadingWrap:  { alignItems: 'center', paddingTop: 24 },
  emptyWrap:    { alignItems: 'center', paddingTop: 24, gap: 6 },
  emptyText:    { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight2 },
  emptySub:     { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight3, textAlign: 'center' },
  historyRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: C.light2, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: C.borderLight, gap: 12 },
  historyIcon:  { width: 36, height: 36, borderRadius: 10, backgroundColor: C.tealBg, alignItems: 'center', justifyContent: 'center' },
  historyEmoji: { fontSize: 18 },
  historyInfo:  { flex: 1 },
  historyDate:  { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight },
  historySub:   { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight2, marginTop: 2 },
  historyBadge: { backgroundColor: C.tealBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  historyBadgeText: { fontFamily: 'Oxanium_600SemiBold', fontSize: 10, color: C.teal },
});
