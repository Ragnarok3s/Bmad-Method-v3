import { useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import { useApiClient } from '../../providers/ApiProvider';

const LAST_REGISTERED_KEY = 'notifications:last-registered';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export function usePushRegistration(ownerId: number): void {
  const api = useApiClient();

  useEffect(() => {
    let isMounted = true;

    async function register() {
      try {
        const settings = await Notifications.getPermissionsAsync();
        let finalStatus = settings.status;
        if (finalStatus !== 'granted') {
          const request = await Notifications.requestPermissionsAsync();
          finalStatus = request.status;
        }
        if (finalStatus !== 'granted') {
          return;
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX
          });
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const tokenResponse = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined
        );
        const expoPushToken = tokenResponse.data;

        const nativeToken = await Notifications.getDevicePushTokenAsync().catch(() => null);
        const token = nativeToken?.data ?? expoPushToken;

        const payload = {
          token,
          platform: Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web',
          expoPushToken,
          deviceName: Platform.OS
        } as const;

        const cacheKey = `${LAST_REGISTERED_KEY}:${ownerId}`;
        const serialized = JSON.stringify(payload);
        const stored = await AsyncStorage.getItem(cacheKey);
        if (stored === serialized) {
          return;
        }

        if (!isMounted) {
          return;
        }

        await api.notifications.registerDevice(ownerId, payload);
        await AsyncStorage.setItem(cacheKey, serialized);
      } catch (error) {
        console.warn('push_registration_failed', error);
      }
    }

    register();

    return () => {
      isMounted = false;
    };
  }, [api, ownerId]);
}
