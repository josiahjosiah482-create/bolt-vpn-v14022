import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

const P2P_SERVERS = [
  { id: '1', flag: '🇳🇱', country: 'Netherlands', city: 'Amsterdam',  ping: 28, load: 42 },
  { id: '2', flag: '🇸🇪', country: 'Sweden',       city: 'Stockholm',  ping: 35, load: 31 },
  { id: '3', flag: '🇨🇭', country: 'Switzerland',  city: 'Zurich',     ping: 40, load: 55 },
  { id: '4', flag: '🇷🇴', country: 'Romania',      city: 'Bucharest',  ping: 52, load: 28 },
  { id: '5', flag: '🇸🇬', country: 'Singapore',    city: 'Singapore',  ping: 88, load: 67 },
];

export default function P2PScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="P2P / Torrents" dark />
        <FlatList
          data={P2P_SERVERS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.hero}>
              <Text style={styles.heroEmoji}>🔗</Text>
              <Text style={styles.heroTitle}>P2P Optimized Servers</Text>
              <Text style={styles.heroSub}>High-speed servers optimized for torrenting and P2P file sharing</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.flag}>{item.flag}</Text>
              <View style={styles.info}>
                <Text style={styles.country}>{item.country} — {item.city}</Text>
                <Text style={styles.load}>Load: {item.load}%</Text>
              </View>
              <Text style={[styles.ping, { color: item.ping < 50 ? C.teal : C.amber }]}>{item.ping}ms</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.dark },
  safe:      { flex: 1 },
  list:      { padding: 16, gap: 0 },
  hero:      { alignItems: 'center', paddingVertical: 20, gap: 8, marginBottom: 12 },
  heroEmoji: { fontSize: 48 },
  heroTitle: { fontFamily: 'Oxanium_700Bold', fontSize: 20, color: C.txtDark },
  heroSub:   { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2, textAlign: 'center', lineHeight: 18 },
  row:       { flexDirection: 'row', alignItems: 'center', backgroundColor: C.cardDark, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.borderDark, gap: 12 },
  flag:      { fontSize: 28 },
  info:      { flex: 1 },
  country:   { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark },
  load:      { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2, marginTop: 2 },
  ping:      { fontFamily: 'Oxanium_700Bold', fontSize: 14 },
});
