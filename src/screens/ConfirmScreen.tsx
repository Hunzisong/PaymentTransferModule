import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { PrimaryButton } from '../components/PrimaryButton';
import { processTransfer } from '../services/api';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { useAccount } from '../context/AccountContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Confirm'>;

const FALLBACK_PIN = '1234';

export const ConfirmScreen: React.FC<Props> = ({ route, navigation }) => {
  const { payload } = route.params;
  const { balance, addToHistory, refreshBalance } = useAccount();
  const [loading, setLoading] = useState(false);
  const { available, biometryType, authenticate } = useBiometricAuth();

  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const performTransfer = async () => {
    try {
      setLoading(true);
      const result = await processTransfer(payload);
      addToHistory(result);
      await refreshBalance();

      navigation.reset({
        index: 1,
        routes: [{ name: 'Transfer' }, { name: 'Success', params: { result } }],
      });
    } catch (error: any) {
      if (error.code === 'INSUFFICIENT_FUNDS') {
        Alert.alert(
          'Insufficient funds',
          'Your balance is not enough for this transfer.',
        );
      } else if (error.message === 'NETWORK_ERROR') {
        Alert.alert(
          'Network error',
          'Please check your connection and try again.',
        );
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (available) {
      const success = await authenticate();
      if (success) {
        await performTransfer();
      } else {
        Alert.alert(
          'Authentication failed',
          'We could not verify your identity.',
        );
      }
    } else {
      // Fallback: PIN modal
      setShowFallbackModal(true);
    }
  };

  const handleFallbackConfirm = async () => {
    if (pin !== FALLBACK_PIN) {
      setPinError('Incorrect PIN');
      return;
    }
    setShowFallbackModal(false);
    setPin('');
    setPinError(null);
    await performTransfer();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm transfer</Text>

      <View style={styles.card}>
        <Row label="To" value={payload.recipient.name} />
        <Row label="Account" value={payload.recipient.accountNumber} />
        <Row label="Amount" value={`€ ${payload.amount.toFixed(2)}`} />
        {payload.note && <Row label="Note" value={payload.note} />}
        {balance != null && (
          <Row
            label="Balance after"
            value={`€ ${(balance - payload.amount).toFixed(2)}`}
          />
        )}
      </View>

      {available === false && (
        <Text style={styles.info}>
          Biometrics not available on this device. You’ll use a fallback PIN
          instead.
        </Text>
      )}
      {available && biometryType && (
        <Text style={styles.info}>Authentication method: {biometryType}</Text>
      )}

      <PrimaryButton
        title={available ? 'Confirm & authenticate' : 'Confirm with PIN'}
        onPress={handleConfirm}
        loading={loading}
      />

      {/* Fallback PIN modal */}
      <Modal visible={showFallbackModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter PIN</Text>
            <TextInput
              value={pin}
              onChangeText={text => {
                setPin(text);
                if (pinError) setPinError(null);
              }}
              secureTextEntry
              keyboardType="number-pad"
              style={styles.modalInput}
            />
            {!!pinError && <Text style={styles.modalError}>{pinError}</Text>}
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowFallbackModal(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFallbackConfirm}>
                <Text style={styles.modalPrimary}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowLabel: { color: '#555' },
  rowValue: { fontWeight: '500' },
  info: { marginBottom: 12, color: '#555' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalError: { color: '#d32f2f', marginTop: 4 },
  modalActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalPrimary: { color: '#0042ff', fontWeight: '600' },
});
