import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

const STATS = [
  { label: 'Total Data Used',      value: '48.2 GB',    icon: '📊' },
  { label: 'Sessions This Month',  value: '142',        icon: '🔗' },
  { label: 'Avg Session Duration', value: '1h 24m',     icon: '⏱️' },
  { label: 'Servers Used',         value: '18',         icon: '🌍' },
  { label: 'Threats Blocked',      value: '2,847',      icon: '🛡️' },
  { label: 'Trackers Blocked',     value: '14,203',     icon: '🚫' },
  { label: 'Ads Blocked',          value: '8,941',      icon: '📵' },
  { label: 'Member Since',         value: 'Jan 2025',   icon: '📅' },
];

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Usage Stats" />
        <ScrollView contentContainerStyle={styles.scroll}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.row}>
              <Text style={styles.icon}>{s.icon}</Text>
              <Text style={styles.label}>{s.label}</Text>
              <Text style={styles.value}>{s.value}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.light },
  safe:      { flex: 1 },
  scroll:    { padding: 16, gap: 8 },
  row:       { flexDirection: 'row', alignItems: 'center', backgroundColor: C.light2, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.borderLight, gap: 12 },
  icon:      { fontSize: 20 },
  label:     { flex: 1, fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight },
  value:     { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: C.teal },
});
