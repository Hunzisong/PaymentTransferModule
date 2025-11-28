import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransferScreen } from '../screens/TransferScreen';
import { ConfirmScreen } from '../screens/ConfirmScreen';
import { SuccessScreen } from '../screens/SuccessScreen';
import { TransferPayload, TransferResult } from '../types';

export type RootStackParamList = {
  Transfer: undefined;
  Confirm: { payload: TransferPayload };
  Success: { result: TransferResult };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Transfer"
        component={TransferScreen}
        options={{ title: 'New Transfer' }}
      />
      <Stack.Screen
        name="Confirm"
        component={ConfirmScreen}
        options={{ title: 'Confirm' }}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{ title: 'Success' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
