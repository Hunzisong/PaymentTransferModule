export function validateAmount(raw: string, balance: number): string | null {
  const amount = Number(raw.replace(',', '.'));
  if (!raw) return 'Amount is required';
  if (Number.isNaN(amount) || amount <= 0)
    return 'Enter a valid positive amount';
  if (balance != null && amount > balance) {
    return 'Amount exceeds available balance';
  }
  return null;
}

export function validateRecipientName(name: string): string | null {
  if (!name.trim()) return 'Recipient is required';
  if (name.length < 2) return 'Recipient name is too short';
  return null;
}
