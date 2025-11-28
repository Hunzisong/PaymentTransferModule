import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { TextField } from '../components/TextField';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAccount } from '../context/AccountContext';
import { validateAmount, validateRecipientName } from '../utils/validation';
import { Recipient } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Transfer'>;

export const TransferScreen: React.FC<Props> = ({ navigation }) => {
  const { balance, isLoadingBalance } = useAccount();
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const [recipientError, setRecipientError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  const handleContinue = () => {
    const rError = validateRecipientName(recipientName);
    const aError = validateAmount(amount);

    setRecipientError(rError);
    setAmountError(aError);

    if (rError || aError) return;

    if (!balance && balance !== 0) {
      Alert.alert('Balance not loaded', 'Please wait and try again.');
      return;
    }

    const numericAmount = Number(amount.replace(',', '.'));

    const recipient: Recipient = {
      id: `rec_${recipientName.trim()}`,
      name: recipientName.trim(),
      accountNumber: '****1234', // placeholder
    };

    navigation.navigate('Confirm', {
      payload: {
        recipient,
        amount: numericAmount,
        note: note.trim() || undefined,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.balanceLabel}>Current balance</Text>
        <Text style={styles.balanceValue}>
          {isLoadingBalance || balance == null
            ? 'Loading…'
            : `€ ${balance.toFixed(2)}`}
        </Text>

        <TextField
          label="Recipient"
          placeholder="Name or account"
          value={recipientName}
          onChangeText={setRecipientName}
          autoCapitalize="words"
          error={recipientError ?? undefined}
        />

        <TextField
          label="Amount"
          keyboardType="decimal-pad"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          error={amountError ?? undefined}
        />

        <TextField
          label="Note (optional)"
          placeholder="Payment note"
          value={note}
          onChangeText={setNote}
        />

        <PrimaryButton title="Continue" onPress={handleContinue} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, padding: 16 },
  balanceLabel: { color: '#666' },
  balanceValue: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
});
