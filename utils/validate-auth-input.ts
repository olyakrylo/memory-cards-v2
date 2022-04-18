export const validateInput = (value: string): boolean => {
  if (!value) return true;
  return /\w/.test(value) && !value.includes(" ");
};
