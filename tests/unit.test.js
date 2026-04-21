// tests/unit.test.js
// Unit tests for ElectIQ utility functions

const { sanitize } = require('./helpers');

describe('sanitize()', () => {
  test('strips HTML tags', () => {
    expect(sanitize('<script>alert(1)</script>hello')).toBe('hello');
  });
  test('trims whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello');
  });
  test('limits to 500 chars by default', () => {
    expect(sanitize('a'.repeat(600))).toHaveLength(500);
  });
  test('limits to custom length', () => {
    expect(sanitize('hello world', 5)).toBe('hello');
  });
  test('throws on non-string input', () => {
    expect(() => sanitize(null)).toThrow();
    expect(() => sanitize(123)).toThrow();
    expect(() => sanitize(undefined)).toThrow();
  });
  test('handles empty string', () => {
    expect(sanitize('')).toBe('');
  });
  test('handles XSS attempt', () => {
    expect(sanitize('<img src=x onerror=alert(1)>')).toBe('');
  });
  test('handles SQL injection string safely', () => {
    const sql = "'; DROP TABLE users; --";
    expect(sanitize(sql)).toBe("'; DROP TABLE users; --");
  });
  test('preserves normal text', () => {
    expect(sanitize('How do I register to vote?')).toBe('How do I register to vote?');
  });
  test('handles special characters', () => {
    expect(sanitize('Café & résumé')).toBe('Café & résumé');
  });
});
