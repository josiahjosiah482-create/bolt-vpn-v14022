import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { C } from '@/constants/C';

interface BackHeaderProps {
  title: string;
  dark?: boolean;
}

export function BackHeader({ title, dark = false }: BackHeaderProps) {
  const router = useRouter();
  const txtColor = dark ? C.txtDark : C.txtLight;
  const iconColor = dark ? C.txtDark2 : C.txtLight2;

  return (
    <View style={styles.header}>
      <Pressable
        style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={22} color={iconColor} />
      </Pressable>
      <Text style={[styles.title, { color: txtColor }]}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  backBtn: { padding: 4 },
  title:   { flex: 1, fontFamily: 'Oxanium_700Bold', fontSize: 18, textAlign: 'center' },
  spacer:  { width: 30 },
});
