import { TransferPayload, TransferResult } from '../types';

let CURRENT_BALANCE = 20000;

export async function fetchCurrentBalance(): Promise<number> {
  // Simulate network delay
  await sleep(500);
  return CURRENT_BALANCE;
}

export async function processTransfer(
  payload: TransferPayload,
): Promise<TransferResult> {
  await sleep(800);

  // Deterministic test scenarios
  if (payload.amount === 9999) {
    const err: any = new Error('NETWORK_ERROR');
    err.code = 'NETWORK_ERROR';
    throw err;
  }

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
