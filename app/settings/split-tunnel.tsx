import { useState } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';
import { trpc } from '@/lib/trpc';

type AppEntry = { id: string; name: string; icon: string; excluded: boolean };

const APPS: AppEntry[] = [
  { id: '1', name: 'Banking App',  icon: '🏦', excluded: true  },
  { id: '2', name: 'Netflix',      icon: '🎥', excluded: false },
  { id: '3', name: 'Spotify',      icon: '🎵', excluded: false },
  { id: '4', name: 'WhatsApp',     icon: '💬', excluded: true  },
  { id: '5', name: 'Chrome',       icon: '🌐', excluded: false },
  { id: '6', name: 'Gmail',        icon: '📧', excluded: true  },
];

export default function SplitTunnelScreen() {
  const [apps, setApps] = useState<AppEntry[]>(APPS);

  const { data: settings, isLoading } = trpc.settings.get.useQuery();
  const updateSettings = trpc.settings.update.useMutation();

  const enabled = settings?.splitTunnelEnabled ?? false;

  const handleMainToggle = (val: boolean) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateSettings.mutate({ splitTunnelEnabled: val });
  };

  const toggle = (id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, excluded: !a.excluded } : a));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Split Tunneling" />
        <View style={styles.enableRow}>
          <View>
            <Text style={styles.enableTitle}>Split Tunneling</Text>
            <Text style={styles.enableSub}>Choose which apps bypass the VPN</Text>
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color={C.teal} />
          ) : (
            <Switch
              value={enabled}
              onValueChange={handleMainToggle}
              trackColor={{ false: C.grey2, true: C.teal }}
              thumbColor="#fff"
              disabled={updateSettings.isPending}
            />
          )}
        </View>
        <FlatList
          data={apps}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.row, !enabled && styles.rowDisabled]}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Switch
                value={item.excluded}
                onValueChange={() => toggle(item.id)}
                trackColor={{ false: C.grey2, true: C.teal }}
                thumbColor="#fff"
                disabled={!enabled}
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: C.light },
  safe:        { flex: 1 },
  enableRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.light2, margin: 16, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.borderLight },
  enableTitle: { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: C.txtLight },
  enableSub:   { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight2, marginTop: 2 },
  list:        { paddingHorizontal: 16, paddingBottom: 32 },
  row:         { flexDirection: 'row', alignItems: 'center', backgroundColor: C.light2, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.borderLight, gap: 12 },
  rowDisabled: { opacity: 0.5 },
  icon:        { fontSize: 22 },
  name:        { flex: 1, fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight },
  sep:         { height: 8 },
});
