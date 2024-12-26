export function validateAmount(amount: string): string | undefined {
  const value = Number(amount);
  if (isNaN(value)) {
    return 'Amount must be a number';
  }
  if (value <= 0) {
    return 'Amount must be greater than 0';
  }
  return undefined;
}

export function validateDescription(description: string): string | undefined {
  if (!description.trim()) {
    return 'Description is required';
  }
  if (description.length < 3) {
    return 'Description must be at least 3 characters';
  }
  if (description.length > 100) {
    return 'Description must be less than 100 characters';
  }
  return undefined;
}

export function validateDate(date: string): string | undefined {
  if (!date) {
    return 'Date is required';
  }
  const selectedDate = new Date(date);
  const today = new Date();
  if (selectedDate > today) {
    return 'Date cannot be in the future';
  }
  return undefined;
}