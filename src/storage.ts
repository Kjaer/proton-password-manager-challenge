/*
 * a small localStorage proxy for to persist localStorage
 * contents in runtime memory after first access in order
 * to save performance on JSON-parsing and instead remember
 * how any localStorage item was modified after first access
 *
 * a memoized virtual localStorage if you will
 */
const currentLocalStorage: { [key: string]: any } = {};
// `currentLocalStorage` is not implemented at all, so I completed the missing functionality..

export function setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    currentLocalStorage[key] = value;
}

export function getItem<V>(key: string): V {
    if (currentLocalStorage[key]) {
        return currentLocalStorage[key];
    }

    const storedValue = localStorage.getItem(key);

    return storedValue && JSON.parse(storedValue);
}

export function removeItem(key: string) {
    localStorage.removeItem(key);
    delete currentLocalStorage[key];
}

// Flush action is useful when you don't refresh but logout from/re-login to the application.
export function flushCache() {
    Object.keys(currentLocalStorage).forEach((key) => delete currentLocalStorage[key]);
}
