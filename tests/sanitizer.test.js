const { sanitize } = require('../src/utils/sanitizer');

describe('Sanitizer Unit Tests', () => {
  test('strips simple script tags', () => {
    const input = 'Hello <script>alert(1)</script> world';
    expect(sanitize(input)).toBe('Hello  world');
  });

  test('strips complex XSS payloads', () => {
    const input = '<img src=x onerror=alert(1)> <a href="javascript:alert(1)">click me</a>';
    expect(sanitize(input)).toBe('click me');
  });

  test('strips style tags and their content', () => {
    const input = 'Text <style>body { color: red; }</style> more text';
    expect(sanitize(input)).toBe('Text  more text');
  });

  test('preserves plain text', () => {
    const input = 'Just some plain text';
    expect(sanitize(input)).toBe('Just some plain text');
  });

  test('respects maxLen constraint', () => {
    const input = '1234567890';
    expect(sanitize(input, 5)).toBe('12345');
  });

  test('trims whitespace', () => {
    const input = '   padded text   ';
    expect(sanitize(input)).toBe('padded text');
  });

  test('throws error for non-string input', () => {
    expect(() => sanitize(123)).toThrow('Input must be a string');
  });
});
