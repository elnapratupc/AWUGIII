import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

interface Props {
  onLogout: () => void;
  onPressSettings?: () => void;
  showWelcome?: boolean;
}

export default function HeaderBar({ onLogout, onPressSettings, showWelcome = false }: Props) {
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
        <Appbar.Action
          icon="cog-outline"
          onPress={onPressSettings}
          color={colors.onBackground}
        />
      </Appbar>

      {showWelcome && (
        <Text style={[styles.welcome, { color: colors.onBackground }]}>
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
    fontSize: 24,
    // fontFamily no cal: 'Lexend Deca' ja està aplicat globalment
    // NO posem fontWeight: 'bold'
  },
});
