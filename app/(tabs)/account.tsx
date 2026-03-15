import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { trpc } from '@/lib/trpc';
import { C } from '@/constants/C';

const PLAN_FEATURES = {
  free: ['5 server locations', '10 GB/month', 'Standard speed', 'Basic encryption'],
  pro:  ['60+ server locations', 'Unlimited data', 'High speed', 'AES-256 encryption', 'Kill switch', 'P2P support'],
  max:  ['60+ server locations', 'Unlimited data', 'Blazing speed', 'AES-256 encryption', 'Kill switch', 'P2P support', 'Dedicated IP', 'Multi-device (10)', 'Priority support'],
};

const PLAN_COLORS: Record<string, string> = {
  free: C.txtLight2,
  pro:  C.teal,
  max:  C.amber,
};

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  pro:  'Pro',
  max:  'Max',
};

export default function AccountScreen() {
  const router = useRouter();
  const { data: userData } = trpc.auth.me.useQuery(undefined, { retry: false });
  const { data: history = [] } = trpc.connections.history.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => router.replace('/(auth)/login' as any),
  });

  const user = userData as any;
  const tier: 'free' | 'pro' | 'max' = user?.subscriptionTier ?? 'free';
  const planColor = PLAN_COLORS[tier] ?? C.txtLight2;
  const planLabel = PLAN_LABELS[tier] ?? 'Free';
  const features = PLAN_FEATURES[tier] ?? PLAN_FEATURES.free;

  const initial = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'B';
  const displayName = user?.name ?? 'Guest User';
  const displayEmail = user?.email ?? 'guest@boltvpn.com';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Avatar + name */}
          <View style={styles.profileCard}>
            <View style={[styles.avatar, { backgroundColor: user?.avatarColor ?? C.teal }]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{displayEmail}</Text>
            </View>
            <View style={[styles.tierBadge, { backgroundColor: planColor + '20', borderColor: planColor + '40' }]}>
              <Text style={[styles.tierText, { color: planColor }]}>{planLabel.toUpperCase()}</Text>
            </View>
          </View>

          {/* Subscription Card */}
          <View style={styles.subCard}>
            <View style={styles.subHeader}>
              <Text style={styles.subTitle}>Current Plan</Text>
              <Text style={[styles.subPlan, { color: planColor }]}>{planLabel}</Text>
            </View>
            <View style={styles.featureList}>
              {features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <MaterialIcons name="check-circle" size={16} color={planColor} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            {tier === 'free' && (
              <Pressable style={styles.upgradeBtn}>
                <Text style={styles.upgradeBtnText}>Upgrade to Pro →</Text>
              </Pressable>
            )}
          </View>

          {/* Stats row — real data from connection history */}
          <View style={styles.statsRow}>
            {[
              {
                label: 'Data Used',
                value: (() => {
                  const mb = (history as any[]).reduce((s: number, h: any) => s + (h.dataDownMB ?? 0) + (h.dataUpMB ?? 0), 0);
                  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`;
                })(),
                icon: '📊',
              },
              { label: 'Sessions',    value: String((history as any[]).length),  icon: '🔗' },
              {
                label: 'Days Active',
                value: String(new Set((history as any[]).map((h: any) => new Date(h.connectedAt).toDateString())).size),
                icon: '📅',
              },
            ].map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionsCard}>
            {[
              { icon: '🎁', label: 'Refer a Friend',     sub: 'Get 30 days free',           route: '/refer'           },
              { icon: '📋', label: 'No-Log Policy',      sub: 'Our privacy commitment',      route: '/no-log-policy'   },
              { icon: '🛡️', label: 'Threat Protection',  sub: 'Malware & ad blocking',      route: '/threat-protection' },
              { icon: '🔒', label: 'Privacy Policy',    sub: 'How we protect your data',   route: '/privacy-policy'  },
              { icon: '📄', label: 'Terms of Service',  sub: 'Usage terms and conditions', route: '/terms'           },
              { icon: '❓', label: 'Help & Support',     sub: 'FAQ and contact',            route: '/settings/help'   },
            ].map((item, idx, arr) => (
              <View key={item.label}>
                <Pressable
                  style={({ pressed }) => [styles.actionRow, pressed && { opacity: 0.7 }]}
                  onPress={() => router.push(item.route as any)}
                >
                  <Text style={styles.actionIcon}>{item.icon}</Text>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionLabel}>{item.label}</Text>
                    <Text style={styles.actionSub}>{item.sub}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={18} color={C.txtLight3} />
                </Pressable>
                {idx < arr.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          {/* Sign out */}
          <Pressable
            style={styles.signOutBtn}
            onPress={() => logoutMutation.mutate()}
          >
            <MaterialIcons name="logout" size={18} color={C.red} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>

          {/* Delete account */}
          <Pressable
            style={styles.deleteAccountBtn}
            onPress={() => router.push('/delete-account' as any)}
          >
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </Pressable>

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
  scroll:    { paddingHorizontal: 16, paddingBottom: 40, gap: 16 },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.light2,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText:   { fontFamily: 'Oxanium_700Bold', fontSize: 22, color: '#000' },
  profileInfo:  { flex: 1 },
  profileName:  { fontFamily: 'Oxanium_700Bold', fontSize: 16, color: C.txtLight },
  profileEmail: { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, marginTop: 2 },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  tierText: { fontFamily: 'Oxanium_700Bold', fontSize: 11, letterSpacing: 0.5 },

  subCard: {
    backgroundColor: C.light2,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    gap: 12,
  },
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subTitle:  { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight },
  subPlan:   { fontFamily: 'Oxanium_700Bold', fontSize: 15 },
  featureList: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight },
  upgradeBtn: {
    backgroundColor: C.teal,
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  upgradeBtnText: { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: '#000' },

  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: C.light2,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderLight,
    gap: 4,
  },
  statIcon:  { fontSize: 20 },
  statValue: { fontFamily: 'Oxanium_700Bold', fontSize: 18, color: C.txtLight },
  statLabel: { fontFamily: 'Oxanium_400Regular', fontSize: 11, color: C.txtLight2, textAlign: 'center' },

  actionsCard: {
    backgroundColor: C.light2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  actionIcon:    { fontSize: 20 },
  actionContent: { flex: 1 },
  actionLabel:   { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight },
  actionSub:     { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight2, marginTop: 1 },
  divider:       { height: 1, backgroundColor: C.borderLight, marginLeft: 52 },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.redBg,
    borderRadius: 14,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  signOutText: { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: C.red },

  deleteAccountBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAccountText: {
    fontFamily: 'Oxanium_400Regular',
    fontSize: 13,
    color: C.txtLight3,
    textDecorationLine: 'underline',
  },
});
