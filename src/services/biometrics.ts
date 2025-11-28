import ReactNativeBiometrics, { BiometryType } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export async function isBiometricAvailable(): Promise<boolean> {
  const { available } = await rnBiometrics.isSensorAvailable();
  return available;
}

export async function authenticateWithBiometrics(
  reason: string,
): Promise<boolean> {
  const { success } = await rnBiometrics.simplePrompt({
    promptMessage: reason,
  });
  return success;
}

export async function getBiometryType(): Promise<BiometryType | null> {
  const { biometryType, available } = await rnBiometrics.isSensorAvailable();
  return available ? biometryType ?? null : null;
}
