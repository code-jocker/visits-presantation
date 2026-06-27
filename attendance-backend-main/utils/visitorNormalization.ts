export const normalizeVisitorMobile = (mobile?: string | null): string | undefined => {
  if (mobile === null || mobile === undefined) return undefined;

  const digits = String(mobile).replace(/\D/g, '');
  if (!digits) return undefined;

  if (digits.startsWith('00')) {
    return digits.slice(2);
  }

  if (digits.length === 9) {
    return `250${digits}`;
  }

  return digits;
};

export const normalizeVisitorEmail = (email?: string | null): string | undefined => {
  const value = email?.trim();
  if (!value) return undefined;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : undefined;
};
