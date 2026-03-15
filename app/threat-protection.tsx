import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';
import { trpc } from '@/lib/trpc';

export default function ThreatProtectionScreen() {
  const { data: settings, isLoading } = trpc.settings.get.useQuery();
  const updateSettings = trpc.settings.update.useMutation();

  const threatProtEnabled = settings?.threatProtEnabled ?? true;
  const adBlockEnabled    = settings?.adBlockEnabled    ?? false;

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

          {isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={C.teal} />
            </View>
          ) : (
            <>
              {[
                {
                  label: 'Malware & Phishing Protection',
                  sub: 'Block malicious domains, files, and fraudulent websites',
                  value: threatProtEnabled,
                  onChange: (val: boolean) => updateSettings.mutate({ threatProtEnabled: val }),
                },
                {
                  label: 'Ad & Tracker Blocking',
                  sub: 'Remove ads and stop data collection trackers across all apps',
                  value: adBlockEnabled,
                  onChange: (val: boolean) => updateSettings.mutate({ adBlockEnabled: val }),
                },
              ].map((f) => (
                <View key={f.label} style={styles.row}>
                  <View style={styles.info}>
                    <Text style={styles.label}>{f.label}</Text>
                    <Text style={styles.sub}>{f.sub}</Text>
                  </View>
                  <Switch
                    value={f.value}
                    onValueChange={f.onChange}
                    trackColor={{ false: C.borderDark, true: C.teal }}
                    thumbColor="#fff"
                    disabled={updateSettings.isPending}
                  />
                </View>
              ))}
            </>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>ℹ️ How it works</Text>
            <Text style={styles.infoText}>
              Threat Protection filters DNS requests to block known malicious domains before they reach your device. No traffic is logged or stored.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: C.dark },
  safe:        { flex: 1 },
  scroll:      { padding: 16, gap: 10 },
  hero:        { alignItems: 'center', paddingVertical: 24, gap: 8 },
  heroEmoji:   { fontSize: 48 },
  heroTitle:   { fontFamily: 'Oxanium_700Bold', fontSize: 22, color: C.txtDark },
  heroSub:     { fontFamily: 'Oxanium_400Regular', fontSize: 14, color: C.txtDark2, textAlign: 'center' },
  loadingWrap: { alignItems: 'center', paddingTop: 40 },
  row:         { flexDirection: 'row', alignItems: 'center', backgroundColor: C.cardDark, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.borderDark, gap: 12 },
  info:        { flex: 1 },
  label:       { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark },
  sub:         { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2, marginTop: 2, lineHeight: 16 },
  infoCard:    { backgroundColor: C.cardDark, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.borderDark, gap: 8, marginTop: 4 },
  infoTitle:   { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark },
  infoText:    { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2, lineHeight: 18 },
});
