// Prosty globalny store liczący aktywne żądania (dla spinnera)
// API:
//  - startRequest(opts?)
//  - finishRequest(opts?)
//  - subscribe(listener) => unsubscribe
//  - getCount()

let activeCount = 0;
const listeners = new Set();

function notify() {
  for (const l of listeners) {
    try {
      l(activeCount);
    } catch (_) {
      // ignoruj błąd listenera
    }
  }
}

export function getCount() {
  return activeCount;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function startRequest() {
  activeCount += 1;
  notify();
}

export function finishRequest() {
  if (activeCount > 0) {
    activeCount -= 1;
    notify();
  } else {
    // bezpieczeństwo: nie schodź poniżej 0
    activeCount = 0;
  }
}

export default {
  getCount,
  subscribe,
  startRequest,
  finishRequest,
};
