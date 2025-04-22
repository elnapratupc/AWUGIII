import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';

interface Props {
  onLogout: () => void;
}

export default function HeaderBar({ onLogout }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar style={styles.topBar}>
        <Appbar.Action icon="account-circle-outline" onPress={() => {}} />
        <View style={{ flex: 1 }} />
        <Appbar.Action icon="cog-outline" onPress={onLogout} />
      </Appbar>

      <Text variant="headlineSmall" style={[styles.welcome, { color: colors.onBackground }]}>
        Welcome.
      </Text>
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
