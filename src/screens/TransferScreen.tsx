import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { TextField } from '../components/TextField';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAccount } from '../context/AccountContext';
import { validateAmount, validateRecipientName } from '../utils/validation';
import { Recipient } from '../types';
import { fetchContactsAsRecipients } from '../services/contacts';

type Props = NativeStackScreenProps<RootStackParamList, 'Transfer'>;

export const TransferScreen: React.FC<Props> = ({ navigation }) => {
  const { balance, isLoadingBalance, history } = useAccount();

  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const [recipientError, setRecipientError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  const [contactRecipients, setContactRecipients] = useState<Recipient[]>([]);
  const [showContacts, setShowContacts] = useState(false);

  const handleContinue = () => {
    const rError = validateRecipientName(recipientName);
    const aError = validateAmount(amount);

    setRecipientError(rError);
    setAmountError(aError);

    if (rError || aError) {
      return;
    }

    if (!balance && balance !== 0) {
      Alert.alert('Balance not loaded', 'Please wait and try again.');
      return;
    }

    const numericAmount = Number(amount.replace(',', '.'));

    if (balance != null && numericAmount > balance) {
      setAmountError('Amount exceeds available balance');
      return;
    }

    const recipient: Recipient = {
      id: `rec_${recipientName.trim()}`,
      name: recipientName.trim(),
      accountNumber: '*****9703',
    };

    navigation.navigate('Confirm', {
      payload: {
        recipient,
        amount: numericAmount,
        note: note.trim() || undefined,
      },
    });
  };

  const handleOpenContacts = async () => {
    const data = await fetchContactsAsRecipients();
    setContactRecipients(data);
    setShowContacts(true);
  };

  const handleSelectContact = (recipient: Recipient) => {
    setRecipientName(recipient.name);
    setShowContacts(false);
  };

  const handleQuickResend = (
    recipient: Recipient,
    quickSendAmount: number,
    quickSendNote?: string,
  ) => {
    setRecipientName(recipient.name);
    setAmount(quickSendAmount.toString());
    setNote(quickSendNote ?? '');
    setRecipientError(null);
    setAmountError(null);
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

        <TouchableOpacity
          onPress={handleOpenContacts}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Choose from contacts</Text>
        </TouchableOpacity>

        {showContacts && (
          <View style={styles.contactsContainer}>
            <Text style={styles.sectionTitle}>Contacts</Text>
            <FlatList
              data={contactRecipients}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.historyRow}
                  onPress={() => handleSelectContact(item)}
                >
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactSub}>{item.accountNumber}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

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

        {history.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>Recent transfers</Text>
            <FlatList
              data={history}
              keyExtractor={item => item.id}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.historyRow}
                  onPress={() =>
                    handleQuickResend(
                      item.payload.recipient,
                      item.payload.amount,
                      item.payload.note,
                    )
                  }
                >
                  <View>
                    <Text style={styles.historyName}>
                      {item.payload.recipient.name}
                    </Text>
                    {item.payload.note ? (
                      <Text style={styles.historySub}>{item.payload.note}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.historyAmount}>
                    € {item.payload.amount.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, padding: 16 },
  balanceLabel: { color: '#666' },
  balanceValue: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  linkButton: { marginBottom: 8 },
  linkText: { color: '#0042ff', fontWeight: '500' },
  contactsContainer: { marginBottom: 16 },
  sectionTitle: { fontWeight: '600', marginBottom: 8 },
  contactRow: { paddingVertical: 8 },
  contactName: {},
  contactSub: { color: '#666', fontSize: 12 },
  historyContainer: { marginTop: 24 },
  historyRow: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyName: {},
  historySub: { color: '#777', fontSize: 12 },
  historyAmount: { fontWeight: '500' },
});
