import { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BackHeader } from '@/components/back-header';
import { C } from '@/constants/C';

type AuditStatus = 'pass' | 'warn' | 'fail' | 'pending';

type AuditCheck = {
  id: string;
  title: string;
  desc: string;
  category: string;
  status: AuditStatus;
  detail: string;
};

const AUDIT_CHECKS: AuditCheck[] = [
  { id: 'nolog',     title: 'No-Log Policy',         desc: 'Verified by independent auditor',      category: 'Privacy',   status: 'pass', detail: 'Deloitte audit completed March 2026. Zero user logs confirmed.' },
  { id: 'dns',       title: 'DNS Leak Protection',   desc: 'All DNS queries routed through VPN',   category: 'Security',  status: 'pass', detail: 'No DNS leaks detected. All queries encrypted.' },
  { id: 'ipv6',      title: 'IPv6 Leak Protection',  desc: 'IPv6 traffic blocked when VPN is on',  category: 'Security',  status: 'pass', detail: 'IPv6 fully disabled during VPN sessions.' },
  { id: 'webrtc',    title: 'WebRTC Leak Protection', desc: 'Browser WebRTC requests blocked',     category: 'Browser',   status: 'warn', detail: 'WebRTC protection requires browser extension. Install Bolt VPN extension.' },
  { id: 'encrypt',   title: 'AES-256 Encryption',    desc: 'Military-grade encryption active',     category: 'Security',  status: 'pass', detail: 'AES-256-GCM cipher with 4096-bit RSA key exchange.' },
  { id: 'pfs',       title: 'Perfect Forward Secrecy', desc: 'New keys generated per session',    category: 'Security',  status: 'pass', detail: 'ECDH key exchange ensures past sessions cannot be decrypted.' },
  { id: 'split',     title: 'Split Tunneling',        desc: 'Configured correctly',                category: 'Config',    status: 'pass', detail: 'No sensitive apps bypassing VPN tunnel.' },
  { id: 'kill',      title: 'Kill Switch',            desc: 'Currently disabled',                  category: 'Config',    status: 'warn', detail: 'Enable Kill Switch to prevent data leaks if VPN drops.' },
  { id: 'tracker',   title: 'Tracker Blocking',       desc: 'Ad & tracker blocking active',        category: 'Privacy',   status: 'pass', detail: '2,847 trackers blocked in the last 7 days.' },
  { id: 'malware',   title: 'Malware Protection',     desc: 'Real-time threat blocking',           category: 'Security',  status: 'pass', detail: 'CyberSec module blocking malicious domains.' },
];

const STATUS_CONFIG: Record<AuditStatus, { color: string; icon: string; label: string }> = {
  pass:    { color: C.teal,  icon: '✓', label: 'PASS'    },
  warn:    { color: C.amber, icon: '⚠', label: 'WARNING' },
  fail:    { color: C.red,   icon: '✗', label: 'FAIL'    },
  pending: { color: C.txtDark3, icon: '…', label: 'PENDING' },
};

const CATEGORIES = ['All', 'Privacy', 'Security', 'Browser', 'Config'];

export default function PrivacyAuditScreen() {
  const [checks, setChecks] = useState<AuditCheck[]>(AUDIT_CHECKS);
  const [category, setCategory] = useState('All');
  const [running, setRunning]   = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const warnCount = checks.filter((c) => c.status === 'warn').length;
  const failCount = checks.filter((c) => c.status === 'fail').length;
  const score     = Math.round((passCount / checks.length) * 100);

  const scoreColor = score >= 90 ? C.teal : score >= 70 ? C.amber : C.red;

  const runAudit = () => {
    if (running) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRunning(true);
    progressAnim.setValue(0);

    setChecks((prev) => prev.map((c) => ({ ...c, status: 'pending' as AuditStatus })));

    Animated.timing(progressAnim, { toValue: 1, duration: 3500, useNativeDriver: false }).start(() => {
      setChecks(AUDIT_CHECKS);
      setRunning(false);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });
  };

  const filtered = checks.filter((c) => category === 'All' || c.category === category);
  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Privacy Audit" dark />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Score circle */}
          <View style={styles.scoreSection}>
            <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
              <Text style={[styles.scoreNum, { color: scoreColor }]}>{running ? '…' : score}</Text>
              <Text style={styles.scoreLabel}>{running ? 'Auditing' : 'Privacy Score'}</Text>
            </View>

            {running && (
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
            )}

            <View style={styles.scoreStats}>
              {[
                { label: 'Pass',    count: passCount, color: C.teal  },
                { label: 'Warning', count: warnCount, color: C.amber },
                { label: 'Fail',    count: failCount, color: C.red   },
              ].map((s) => (
                <View key={s.label} style={styles.scoreStat}>
                  <Text style={[styles.scoreStatNum, { color: s.color }]}>{s.count}</Text>
                  <Text style={styles.scoreStatLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            <Pressable
              style={[styles.auditBtn, running && styles.auditBtnDisabled]}
              onPress={runAudit}
              disabled={running}
            >
              <Text style={styles.auditBtnText}>
                {running ? '⏳ Auditing...' : '🔍 Run Audit'}
              </Text>
            </Pressable>
          </View>

          {/* Category filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={[styles.catChip, category === cat && styles.catChipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Checks */}
          <View style={styles.checksList}>
            {filtered.map((check) => {
              const cfg = STATUS_CONFIG[check.status];
              const isExpanded = expanded === check.id;
              return (
                <Pressable
                  key={check.id}
                  style={[styles.checkCard, isExpanded && styles.checkCardExpanded]}
                  onPress={() => setExpanded(isExpanded ? null : check.id)}
                >
                  <View style={styles.checkTop}>
                    <View style={[styles.checkStatus, { backgroundColor: cfg.color + '20', borderColor: cfg.color + '40' }]}>
                      <Text style={[styles.checkStatusIcon, { color: cfg.color }]}>{cfg.icon}</Text>
                    </View>
                    <View style={styles.checkInfo}>
                      <Text style={styles.checkTitle}>{check.title}</Text>
                      <Text style={styles.checkDesc}>{check.desc}</Text>
                    </View>
                    <View style={[styles.checkBadge, { backgroundColor: cfg.color + '15' }]}>
                      <Text style={[styles.checkBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                  </View>
                  {isExpanded && (
                    <View style={styles.checkDetail}>
                      <Text style={styles.checkDetailText}>{check.detail}</Text>
                      {check.status === 'warn' && (
                        <Pressable style={styles.fixBtn}>
                          <Text style={styles.fixBtnText}>Fix This →</Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Certificate */}
          <View style={styles.certCard}>
            <Text style={styles.certTitle}>🏆 Audit Certificate</Text>
            <Text style={styles.certText}>
              Bolt VPN has been independently audited by Deloitte. Our no-log policy is verified and our infrastructure undergoes quarterly security assessments.
            </Text>
            <View style={styles.certRow}>
              <View style={styles.certBadge}>
                <Text style={styles.certBadgeText}>✓ Deloitte Verified</Text>
              </View>
              <View style={styles.certBadge}>
                <Text style={styles.certBadgeText}>✓ ISO 27001</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.dark },
  safe:      { flex: 1 },
  scroll:    { paddingHorizontal: 16, paddingBottom: 32, gap: 20 },

  scoreSection: { alignItems: 'center', paddingVertical: 8, gap: 16 },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNum:   { fontFamily: 'Oxanium_700Bold', fontSize: 40 },
  scoreLabel: { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2 },

  progressTrack: { width: '80%', height: 6, backgroundColor: C.cardDark, borderRadius: 3, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: C.teal, borderRadius: 3 },

  scoreStats:    { flexDirection: 'row', gap: 24 },
  scoreStat:     { alignItems: 'center', gap: 2 },
  scoreStatNum:  { fontFamily: 'Oxanium_700Bold', fontSize: 22 },
  scoreStatLabel:{ fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2 },

  auditBtn: {
    backgroundColor: C.teal,
    borderRadius: 14,
    paddingHorizontal: 32,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auditBtnDisabled: { opacity: 0.5 },
  auditBtnText:     { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: '#000' },

  catList: { gap: 8 },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.cardDark,
    borderWidth: 1,
    borderColor: C.borderDark,
  },
  catChipActive:  { backgroundColor: C.tealBg, borderColor: C.tealBorder },
  catText:        { fontFamily: 'Oxanium_600SemiBold', fontSize: 12, color: C.txtDark2 },
  catTextActive:  { color: C.teal },

  checksList: { gap: 8 },
  checkCard: {
    backgroundColor: C.cardDark,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.borderDark,
    gap: 10,
  },
  checkCardExpanded: { borderColor: C.tealBorder },
  checkTop:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkStatus: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  checkStatusIcon: { fontFamily: 'Oxanium_700Bold', fontSize: 16 },
  checkInfo:   { flex: 1 },
  checkTitle:  { fontFamily: 'Oxanium_600SemiBold', fontSize: 14, color: C.txtDark },
  checkDesc:   { fontFamily: 'Oxanium_400Regular', fontSize: 12, color: C.txtDark2, marginTop: 2 },
  checkBadge:  { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  checkBadgeText: { fontFamily: 'Oxanium_700Bold', fontSize: 9, letterSpacing: 0.5 },
  checkDetail: { paddingTop: 8, borderTopWidth: 1, borderTopColor: C.borderDark, gap: 8 },
  checkDetailText: { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2, lineHeight: 18 },
  fixBtn:      { backgroundColor: C.amber, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' },
  fixBtnText:  { fontFamily: 'Oxanium_700Bold', fontSize: 12, color: '#000' },

  certCard: {
    backgroundColor: C.cardDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.tealBorder,
    gap: 10,
  },
  certTitle: { fontFamily: 'Oxanium_700Bold', fontSize: 15, color: C.txtDark },
  certText:  { fontFamily: 'Oxanium_400Regular', fontSize: 13, color: C.txtDark2, lineHeight: 18 },
  certRow:   { flexDirection: 'row', gap: 10 },
  certBadge: { backgroundColor: C.tealBg, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.tealBorder },
  certBadgeText: { fontFamily: 'Oxanium_700Bold', fontSize: 11, color: C.teal },
});
