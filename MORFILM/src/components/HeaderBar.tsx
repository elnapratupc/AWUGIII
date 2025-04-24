import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator'; // Asegúrate que la ruta es correcta

interface Props {
  onLogout: () => void;
  showWelcome?: boolean;
}

export default function HeaderBar({ onLogout, showWelcome = false }: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(route.name);

  useEffect(() => {
    setActiveTab(route.name);
  }, [route]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar style={styles.topBar}>
        <Appbar.Action
          icon="account-circle-outline"
          onPress={() => navigation.navigate('ProfileScreen')}
          color={activeTab === 'ProfileScreen' ? colors.primary : colors.onBackground}
        />
        <View style={{ flex: 1 }} />
        <Appbar.Action icon="cog-outline" onPress={onLogout} />
      </Appbar>

      {showWelcome && (
        <Text variant="headlineSmall" style={[styles.welcome, { color: colors.onBackground }]}>
          Welcome.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  topBar: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  welcome: {
    marginLeft: 8,
    marginTop: 8,
  },
});
