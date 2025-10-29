import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Bmad Mobile',
  slug: 'bmad-mobile',
  version: '0.1.0',
  orientation: 'portrait',
  platforms: ['android', 'ios'],
  scheme: 'bmad',
  userInterfaceStyle: 'automatic',
  updates: {
    enabled: true
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.bmad.mobile'
  },
  android: {
    package: 'com.bmad.mobile',
    adaptiveIcon: {
      backgroundColor: '#ffffff'
    }
  },
  extra: {
    eas: {
      projectId: 'bmad-mobile-dev'
    }
  },
  owner: config.owner ?? undefined
});
