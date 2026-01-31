import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Notification Handler Configuration
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

async function registerForPushNotificationsAsync() {
    let token;

    // 1. Android Notification Channel setup
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#B4F05F',
        });
    }

    // 2. check device type and permissions - only physical devices can get push tokens
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // request permission
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        // 3. get the token using the new projectId parameter
        try {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                console.error("Project ID not found in app.json");
            }

            token = (await Notifications.getExpoPushTokenAsync({
                projectId: projectId,
            })).data;

            console.log(" My Expo Push Token:", token);
        } catch (e) {
            console.error("Error getting token:", e);
        }
    } else {
        // alert('Must use physical device for Push Notifications');
        console.log("Emulator detected - No Push Token");
    }

    return token;
}

export function usePushNotifications() {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
    const notificationListener = useRef<any>(null);
    const responseListener = useRef<any>(null);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        // Notification Received (App Open)
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("Notification Received:", notification);
        });

        // Notification Clicked
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("Notification Clicked:", response);
        });

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);

    return { expoPushToken };
}