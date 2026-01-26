// app/verification/_layout.tsx
import { Stack } from 'expo-router';

export default function VerificationLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            presentation: 'modal',
        }}>
            <Stack.Screen name="id-upload" options={{ title: 'Verify ID' }} />
        </Stack>
    );
}