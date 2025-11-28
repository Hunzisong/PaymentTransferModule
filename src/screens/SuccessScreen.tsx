import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { PrimaryButton } from '../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

export const SuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { result } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Transfer successful</Text>
      <Text style={styles.detail}>
        Sent € {result.payload.amount.toFixed(2)} to{' '}
        {result.payload.recipient.name}
      </Text>
      <Text style={styles.detail}>Transaction ID: {result.id}</Text>

      <PrimaryButton
        title="Send another transfer"
        onPress={() => navigation.navigate('Transfer')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  icon: { fontSize: 40, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  detail: { color: '#555', marginBottom: 4, textAlign: 'center' },
});
