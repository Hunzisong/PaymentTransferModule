import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentBalance } from '../services/api';
import { TransferResult } from '../types';

type AccountContextValue = {
  balance: number | null;
  isLoadingBalance: boolean;
  refreshBalance: () => Promise<void>;
  history: TransferResult[];
  addToHistory: (tx: TransferResult) => void;
};

const AccountContext = createContext<AccountContextValue | undefined>(
  undefined,
);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [history, setHistory] = useState<TransferResult[]>([]);

  const refreshBalance = async () => {
    setIsLoadingBalance(true);
    try {
      const b = await fetchCurrentBalance();
      setBalance(b);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const addToHistory = (tx: TransferResult) => {
    setHistory(prev => [tx, ...prev]);
  };

  useEffect(() => {
    (async () => {
      await refreshBalance();
    })();
  }, []);

  return (
    <AccountContext.Provider
      value={{
        balance,
        isLoadingBalance,
        refreshBalance,
        history,
        addToHistory,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const ctx = useContext(AccountContext);
  if (!ctx) {
    throw new Error('useAccount must be used within AccountProvider');
  }
  return ctx;
};
