import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';
import { trpc } from '@/lib/trpc';

const CONFIRM_PHRASE = 'DELETE MY ACCOUNT';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [step, setStep] = useState<'confirm' | 'done'>('confirm');

  const deleteAccount = trpc.auth.deleteAccount.useMutation({
    onSuccess: () => {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep('done');
      setTimeout(() => router.replace('/(auth)/login' as any), 2500);
    },
  });

  const isMatch = inputText.trim().toUpperCase() === CONFIRM_PHRASE;

  const handleDelete = () => {
    if (!isMatch) return;
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deleteAccount.mutate();
  };

  if (step === 'done') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.doneWrap}>
            <Text style={styles.doneEmoji}>✅</Text>
            <Text style={styles.doneTitle}>Account Deleted</Text>
            <Text style={styles.doneSub}>Your account and all associated data have been permanently removed. Redirecting…</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Delete Account" />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Warning banner */}
          <View style={styles.warningBanner}>
            <Text style={styles.warningEmoji}>⚠️</Text>
            <Text style={styles.warningTitle}>This action is permanent</Text>
            <Text style={styles.warningSub}>
              Deleting your account will permanently remove all your data, including your profile, settings, and connection history. This cannot be undone.
            </Text>
          </View>

          {/* What gets deleted */}
          <View style={styles.listCard}>
            <Text style={styles.listTitle}>What will be deleted:</Text>
            {[
              'Your account profile and credentials',
              'All saved settings and preferences',
              'Connection history and usage statistics',
              'Any active subscription (no refund)',
              'Referral credits and rewards',
            ].map((item) => (
              <View key={item} style={styles.listRow}>
                <Text style={styles.listBullet}>✕</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Confirmation input */}
          <View style={styles.confirmCard}>
            <Text style={styles.confirmLabel}>
              Type <Text style={styles.confirmPhrase}>{CONFIRM_PHRASE}</Text> to confirm:
            </Text>
            <TextInput
              style={[styles.confirmInput, isMatch && styles.confirmInputMatch]}
              value={inputText}
              onChangeText={setInputText}
              placeholder={CONFIRM_PHRASE}
              placeholderTextColor={C.txtLight3}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>

          {/* Delete button */}
          <Pressable
            style={[styles.deleteBtn, (!isMatch || deleteAccount.isPending) && styles.deleteBtnDisabled]}
            onPress={handleDelete}
            disabled={!isMatch || deleteAccount.isPending}
          >
            {deleteAccount.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.deleteBtnText}>Permanently Delete Account</Text>
            )}
          </Pressable>

          {deleteAccount.isError && (
            <Text style={styles.errorText}>
              {deleteAccount.error?.message ?? 'Failed to delete account. Please try again.'}
            </Text>
          )}

          {/* Cancel */}
          <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelBtnText}>Cancel — Keep My Account</Text>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.light },
  safe:         { flex: 1 },
  scroll:       { padding: 16, paddingBottom: 40, gap: 16 },

  warningBanner: {
    backgroundColor: C.redBg,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  warningEmoji: { fontSize: 40 },
  warningTitle: { fontFamily: 'Oxanium_700Bold', fontSize: 18, color: C.red, textAlign: 'center' },
  warningSub:   { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, textAlign: 'center', lineHeight: 18 },

  listCard: {
    backgroundColor: C.light2,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    gap: 10,
  },
  listTitle:  { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: C.txtLight },
  listRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  listBullet: { fontFamily: 'Oxanium_700Bold', fontSize: 13, color: C.red, marginTop: 1 },
  listText:   { flex: 1, fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, lineHeight: 18 },

  confirmCard: {
    backgroundColor: C.light2,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    gap: 10,
  },
  confirmLabel:  { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtLight2, lineHeight: 18 },
  confirmPhrase: { fontFamily: 'Oxanium_700Bold', color: C.red },
  confirmInput: {
    backgroundColor: C.light,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.borderLight2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Oxanium_600SemiBold',
    fontSize: 14,
    color: C.txtLight,
    letterSpacing: 1,
  },
  confirmInputMatch: { borderColor: C.red },

  deleteBtn: {
    backgroundColor: C.red,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnDisabled: { opacity: 0.4 },
  deleteBtnText:     { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: '#fff' },

  errorText: {
    fontFamily: 'Oxanium_400Regular',
    fontSize: 13,
    color: C.red,
    textAlign: 'center',
  },

  cancelBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.borderLight2,
  },
  cancelBtnText: { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight2 },

  doneWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  doneEmoji: { fontSize: 64 },
  doneTitle: { fontFamily: 'Oxanium_700Bold', fontSize: 24, color: C.txtLight },
  doneSub:   { fontFamily: 'Oxanium_400Regular', fontSize: 14, color: C.txtLight2, textAlign: 'center', lineHeight: 20 },
});
