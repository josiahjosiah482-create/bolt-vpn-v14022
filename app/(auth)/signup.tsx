import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Auth from '@/lib/_core/auth';
import { C } from '@/constants/C';
import { trpc } from '@/lib/trpc';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async (userData) => {
      await Auth.setUserInfo({
        id: userData.id,
        openId: userData.openId,
        name: userData.name,
        email: userData.email,
        loginMethod: 'email',
        lastSignedIn: new Date(),
      });
      await AsyncStorage.setItem('bolt_onboarding_done', 'true');
      router.replace('/(tabs)' as any);
    },
    onError: (err) => {
      setError(err.message ?? 'Registration failed. Please try again.');
      setLoading(false);
    },
  });

  const handleSignup = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    registerMutation.mutate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      avatarColor: '#00C896',
    });
  };

  const handleSocialSignup = async () => {
    await AsyncStorage.setItem('bolt_onboarding_done', 'true');
    router.replace('/(tabs)' as any);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kav}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back button */}
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={22} color={C.txtLight} />
            </Pressable>

            {/* Logo */}
            <View style={styles.logoSection}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>⚡</Text>
              </View>
              <Text style={styles.logoText}>Create Account</Text>
              <Text style={styles.logoSub}>Join Bolt VPN today</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {!!error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.inputWrap}>
                <MaterialIcons name="person" size={18} color={C.txtLight2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor={C.txtLight3}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputWrap}>
                <MaterialIcons name="email" size={18} color={C.txtLight2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={C.txtLight3}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputWrap}>
                <MaterialIcons name="lock" size={18} color={C.txtLight2} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password (min. 8 characters)"
                  placeholderTextColor={C.txtLight3}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
                />
                <Pressable onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <MaterialIcons name={showPass ? 'visibility-off' : 'visibility'} size={18} color={C.txtLight2} />
                </Pressable>
              </View>

              <Pressable
                style={[styles.signupBtn, (loading || registerMutation.isPending) && styles.signupBtnDisabled]}
                onPress={handleSignup}
                disabled={loading || registerMutation.isPending}
              >
                <Text style={styles.signupBtnText}>
                  {(loading || registerMutation.isPending) ? 'Creating account...' : 'Create Account'}
                </Text>
              </Pressable>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or sign up with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social buttons */}
              <View style={styles.socialRow}>
                <Pressable style={styles.socialBtn} onPress={handleSocialSignup}>
                  <Text style={styles.socialIcon}>🌐</Text>
                  <Text style={styles.socialText}>Google</Text>
                </Pressable>
                <Pressable style={styles.socialBtn} onPress={handleSocialSignup}>
                  <Text style={styles.socialIcon}>🍎</Text>
                  <Text style={styles.socialText}>Apple</Text>
                </Pressable>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable onPress={() => router.back()}>
                <Text style={styles.footerLink}>Sign In</Text>
              </Pressable>
            </View>

            <Text style={styles.terms}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.light },
  safe:      { flex: 1 },
  kav:       { flex: 1 },
  scroll:    { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },

  backBtn: { paddingTop: 16, paddingBottom: 8 },

  logoSection: { alignItems: 'center', paddingTop: 16, paddingBottom: 28, gap: 10 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.tealBg,
    borderWidth: 2,
    borderColor: C.tealBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 36 },
  logoText:  { fontFamily: 'Oxanium_700Bold', fontSize: 22, color: C.txtLight, letterSpacing: 1 },
  logoSub:   { fontFamily: 'Oxanium_400Regular', fontSize: 14, color: C.txtLight2 },

  form: { gap: 14 },

  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  errorText: { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.red },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.light2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.borderLight,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontFamily: 'Oxanium_400Regular',
    fontSize: 15,
    color: C.txtLight,
  },
  eyeBtn: { padding: 4 },

  signupBtn: {
    backgroundColor: C.teal,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  signupBtnDisabled: { opacity: 0.6 },
  signupBtnText: {
    fontFamily: 'Oxanium_700Bold',
    fontSize: 16,
    color: '#000',
    letterSpacing: 0.5,
  },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.borderLight },
  dividerText: { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtLight2 },

  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.light2,
    borderRadius: 14,
    height: 48,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  socialIcon: { fontSize: 18 },
  socialText: { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtLight },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontFamily: 'Oxanium_400Regular', fontSize: 14, color: C.txtLight2 },
  footerLink: { fontFamily: 'Oxanium_700Bold', fontSize: 14, color: C.teal },

  terms: {
    fontFamily: 'Oxanium_400Regular',
    fontSize: 11,
    color: C.txtLight3,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});
