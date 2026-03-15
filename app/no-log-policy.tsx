import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

const POINTS = [
  { icon: '🚫', title: 'No Connection Logs',    desc: 'We never record when you connect or disconnect from our servers.' },
  { icon: '🌐', title: 'No IP Address Logs',    desc: 'Your real IP address is never stored or associated with your account.' },
  { icon: '📋', title: 'No Browsing History',   desc: 'We do not track, store, or sell your browsing history or DNS queries.' },
  { icon: '📊', title: 'No Bandwidth Logs',     desc: 'We do not monitor or record how much data you use.' },
  { icon: '✅', title: 'Independently Audited', desc: 'Our no-log policy has been verified by Deloitte in March 2026.' },
];

export default function NoLogPolicyScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="No-Log Policy" dark />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>📋</Text>
            <Text style={styles.heroTitle}>Verified No-Log Policy</Text>
            <Text style={styles.heroSub}>Your privacy is our promise — independently verified</Text>
          </View>
          {POINTS.map((p) => (
            <View key={p.title} style={styles.card}>
              <Text style={styles.cardIcon}>{p.icon}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{p.title}</Text>
                <Text style={styles.cardDesc}>{p.desc}</Text>
              </View>
            </View>
          ))}
          <View style={styles.auditBadge}>
            <Text style={styles.auditText}>🏆 Deloitte Audit · March 2026</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: C.dark },
  safe:       { flex: 1 },
  scroll:     { padding: 16, gap: 12 },
  hero:       { alignItems: 'center', paddingVertical: 20, gap: 8 },
  heroEmoji:  { fontSize: 48 },
  heroTitle:  { fontFamily: 'Oxanium_700Bold', fontSize: 22, color: C.txtDark },
  heroSub:    { fontFamily: 'Oxanium_400Regular', fontSize: 14, color: C.txtDark2, textAlign: 'center' },
  card:       { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: C.cardDark, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.borderDark, gap: 12 },
  cardIcon:   { fontSize: 22, marginTop: 2 },
  cardInfo:   { flex: 1 },
  cardTitle:  { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: C.txtDark },
  cardDesc:   { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2, marginTop: 4, lineHeight: 18 },
  auditBadge: { backgroundColor: C.tealBg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.tealBorder, alignItems: 'center', marginTop: 4 },
  auditText:  { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: C.teal },
});
