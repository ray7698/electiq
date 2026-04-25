const { CACHE_MAX_SIZE } = require('../constants');
const store = new Map();

module.exports = {
  get: (key) => store.get(key) ?? null,
  set: (key, value) => {
    if (store.size >= CACHE_MAX_SIZE) store.delete(store.keys().next().value);
    store.set(key, value);
  },
};
