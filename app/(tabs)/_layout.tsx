import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { C } from '@/constants/C';

function TabIcon({ name, color, size }: { name: keyof typeof MaterialIcons.glyphMap; color: string; size: number }) {
  return <MaterialIcons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'web' ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.teal,
        tabBarInactiveTintColor: C.txtDark3,
        tabBarStyle: {
          backgroundColor: C.dark2,
          borderTopColor: C.borderDark,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
        },
        tabBarLabelStyle: {
          fontFamily: 'Oxanium_600SemiBold',
          fontSize: 10,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'VPN',
          tabBarIcon: ({ color, size }) => <TabIcon name="shield" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="servers"
        options={{
          title: 'Servers',
          tabBarIcon: ({ color, size }) => <TabIcon name="public" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <TabIcon name="settings" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <TabIcon name="person" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="speed"
        options={{
          title: 'Speed',
          tabBarIcon: ({ color, size }) => <TabIcon name="speed" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
