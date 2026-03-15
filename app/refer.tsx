import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';
import { useState } from 'react';

const REFERRAL_CODE = 'BOLT-X7K2M';

export default function ReferScreen() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Refer a Friend" dark />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>🎁</Text>
            <Text style={styles.heroTitle}>Give 30 Days Free</Text>
            <Text style={styles.heroSub}>Share your code and both you and your friend get 30 days of Bolt VPN Pro free</Text>
          </View>

          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
            <Text style={styles.code}>{REFERRAL_CODE}</Text>
            <Pressable style={[styles.copyBtn, copied && styles.copyBtnDone]} onPress={copyCode}>
              <Text style={styles.copyBtnText}>{copied ? '✓ Copied!' : 'Copy Code'}</Text>
            </Pressable>
          </View>

          <View style={styles.stepsCard}>
            <Text style={styles.stepsTitle}>How it works</Text>
            {[
              'Share your code with a friend',
              'They sign up and enter your code',
              'Both of you get 30 days Pro free',
              'No limit — refer as many friends as you want!',
            ].map((step, i) => (
              <View key={step} style={styles.step}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Friends Referred</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: C.amber }]}>90</Text>
              <Text style={styles.statLabel}>Free Days Earned</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.dark },
  safe:         { flex: 1 },
  scroll:       { padding: 16, gap: 16 },
  hero:         { alignItems: 'center', paddingVertical: 16, gap: 8 },
  heroEmoji:    { fontSize: 48 },
  heroTitle:    { fontFamily: 'Oxanium_700Bold', fontSize: 22, color: C.txtDark },
  heroSub:      { fontFamily: 'Oxanium_400Regular', fontSize: 14, color: C.txtDark2, textAlign: 'center', lineHeight: 20 },
  codeCard:     { backgroundColor: C.cardDark, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.tealBorder, alignItems: 'center', gap: 12 },
  codeLabel:    { fontFamily: 'Oxanium_600SemiBold', fontSize: 10, color: C.txtDark3, letterSpacing: 1.5 },
  code:         { fontFamily: 'Oxanium_700Bold', fontSize: 28, color: C.teal, letterSpacing: 4 },
  copyBtn:      { backgroundColor: C.teal, borderRadius: 12, paddingHorizontal: 28, height: 44, alignItems: 'center', justifyContent: 'center' },
  copyBtnDone:  { backgroundColor: C.teal2 },
  copyBtnText:  { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: '#000' },
  stepsCard:    { backgroundColor: C.cardDark, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.borderDark, gap: 12 },
  stepsTitle:   { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: C.txtDark },
  step:         { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepNum:      { width: 24, height: 24, borderRadius: 12, backgroundColor: C.tealBg, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  stepNumText:  { fontFamily: 'Oxanium_700Bold', fontSize: 12, color: C.teal },
  stepText:     { flex: 1, fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2, lineHeight: 18 },
  statsRow:     { flexDirection: 'row', gap: 12 },
  statCard:     { flex: 1, backgroundColor: C.cardDark, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.borderDark, gap: 4 },
  statValue:    { fontFamily: 'Oxanium_700Bold', fontSize: 28, color: C.teal },
  statLabel:    { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2, textAlign: 'center' },
});
