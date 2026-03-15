import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `Bolt VPN is designed with a strict no-log policy. We do not collect, store, or share:\n\n• Your VPN browsing activity or traffic data\n• DNS queries made while connected\n• Your real IP address while using the VPN\n• Timestamps of your VPN connections\n• Bandwidth usage per session\n\nWe collect only the minimum information required to operate the service:\n\n• Account email address (for authentication)\n• App crash reports (anonymized, opt-in)\n• Aggregate performance metrics (no personal data)`,
  },
  {
    title: '2. How We Use Your Information',
    body: `The limited information we collect is used solely to:\n\n• Authenticate your account and maintain your session\n• Provide customer support when you contact us\n• Send service-related communications (security alerts, policy updates)\n• Improve app stability through anonymized crash reports\n\nWe do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: '3. Data Storage & Security',
    body: `Your account credentials are stored using industry-standard bcrypt hashing. Session tokens are signed with HMAC-SHA256 and expire automatically.\n\nAll data transmission between the app and our servers uses TLS 1.3 encryption. We follow the principle of data minimization — we only store what is strictly necessary.`,
  },
  {
    title: '4. Third-Party Services',
    body: `Bolt VPN does not integrate third-party advertising SDKs, analytics platforms, or tracking libraries.\n\nThe app uses the following trusted infrastructure providers:\n\n• Cloud hosting for our VPN server network\n• Payment processors for subscription billing (no card data stored by us)\n\nAll third-party providers are contractually bound to our privacy standards.`,
  },
  {
    title: '5. Your Rights',
    body: `You have the right to:\n\n• Access the personal data we hold about you\n• Request correction of inaccurate data\n• Request deletion of your account and all associated data\n• Export your data in a portable format\n• Withdraw consent at any time\n\nTo exercise any of these rights, contact us at privacy@boltvpn.app or use the "Delete Account" option in the app.`,
  },
  {
    title: '6. Account Deletion',
    body: `You can permanently delete your account at any time from Settings → Account → Delete Account. Upon deletion:\n\n• Your account credentials are permanently removed\n• All stored preferences and settings are deleted\n• Connection history is purged within 30 days\n• This action is irreversible\n\nWe retain anonymized aggregate statistics that cannot be linked to any individual.`,
  },
  {
    title: '7. Children\'s Privacy',
    body: `Bolt VPN is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.`,
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes via in-app notification or email. Continued use of the app after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '9. Contact Us',
    body: `For privacy-related questions or requests:\n\nEmail: privacy@boltvpn.app\nWebsite: https://boltvpn.app/privacy\n\nBolt VPN, Inc.\n123 Privacy Lane\nSan Francisco, CA 94105\nUnited States`,
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Privacy Policy" />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.lastUpdated}>Last updated: March 15, 2026</Text>
          <View style={styles.heroBanner}>
            <Text style={styles.heroEmoji}>🔒</Text>
            <Text style={styles.heroTitle}>Your Privacy is Our Priority</Text>
            <Text style={styles.heroSub}>Bolt VPN operates under a strict no-log policy. We never monitor, record, or share your online activity.</Text>
          </View>
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.light },
  safe:         { flex: 1 },
  scroll:       { padding: 16, paddingBottom: 40, gap: 16 },
  lastUpdated:  { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight3, textAlign: 'center' },
  heroBanner: {
    backgroundColor: C.tealBg2,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: C.tealBorder,
  },
  heroEmoji:    { fontSize: 40 },
  heroTitle:    { fontFamily: 'Oxanium_700Bold', fontSize: 18, color: C.txtLight, textAlign: 'center' },
  heroSub:      { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, textAlign: 'center', lineHeight: 18 },
  section: {
    backgroundColor: C.light2,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    gap: 8,
  },
  sectionTitle: { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: C.txtLight },
  sectionBody:  { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, lineHeight: 20 },
});
