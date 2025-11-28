import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

type Props = React.ComponentProps<typeof TextInput> & {
  label: string;
  error?: string;
};

export const TextField: React.FC<Props> = ({ label, error, ...rest }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholderTextColor="#999"
      {...rest}
    />
    {!!error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { marginBottom: 4, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  error: {
    marginTop: 4,
    color: '#d32f2f',
    fontSize: 12,
  },
});
