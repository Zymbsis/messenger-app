export function isEmail(value: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(value);
}

export function isNotEmpty(value: string) {
  return value.trim() !== '';
}

export function hasMinLength(value: string, minLength: number) {
  return value.length >= minLength;
}

export function isEqualToOtherValue(value: string, otherValue: string) {
  return value === otherValue;
}
