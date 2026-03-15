import { useState, useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { C } from '@/constants/C';

const ALL_SERVERS = [
  { id: 1,  flag: '🇺🇸', country: 'United States',  city: 'New York',     ping: 12,  premium: false, region: 'AMERICAS' },
  { id: 2,  flag: '🇺🇸', country: 'United States',  city: 'Los Angeles',  ping: 18,  premium: false, region: 'AMERICAS' },
  { id: 3,  flag: '🇬🇧', country: 'United Kingdom', city: 'London',       ping: 32,  premium: false, region: 'EUROPE'   },
  { id: 4,  flag: '🇩🇪', country: 'Germany',        city: 'Frankfurt',    ping: 45,  premium: false, region: 'EUROPE'   },
  { id: 5,  flag: '🇫🇷', country: 'France',         city: 'Paris',        ping: 48,  premium: false, region: 'EUROPE'   },
  { id: 6,  flag: '🇳🇱', country: 'Netherlands',    city: 'Amsterdam',    ping: 38,  premium: false, region: 'EUROPE'   },
  { id: 7,  flag: '🇸🇪', country: 'Sweden',         city: 'Stockholm',    ping: 55,  premium: false, region: 'EUROPE'   },
  { id: 8,  flag: '🇨🇭', country: 'Switzerland',    city: 'Zurich',       ping: 48,  premium: true,  region: 'EUROPE'   },
  { id: 9,  flag: '🇯🇵', country: 'Japan',          city: 'Tokyo',        ping: 88,  premium: true,  region: 'ASIA'     },
  { id: 10, flag: '🇸🇬', country: 'Singapore',      city: 'Singapore',    ping: 72,  premium: true,  region: 'ASIA'     },
  { id: 11, flag: '🇦🇺', country: 'Australia',      city: 'Sydney',       ping: 110, premium: true,  region: 'ASIA'     },
  { id: 12, flag: '🇰🇷', country: 'South Korea',    city: 'Seoul',        ping: 95,  premium: true,  region: 'ASIA'     },
  { id: 13, flag: '🇮🇳', country: 'India',          city: 'Mumbai',       ping: 130, premium: true,  region: 'ASIA'     },
  { id: 14, flag: '🇨🇦', country: 'Canada',         city: 'Toronto',      ping: 22,  premium: false, region: 'AMERICAS' },
  { id: 15, flag: '🇧🇷', country: 'Brazil',         city: 'São Paulo',    ping: 95,  premium: true,  region: 'AMERICAS' },
  { id: 16, flag: '🇲🇽', country: 'Mexico',         city: 'Mexico City',  ping: 65,  premium: false, region: 'AMERICAS' },
];

const POPULAR_IDS = [1, 3, 6, 9, 10, 14];
const TABS = ['ALL', 'POPULAR', 'EUROPE', 'ASIA', 'AMERICAS'] as const;
type Tab = typeof TABS[number];

function getPingColor(ping: number) {
  if (ping < 50)  return C.teal;
  if (ping < 100) return C.amber;
  return C.red;
}

export default function ServersScreen() {
  const [search, setSearch]           = useState('');
  const [activeTab, setActiveTab]     = useState<Tab>('ALL');
  const [connectedId, setConnectedId] = useState<number | null>(1);
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = useMemo(() => {
    let list = ALL_SERVERS;
    if (activeTab === 'POPULAR')  list = list.filter((s) => POPULAR_IDS.includes(s.id));
    else if (activeTab !== 'ALL') list = list.filter((s) => s.region === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.country.toLowerCase().includes(q) || s.city.toLowerCase().includes(q));
    }
    return list;
  }, [search, activeTab]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Server Location</Text>
          <Text style={styles.subtitle}>{ALL_SERVERS.length} servers · 12 countries</Text>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, searchFocused && styles.searchFocused]}>
          <MaterialIcons name="search" size={18} color={searchFocused ? C.teal : C.txtLight2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search country or city..."
            placeholderTextColor={C.txtLight3}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={16} color={C.txtLight2} />
            </Pressable>
          )}
        </View>

        {/* Segmented filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Server list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialIcons name="search-off" size={40} color={C.txtLight3} />
              <Text style={styles.emptyText}>No servers found</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isConnected = connectedId === item.id;
            const pingColor   = getPingColor(item.ping);
            return (
              <Pressable
                style={[styles.serverCard, isConnected && styles.serverCardActive]}
                onPress={() => setConnectedId(isConnected ? null : item.id)}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <View style={styles.serverInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.countryName}>{item.country}</Text>
                    {item.premium && (
                      <View style={styles.proBadge}>
                        <Text style={styles.proText}>PRO</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cityName}>{item.city}</Text>
                </View>
                <View style={[styles.pingBadge, { backgroundColor: pingColor + '18' }]}>
                  <Text style={[styles.pingText, { color: pingColor }]}>{item.ping}ms</Text>
                </View>
                {isConnected ? (
                  <MaterialIcons name="check-circle" size={22} color={C.teal} />
                ) : (
                  <MaterialIcons name="chevron-right" size={20} color={C.txtLight3} />
                )}
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.light },
  safe:      { flex: 1 },

  header:   { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title:    { fontFamily: 'Oxanium_700Bold', fontSize: 22, color: C.txtLight },
  subtitle: { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, marginTop: 2 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: C.light2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.borderLight,
    paddingHorizontal: 14,
    height: 46,
  },
  searchFocused: { borderColor: C.teal },
  searchInput: {
    flex: 1,
    fontFamily: 'Oxanium_400Regular',
    fontSize: 14,
    color: C.txtLight,
  },

  tabsRow: { paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.light2,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  tabBtnActive: { backgroundColor: C.tealBg, borderColor: C.tealBorder },
  tabText:      { fontFamily: 'Oxanium_600SemiBold', fontSize: 12, color: C.txtLight2 },
  tabTextActive: { color: C.teal },

  list: { paddingHorizontal: 20, paddingBottom: 24, gap: 8 },

  serverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.light2,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.borderLight,
    gap: 12,
  },
  serverCardActive: { borderColor: C.teal, backgroundColor: C.tealBg2 },
  flag:       { fontSize: 28 },
  serverInfo: { flex: 1 },
  nameRow:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  countryName: { fontFamily: 'Oxanium_600SemiBold', fontSize: 15, color: C.txtLight },
  cityName:   { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight2, marginTop: 2 },
  proBadge: {
    backgroundColor: C.amberBg,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  proText: { fontFamily: 'Oxanium_700Bold', fontSize: 9, color: C.amber, letterSpacing: 0.5 },
  pingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pingText: { fontFamily: 'Oxanium_700Bold', fontSize: 12 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontFamily: 'Oxanium_400Regular', fontSize: 14, color: C.txtLight3 },
});
