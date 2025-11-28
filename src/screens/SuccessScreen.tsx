import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { PrimaryButton } from '../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

export const SuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { result } = route.params;

  const handleSendAnother = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Transfer' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconCheck}>✓</Text>
      </View>
      <Text style={styles.title}>Transfer successful</Text>
      <Text style={styles.detail}>
        Sent € {result.payload.amount.toFixed(2)} to{' '}
        {result.payload.recipient.name}
      </Text>
      <Text style={styles.detail}>Transaction ID: {result.id}</Text>

      <View style={styles.buttonWrapper}>
        <PrimaryButton
          title="Send another transfer"
          onPress={handleSendAnother}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#00c853',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCheck: { fontSize: 36, color: '#00c853', fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  detail: { color: '#555', marginBottom: 4, textAlign: 'center' },
  buttonWrapper: { marginTop: 24, alignSelf: 'stretch' },
});
