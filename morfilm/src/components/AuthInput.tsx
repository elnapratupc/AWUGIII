import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export default function AuthInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error = false,
  errorMessage = '',
}: Props) {
  const { colors } = useTheme();

  return (
    <>
      <TextInput
        mode="flat"
        label={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        underlineColor={error ? '#B3261E' : 'transparent'}
        activeUnderlineColor={error ? '#B3261E' : '#206a4e'}
        textColor={colors.onSurface}
        error={error}
        right={
          error ? (
            <TextInput.Icon icon="alert-circle" color="#B3261E" />
          ) : value ? (
            <TextInput.Icon icon="close" onPress={() => onChangeText('')} />
          ) : null
        }
      />
      {error && !!errorMessage && (
        <HelperText type="error" visible={true} padding="none">
          {errorMessage}
        </HelperText>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: '#eaefe9',
    borderRadius: 10,
    marginBottom: 8,
  },
});
