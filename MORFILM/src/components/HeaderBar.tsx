import React from 'react';
import { Appbar } from 'react-native-paper';

interface Props {
  onLogout: () => void;
}

export default function HeaderBar({ onLogout }: Props) {
  return (
    <Appbar.Header>
      <Appbar.Action icon="account-circle-outline" onPress={() => {}} />
      <Appbar.Content title="Morfilm" />
      <Appbar.Action icon="cog-outline" onPress={() => {}} />
    </Appbar.Header>
  );
}
