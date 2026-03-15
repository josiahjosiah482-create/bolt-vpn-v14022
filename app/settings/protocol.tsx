import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

const PROTOCOLS = [
  { id: 'wireguard', name: 'WireGuard',  badge: 'FASTEST',  desc: 'Modern, ultra-fast protocol. Best for most users.', speed: 5, security: 4 },
  { id: 'openvpn',  name: 'OpenVPN',    badge: 'STABLE',   desc: 'Battle-tested protocol. Best compatibility.',         speed: 3, security: 5 },
  { id: 'ikev2',    name: 'IKEv2',      badge: 'MOBILE',   desc: 'Excellent for mobile networks. Fast reconnection.',   speed: 4, security: 4 },
  { id: 'auto',     name: 'Auto',       badge: 'SMART',    desc: 'Automatically selects the best protocol.',            speed: 5, security: 5 },
];

function Dots({ count, filled }: { count: number; filled: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i < filled && styles.dotFilled]} />
      ))}
    </View>
  );
}

export default function ProtocolScreen() {
  const [selected, setSelected] = useState('wireguard');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Protocol" />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.desc}>
            Choose how your traffic is encrypted and tunneled. WireGuard is recommended for most users.
          </Text>
          {PROTOCOLS.map((p) => {
            const isActive = selected === p.id;
            return (
              <Pressable
                key={p.id}
                style={[styles.card, isActive && styles.cardActive]}
                onPress={() => setSelected(p.id)}
              >
                <View style={styles.cardTop}>
                  <View style={styles.nameRow}>
                    <Text style={styles.protoName}>{p.name}</Text>
                    <View style={[styles.badge, isActive && styles.badgeActive]}>
                      <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>{p.badge}</Text>
                    </View>
                  </View>
                  {isActive && <MaterialIcons name="check-circle" size={22} color={C.teal} />}
                </View>
                <Text style={styles.protoDesc}>{p.desc}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Speed</Text>
                    <Dots count={5} filled={p.speed} />
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Security</Text>
                    <Dots count={5} filled={p.security} />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.light },
  safe:      { flex: 1 },
  scroll:    { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  desc:      { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, lineHeight: 18, marginBottom: 4 },

  card: {
    backgroundColor: C.light2,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    gap: 8,
  },
  cardActive:  { borderColor: C.teal, backgroundColor: C.tealBg2 },
  cardTop:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nameRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  protoName:   { fontFamily: 'Oxanium_700Bold', fontSize: 16, color: C.txtLight },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: C.grey,
  },
  badgeActive:     { backgroundColor: C.tealBg, borderWidth: 1, borderColor: C.tealBorder },
  badgeText:       { fontFamily: 'Oxanium_700Bold', fontSize: 9, color: C.txtLight2, letterSpacing: 0.5 },
  badgeTextActive: { color: C.teal },
  protoDesc:       { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, lineHeight: 18 },
  statsRow:        { flexDirection: 'row', gap: 20, marginTop: 4 },
  stat:            { gap: 4 },
  statLabel:       { fontFamily: 'Oxanium_400Regular', fontSize: 11, color: C.txtLight3 },
  dot:             { width: 10, height: 10, borderRadius: 5, backgroundColor: C.grey },
  dotFilled:       { backgroundColor: C.teal },
});
