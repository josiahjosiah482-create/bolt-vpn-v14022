import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';
import { useState } from 'react';

const FAQS = [
  { q: 'How does Bolt VPN protect my data?', a: 'Bolt VPN encrypts all your internet traffic using AES-256-GCM encryption and routes it through our secure servers, making it impossible for third parties to intercept.' },
  { q: 'Does Bolt VPN keep logs?', a: 'No. Bolt VPN has a strict no-log policy verified by independent auditors. We never store connection logs, IP addresses, or browsing history.' },
  { q: 'How many devices can I connect?', a: 'You can connect up to 6 devices simultaneously on a single Bolt VPN account.' },
  { q: 'Which protocol should I use?', a: 'WireGuard is recommended for the best balance of speed and security. OpenVPN is more compatible. IKEv2 is best for mobile devices.' },
  { q: 'Why is my speed slower with VPN?', a: 'Some speed reduction is normal due to encryption overhead. Try connecting to a server closer to your location for better speeds.' },
];

export default function HelpScreen() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Help & Support" />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
          {FAQS.map((faq, i) => (
            <Pressable key={i} style={styles.faqCard} onPress={() => setExpanded(expanded === i ? null : i)}>
              <View style={styles.faqRow}>
                <Text style={styles.faqQ}>{faq.q}</Text>
                <Text style={styles.faqChevron}>{expanded === i ? '▲' : '▼'}</Text>
              </View>
              {expanded === i && <Text style={styles.faqA}>{faq.a}</Text>}
            </Pressable>
          ))}
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>📧 Contact Support</Text>
            <Text style={styles.contactSub}>support@boltvpn.com</Text>
            <Text style={styles.contactSub}>Response within 24 hours</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.light },
  safe:         { flex: 1 },
  scroll:       { padding: 16, gap: 10 },
  sectionTitle: { fontFamily: 'Oxanium_600SemiBold', fontSize: 10, color: C.txtLight3, letterSpacing: 1.5, marginBottom: 4 },
  faqCard:      { backgroundColor: C.light2, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.borderLight, gap: 8 },
  faqRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQ:         { flex: 1, fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight, lineHeight: 20 },
  faqChevron:   { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight3, marginLeft: 8 },
  faqA:         { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, lineHeight: 18 },
  contactCard:  { backgroundColor: C.light2, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.borderLight, gap: 4, marginTop: 8 },
  contactTitle: { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: C.txtLight },
  contactSub:   { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2 },
});
