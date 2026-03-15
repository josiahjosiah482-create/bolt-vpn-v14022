import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

export default function KillSwitchScreen() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<'strict' | 'soft'>('strict');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Kill Switch" />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.mainCard}>
            <View style={styles.mainRow}>
              <View style={styles.mainInfo}>
                <Text style={styles.mainLabel}>Kill Switch</Text>
                <Text style={styles.mainSub}>Block all internet traffic if VPN disconnects</Text>
              </View>
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                trackColor={{ false: C.borderLight, true: C.teal }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {enabled && (
            <View style={styles.modeCard}>
              <Text style={styles.sectionTitle}>MODE</Text>
              {[
                { id: 'strict', label: 'Strict Mode',  desc: 'Block ALL traffic when VPN is off. Maximum protection.' },
                { id: 'soft',   label: 'Soft Mode',    desc: 'Only block traffic when VPN unexpectedly drops.' },
              ].map((m) => (
                <Pressable
                  key={m.id}
                  style={[styles.modeRow, mode === m.id && styles.modeRowActive]}
                  onPress={() => setMode(m.id as 'strict' | 'soft')}
                >
                  <View style={[styles.radio, mode === m.id && styles.radioActive]}>
                    {mode === m.id && <View style={styles.radioDot} />}
                  </View>
                  <View style={styles.modeInfo}>
                    <Text style={styles.modeLabel}>{m.label}</Text>
                    <Text style={styles.modeDesc}>{m.desc}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🛑 What is Kill Switch?</Text>
            <Text style={styles.infoText}>
              Kill Switch prevents data leaks by blocking all internet traffic if your VPN connection drops unexpectedly. Your real IP address stays hidden at all times.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.light },
  safe:      { flex: 1 },
  scroll:    { paddingHorizontal: 16, paddingBottom: 32, gap: 16 },
  mainCard:  { backgroundColor: C.light2, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.borderLight },
  mainRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mainInfo:  { flex: 1 },
  mainLabel: { fontFamily: 'Oxanium_700Bold', fontSize: 16, color: C.txtLight },
  mainSub:   { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, marginTop: 2 },
  modeCard:  { backgroundColor: C.light2, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.borderLight, gap: 12 },
  sectionTitle: { fontFamily: 'Oxanium_600SemiBold', fontSize: 10, color: C.txtLight3, letterSpacing: 1.5 },
  modeRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: C.borderLight },
  modeRowActive: { borderColor: C.teal, backgroundColor: C.tealBg2 },
  radio:     { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.grey2, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioActive: { borderColor: C.teal },
  radioDot:  { width: 10, height: 10, borderRadius: 5, backgroundColor: C.teal },
  modeInfo:  { flex: 1 },
  modeLabel: { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight },
  modeDesc:  { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight2, marginTop: 2, lineHeight: 16 },
  infoCard:  { backgroundColor: C.light2, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.borderLight, gap: 8 },
  infoTitle: { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight },
  infoText:  { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, lineHeight: 18 },
});
