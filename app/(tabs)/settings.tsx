import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/C';

type SettingRow = {
  id: string;
  icon: string;
  label: string;
  sub?: string;
  route?: string;
  toggle?: boolean;
  toggleKey?: string;
  badge?: string;
  badgeColor?: string;
  danger?: boolean;
};

type Section = {
  title: string;
  data: SettingRow[];
};

export default function SettingsScreen() {
  const router = useRouter();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    killSwitch:   false,
    autoConnect:  true,
    notifications: true,
    darkMode:     true,
  });

  const flip = (key: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const SECTIONS: Section[] = [
    {
      title: 'VPN',
      data: [
        { id: 'protocol',    icon: '🔒', label: 'Protocol',       sub: 'WireGuard',  route: '/settings/protocol'    },
        { id: 'killSwitch',  icon: '🛑', label: 'Kill Switch',    sub: 'Block traffic if VPN drops', toggle: true, toggleKey: 'killSwitch' },
        { id: 'autoConnect', icon: '⚡', label: 'Auto-Connect',   sub: 'Connect on launch',          toggle: true, toggleKey: 'autoConnect' },
        { id: 'splitTunnel', icon: '🔀', label: 'Split Tunneling', sub: 'Choose which apps use VPN', route: '/settings/split-tunnel' },
        { id: 'dedicatedIp', icon: '🌐', label: 'Dedicated IP',   sub: 'Static IP address',          route: '/settings/dedicated-ip', badge: 'PRO', badgeColor: C.amber },
      ],
    },
    {
      title: 'MONITORING',
      data: [
        { id: 'wifi',      icon: '📡', label: 'WiFi Security Scanner',  sub: 'Scan for threats on your network',  route: '/wifi-scanner'    },
        { id: 'appmon',    icon: '📊', label: 'App Data Monitor',       sub: 'Track which apps use most data',    route: '/app-monitor'     },
        { id: 'streaming', icon: '🎬', label: 'Streaming Unlocker',     sub: 'Access geo-blocked content',        route: '/streaming'       },
        { id: 'bandwidth', icon: '🔄', label: 'Bandwidth Sharing',      sub: 'Earn rewards by sharing bandwidth', route: '/bandwidth-share', badge: 'NEW', badgeColor: C.teal },
        { id: 'privacy',   icon: '🔍', label: 'Privacy Audit',          sub: 'Zero-log compliance report',        route: '/privacy-audit'   },
        { id: 'devices',   icon: '📱', label: 'Multi-Device Manager',   sub: 'Manage all connected devices',      route: '/devices',         badge: 'NEW', badgeColor: C.teal },
      ],
    },
    {
      title: 'ACCOUNT',
      data: [
        { id: 'notifications', icon: '🔔', label: 'Notifications', sub: 'Alerts and updates', toggle: true, toggleKey: 'notifications' },
        { id: 'stats',         icon: '📈', label: 'Usage Stats',   sub: 'Data and connection history', route: '/settings/stats' },
        { id: 'refer',         icon: '🎁', label: 'Refer a Friend', sub: 'Get 30 days free',           route: '/refer', badge: 'FREE', badgeColor: C.violet },
      ],
    },
    {
      title: 'SUPPORT',
      data: [
        { id: 'nolog',    icon: '📋', label: 'No-Log Policy',   sub: 'Our verified privacy commitment', route: '/no-log-policy'   },
        { id: 'p2p',      icon: '🔗', label: 'P2P / Torrents',  sub: 'Optimized P2P servers',           route: '/p2p'             },
        { id: 'privacy',  icon: '🔒', label: 'Privacy Policy',  sub: 'How we protect your data',        route: '/privacy-policy'  },
        { id: 'terms',    icon: '📄', label: 'Terms of Service', sub: 'Usage terms and conditions',     route: '/terms'           },
        { id: 'help',     icon: '❓', label: 'Help & Support',  sub: 'FAQ and contact',                  route: '/settings/help'   },
        { id: 'delete',   icon: '🗑️', label: 'Delete Account',  sub: 'Permanently remove your account', route: '/delete-account', danger: true },
        { id: 'logout',   icon: '🚪', label: 'Sign Out',        danger: true },
      ],
    },
  ];

  const renderRow = ({ item }: { item: SettingRow }) => {
    const handlePress = () => {
      if (item.danger && item.route) {
        // Danger rows with a route navigate (e.g. delete-account)
        router.push(item.route as Href);
        return;
      }
      if (item.danger) {
        // Danger rows without a route = sign out
        router.replace('/(auth)/login' as any);
        return;
      }
      if (item.route) router.push(item.route as Href);
    };

    return (
      <Pressable
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
        onPress={item.toggle ? undefined : handlePress}
      >
        <View style={styles.rowIcon}>
          <Text style={styles.rowEmoji}>{item.icon}</Text>
        </View>
        <View style={styles.rowContent}>
          <Text style={[styles.rowLabel, item.danger && { color: C.red }]}>{item.label}</Text>
          {item.sub && <Text style={styles.rowSub}>{item.sub}</Text>}
        </View>
        {item.badge && (
          <View style={[styles.badge, { backgroundColor: item.badgeColor + '20', borderColor: item.badgeColor + '40' }]}>
            <Text style={[styles.badgeText, { color: item.badgeColor }]}>{item.badge}</Text>
          </View>
        )}
        {item.toggle && item.toggleKey ? (
          <Switch
            value={toggles[item.toggleKey] ?? false}
            onValueChange={() => flip(item.toggleKey!)}
            trackColor={{ false: C.borderLight, true: C.teal }}
            thumbColor="#fff"
          />
        ) : !item.danger ? (
          <MaterialIcons name="chevron-right" size={18} color={C.txtLight3} />
        ) : null}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionCard}>
                {section.data.map((item, idx) => (
                  <View key={item.id}>
                    {renderRow({ item })}
                    {idx < section.data.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            </View>
          ))}
          <Text style={styles.version}>Bolt VPN v14.0 · Build 2026.03</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.light },
  safe:      { flex: 1 },
  header:    { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title:     { fontFamily: 'Oxanium_700Bold', fontSize: 22, color: C.txtLight },
  scroll:    { paddingHorizontal: 16, paddingBottom: 32 },

  section:      { marginBottom: 20 },
  sectionTitle: {
    fontFamily: 'Oxanium_600SemiBold',
    fontSize: 10,
    color: C.txtLight3,
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: C.light2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowEmoji:   { fontSize: 18 },
  rowContent: { flex: 1 },
  rowLabel:   { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight },
  rowSub:     { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight2, marginTop: 1 },
  divider:    { height: 1, backgroundColor: C.borderLight, marginLeft: 64 },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: { fontFamily: 'Oxanium_700Bold', fontSize: 9, letterSpacing: 0.5 },

  version: {
    fontFamily: 'Oxanium_400Regular',
    fontSize: 12,
    color: C.txtLight3,
    textAlign: 'center',
    marginTop: 8,
  },
});
