import { TransferPayload, TransferResult } from '../types';

let CURRENT_BALANCE = 1250.5;

export async function fetchCurrentBalance(): Promise<number> {
  // Simulate network delay
  await sleep(500);
  return CURRENT_BALANCE;
}

export async function processTransfer(
  payload: TransferPayload,
): Promise<TransferResult> {
  await sleep(800);

  // Simulate network error
  if (Math.random() < 0.1) {
    throw new Error('NETWORK_ERROR');
  }

  // Insufficient funds
  if (payload.amount > CURRENT_BALANCE) {
    const error: any = new Error('INSUFFICIENT_FUNDS');
    error.code = 'INSUFFICIENT_FUNDS';
    throw error;
  }

  CURRENT_BALANCE -= payload.amount;

  return {
    id: `txn_${Date.now()}`,
    createdAt: new Date().toISOString(),
    payload,
    balanceAfter: CURRENT_BALANCE,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}
