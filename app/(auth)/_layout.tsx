import { Stack } from 'expo-router';
import { C } from '@/constants/C';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.dark },
      }}
    />
  );
}
