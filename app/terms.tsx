import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By downloading, installing, or using Bolt VPN ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.\n\nThese Terms constitute a legally binding agreement between you and Bolt VPN, Inc.`,
  },
  {
    title: '2. Description of Service',
    body: `Bolt VPN provides a virtual private network (VPN) service that encrypts your internet traffic and routes it through our secure servers. The service is intended to:\n\n• Protect your privacy on public Wi-Fi networks\n• Encrypt your internet traffic\n• Allow access to geo-restricted content where legally permitted\n\nThe service is provided "as is" without warranties of uninterrupted availability.`,
  },
  {
    title: '3. Acceptable Use',
    body: `You agree NOT to use Bolt VPN to:\n\n• Engage in any illegal activity under applicable law\n• Distribute malware, viruses, or malicious code\n• Conduct unauthorized access to computer systems\n• Send unsolicited bulk communications (spam)\n• Violate the intellectual property rights of others\n• Engage in activities that harm minors\n\nViolation of these terms may result in immediate account termination.`,
  },
  {
    title: '4. Subscription & Billing',
    body: `Free accounts are subject to data and server limitations as described in the app. Premium subscriptions are billed in advance on a monthly or annual basis.\n\nSubscriptions automatically renew unless cancelled at least 24 hours before the renewal date. You can manage and cancel subscriptions in your device's app store account settings.\n\nRefunds are handled in accordance with Google Play or Apple App Store refund policies.`,
  },
  {
    title: '5. Privacy',
    body: `Your use of the App is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the App, you consent to the data practices described in our Privacy Policy.`,
  },
  {
    title: '6. Intellectual Property',
    body: `All content, features, and functionality of Bolt VPN, including but not limited to text, graphics, logos, and software, are the exclusive property of Bolt VPN, Inc. and are protected by copyright, trademark, and other intellectual property laws.\n\nYou may not reproduce, distribute, modify, or create derivative works without our express written permission.`,
  },
  {
    title: '7. Disclaimer of Warranties',
    body: `THE APP IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.\n\nWe do not guarantee that using Bolt VPN will make you completely anonymous online or protect against all security threats.`,
  },
  {
    title: '8. Limitation of Liability',
    body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, BOLT VPN, INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL.\n\nOur total liability to you for any claims arising from these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.`,
  },
  {
    title: '9. Termination',
    body: `We reserve the right to suspend or terminate your account at any time for violation of these Terms, without prior notice.\n\nYou may terminate your account at any time by deleting it within the app. Upon termination, your right to use the App ceases immediately.`,
  },
  {
    title: '10. Governing Law',
    body: `These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.\n\nAny disputes shall be resolved through binding arbitration in San Francisco, California.`,
  },
  {
    title: '11. Changes to Terms',
    body: `We reserve the right to modify these Terms at any time. We will provide notice of material changes through the App or via email. Your continued use of the App after such changes constitutes acceptance of the new Terms.`,
  },
  {
    title: '12. Contact',
    body: `For questions about these Terms:\n\nEmail: legal@boltvpn.app\nWebsite: https://boltvpn.app/terms\n\nBolt VPN, Inc.\n123 Privacy Lane\nSan Francisco, CA 94105`,
  },
];

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Terms of Service" />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.lastUpdated}>Last updated: March 15, 2026</Text>
          <View style={styles.heroBanner}>
            <Text style={styles.heroEmoji}>📋</Text>
            <Text style={styles.heroTitle}>Terms of Service</Text>
            <Text style={styles.heroSub}>Please read these terms carefully before using Bolt VPN.</Text>
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
    backgroundColor: C.light2,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: C.borderLight,
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
