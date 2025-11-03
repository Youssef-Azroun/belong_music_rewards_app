// Modal layout for player and other modals
import { Stack } from 'expo-router';
import { THEME } from '../../constants/theme';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: THEME.colors.background,
        },
        headerTintColor: THEME.colors.text.primary,
        presentation: 'modal',
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="player"
        options={{
          presentation: 'fullScreenModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="challenge-detail"
        options={{
          presentation: 'card',
          headerShown: false,
        }}
      />
    </Stack>
  );
}