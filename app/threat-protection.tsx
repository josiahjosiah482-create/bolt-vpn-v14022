import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

const FEATURES = [
  { id: 'malware',  label: 'Malware Protection',  sub: 'Block malicious domains and files',  enabled: true  },
  { id: 'ads',      label: 'Ad Blocking',          sub: 'Remove ads across all apps',         enabled: true  },
  { id: 'trackers', label: 'Tracker Blocking',     sub: 'Stop data collection trackers',      enabled: true  },
  { id: 'phishing', label: 'Phishing Protection',  sub: 'Block fraudulent websites',          enabled: false },
];

export default function ThreatProtectionScreen() {
  const [features, setFeatures] = useState(FEATURES);
  const toggle = (id: string) => setFeatures((prev) => prev.map((f) => f.id === id ? { ...f, enabled: !f.enabled } : f));

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Threat Protection" dark />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>🛡️</Text>
            <Text style={styles.heroTitle}>Threat Protection</Text>
            <Text style={styles.heroSub}>Advanced security against malware, ads, and trackers</Text>
          </View>
          {features.map((f) => (
            <View key={f.id} style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.label}>{f.label}</Text>
                <Text style={styles.sub}>{f.sub}</Text>
              </View>
              <Switch value={f.enabled} onValueChange={() => toggle(f.id)} trackColor={{ false: C.borderDark, true: C.teal }} thumbColor="#fff" />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.dark },
  safe:      { flex: 1 },
  scroll:    { padding: 16, gap: 10 },
  hero:      { alignItems: 'center', paddingVertical: 24, gap: 8 },
  heroEmoji: { fontSize: 48 },
  heroTitle: { fontFamily: 'Oxanium_700Bold', fontSize: 22, color: C.txtDark },
  heroSub:   { fontFamily: 'Oxanium_400Regular', fontSize: 14, color: C.txtDark2, textAlign: 'center' },
  row:       { flexDirection: 'row', alignItems: 'center', backgroundColor: C.cardDark, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.borderDark, gap: 12 },
  info:      { flex: 1 },
  label:     { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark },
  sub:       { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2, marginTop: 2 },
});
