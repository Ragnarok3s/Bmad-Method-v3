import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ApiProvider } from './src/providers/ApiProvider';
import { HousekeepingScreen } from './src/screens/HousekeepingScreen';
import { IncidentsScreen } from './src/screens/IncidentsScreen';
import { usePushRegistration } from './src/modules/notifications/usePushRegistration';

const Stack = createNativeStackNavigator();
const OWNER_ID = 1;

function HomeScreen({ navigation }: { navigation: any }): JSX.Element {
  usePushRegistration(OWNER_ID);

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeTitle}>Operações</Text>
      <Button title="Checklists de limpeza" onPress={() => navigation.navigate('Housekeeping')} />
      <Button title="Incidentes" onPress={() => navigation.navigate('Incidents')} />
    </View>
  );
}

export default function App(): JSX.Element {
  const linking = useMemo(
    () => ({
      prefixes: ['bmad://']
    }),
    []
  );

  return (
    <SafeAreaProvider>
      <ApiProvider>
        <NavigationContainer linking={linking}>
          <StatusBar style="dark" />
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Bmad Mobile' }} />
            <Stack.Screen name="Housekeeping" component={HousekeepingScreen} options={{ title: 'Checklists' }} />
            <Stack.Screen name="Incidents" component={IncidentsScreen} options={{ title: 'Incidentes' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApiProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: '600'
  }
});
