const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  info: (...a) => {
    if (!isTest) console.log('[INFO]', ...a);
  },
  warn: (...a) => {
    if (!isTest) console.warn('[WARN]', ...a);
  },
  error: (...a) => {
    if (!isTest) console.error('[ERROR]', ...a);
  },
};
