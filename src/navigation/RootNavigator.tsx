import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
      <div>First Screen</div>
    </Stack.Navigator>
  </NavigationContainer>
);
