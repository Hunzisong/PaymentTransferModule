import { useCallback, useEffect, useState } from 'react';
import {
  authenticateWithBiometrics,
  isBiometricAvailable,
  getBiometryType,
} from '../services/biometrics';
import { BiometryType } from 'react-native-biometrics';

export function useBiometricAuth() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [biometryType, setBiometryType] = useState<BiometryType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const supported = await isBiometricAvailable();
        setAvailable(supported);
        if (supported) {
          const type = await getBiometryType();
          setBiometryType(type ?? null);
        }
      } catch {
        setAvailable(false);
      }
    })();
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    try {
      return await authenticateWithBiometrics('Confirm this payment');
    } catch {
      return false;
    }
  }, []);

  return { available, biometryType, authenticate };
}
