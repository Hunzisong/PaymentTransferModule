import React from 'react';
import { AccountProvider } from './src/context/AccountContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const App = () => (
  <AccountProvider>
    <RootNavigator />
  </AccountProvider>
);

export default App;
