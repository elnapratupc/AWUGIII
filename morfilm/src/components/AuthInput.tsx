import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export default function AuthInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      placeholderTextColor="#333"
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: '#eaefe9',
    padding: 14,
    marginBottom: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#171d1a',
  },
});
