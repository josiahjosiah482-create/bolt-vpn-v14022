import { useState, useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { C } from '@/constants/C';
import { trpc } from '@/lib/trpc';

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
  const [connectedId, setConnectedId] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const { data: servers = [], isLoading } = trpc.servers.list.useQuery();

  const filtered = useMemo(() => {
    let list = servers;
    if (activeTab === 'POPULAR') {
      list = list.filter((s) => s.category === 'popular');
    } else if (activeTab === 'EUROPE') {
      list = list.filter((s) => s.category === 'europe');
    } else if (activeTab === 'ASIA') {
      list = list.filter((s) => s.category === 'asia');
    } else if (activeTab === 'AMERICAS') {
      list = list.filter((s) => s.category === 'americas');
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.countryName.toLowerCase().includes(q) || s.city.toLowerCase().includes(q));
    }
    return list;
  }, [search, activeTab, servers]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Server Location</Text>
          <Text style={styles.subtitle}>{servers.length} servers · {new Set(servers.map((s) => s.countryCode)).size} countries</Text>
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

        {/* Loading state */}
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={C.teal} />
            <Text style={styles.loadingText}>Loading servers...</Text>
          </View>
        ) : (
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
              const pingColor   = getPingColor(item.pingMs);
              return (
                <Pressable
                  style={[styles.serverCard, isConnected && styles.serverCardActive]}
                  onPress={() => setConnectedId(isConnected ? null : item.id)}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <View style={styles.serverInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.countryName}>{item.countryName}</Text>
                      {item.isPremium && (
                        <View style={styles.proBadge}>
                          <Text style={styles.proText}>PRO</Text>
                        </View>
                      )}
                      {item.isP2P && (
                        <View style={[styles.proBadge, { backgroundColor: C.violetBg ?? '#EDE9FE' }]}>
                          <Text style={[styles.proText, { color: C.violet }]}>P2P</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cityName}>{item.city}</Text>
                  </View>
                  <View style={[styles.pingBadge, { backgroundColor: pingColor + '18' }]}>
                    <Text style={[styles.pingText, { color: pingColor }]}>{item.pingMs}ms</Text>
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
        )}
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
  tabBtnActive:  { backgroundColor: C.tealBg, borderColor: C.tealBorder },
  tabText:       { fontFamily: 'Oxanium_600SemiBold', fontSize: 12, color: C.txtLight2 },
  tabTextActive: { color: C.teal },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontFamily: 'Oxanium_400Regular', fontSize: 14, color: C.txtLight2 },

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
  nameRow:    { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
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
