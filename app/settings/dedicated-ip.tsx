import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

const IPS = [
  { id: '1', ip: '104.21.45.12', location: '🇺🇸 New York, US', active: true  },
  { id: '2', ip: '185.220.101.8', location: '🇬🇧 London, UK',  active: false },
];

export default function DedicatedIpScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Dedicated IP" />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.proBanner}>
            <Text style={styles.proIcon}>⭐</Text>
            <View>
              <Text style={styles.proTitle}>Pro Feature</Text>
              <Text style={styles.proSub}>Upgrade to get a static dedicated IP address</Text>
            </View>
          </View>
          {IPS.map((ip) => (
            <View key={ip.id} style={[styles.ipCard, ip.active && styles.ipCardActive]}>
              <View>
                <Text style={styles.ipAddr}>{ip.ip}</Text>
                <Text style={styles.ipLoc}>{ip.location}</Text>
              </View>
              {ip.active && <View style={styles.activeDot} />}
            </View>
          ))}
          <Pressable style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Upgrade to Pro →</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: C.light },
  safe:          { flex: 1 },
  scroll:        { padding: 16, gap: 12 },
  proBanner:     { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.amberBg, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.amber + '40', marginBottom: 4 },
  proIcon:       { fontSize: 28 },
  proTitle:      { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: C.txtLight },
  proSub:        { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight2, marginTop: 2 },
  ipCard:        { backgroundColor: C.light2, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.borderLight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ipCardActive:  { borderColor: C.teal },
  ipAddr:        { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: C.txtLight },
  ipLoc:         { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight2, marginTop: 2 },
  activeDot:     { width: 10, height: 10, borderRadius: 5, backgroundColor: C.teal },
  upgradeBtn:    { backgroundColor: C.amber, borderRadius: 14, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  upgradeBtnText:{ fontFamily: 'Oxanium_700Bold', fontSize: 15, color: '#000' },
});
