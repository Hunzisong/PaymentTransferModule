export type Recipient = {
  id: string;
  name: string;
  accountNumber: string;
};

export type TransferPayload = {
  recipient: Recipient;
  amount: number;
  note?: string;
};

export type TransferResult = {
  id: string;
  createdAt: string;
  payload: TransferPayload;
  balanceAfter: number;
};
