import localforage from "localforage";

export async function initialize() {
  const s = await status();

  if (s.supported) {
    // the modern persistent backend with support for large files
    localforage.setDriver(localforage.INDEXEDDB);
  }

  return s;
}

export async function status() {
  const supported = localforage.supports(localforage.INDEXEDDB);
  const statusData = { supported };

  // https://web.dev/storage-for-the-web/#check

  if (navigator?.storage?.estimate) {
    const quota = await navigator.storage.estimate();
    // quota.usage -> Number of bytes used.
    // quota.quota -> Maximum number of bytes available.
    const percentageUsed = (quota.usage / quota.quota) * 100;
    const remaining = quota.quota - quota.usage;

    statusData.percentageUsed = percentageUsed;
    statusData.remaining = remaining;
    statusData.quota = quota;
  }

  return statusData;
}

export async function get(key) {
  return localforage.getItem(key);
}

export async function getKeys() {
  return localforage.keys();
}

export async function remove(key) {
  return localforage.removeItem(key);
}

export async function store(key, value) {
  return localforage.setItem(key, value);
}
