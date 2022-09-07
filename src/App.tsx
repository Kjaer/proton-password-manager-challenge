import React, { useState, useEffect } from 'react';

import { EncryptedPassword, Password } from './models';
import * as storage from './storage';
import { encrypt, decrypt, getKey, base64StringToUint8Array } from './crypto';
import { wait } from './helpers';
import { CRYPTO_KEY_STORAGE_KEY, PASSWORDS_STORAGE_KEY } from './constants';
import PasswordLockedContainer from './components/PasswordLockedContainer';
import PasswordMainContainer from './components/PasswordMainContainer';

function duplicateUrlsAmongPasswords(passwords: { [id: string]: Password }) {
    return null;
}

function App() {
    const [loading, setLoading] = useState(true);

    const [key, setKey] = useState<CryptoKey | null>(null);

    const [decryptedPasswords, setDecryptedPasswords] = useState<{ [id: string]: Password }>({});

    const [passwordOpsFlag, setPasswordOpsFlag] = useState<boolean>(false);

    async function hydratePasswords(newKey: CryptoKey) {
        setKey(newKey);
        await wait(500);

        // getItem already returns parsed result. JSON.parse here is redundant
        const encryptedPasswords = storage.getItem<{ [key: string]: EncryptedPassword }>(PASSWORDS_STORAGE_KEY);

        // considering the time constraints, this is the easiest way to check whether object is empty or not.
        if (JSON.stringify(encryptedPasswords) === '{}') {
            return;
        }

        const decryptedPasswordsPromises = Object.entries(encryptedPasswords).map(async ([passKey, passItem]) => {
            const password = await decrypt(newKey, passItem.value);

            return [
                passKey,
                {
                    ...passItem,
                    value: password,
                },
            ];
        });

        /*
         * `map` callbacks are synchronous. In order to use the async functions, like `decrypt`, in them,
         * I needed to wrap `decryptedPasswordPromises` with `Promise.all`
         * so Promises in the map callbacks can be fulfilled.
         */
        const decryptedPasswordArray = await Promise.all(decryptedPasswordsPromises);
        const decryptedPasswords = Object.fromEntries(decryptedPasswordArray);

        setDecryptedPasswords(decryptedPasswords);
    }

    function handleSuccess(newKey: CryptoKey) {
        const run = async () => {
            try {
                await hydratePasswords(newKey);
            } catch (e) {
                return;
            }
        };

        setLoading(true);
        run().finally(() => setLoading(false));
    }

    useEffect(() => {
        const rawCryptoKey = storage.getItem<string>(CRYPTO_KEY_STORAGE_KEY);

        if (!rawCryptoKey) {
            setLoading(false);
            return;
        }

        getKey(base64StringToUint8Array(rawCryptoKey)).then((storedKey) => {
            setKey(storedKey);
            handleSuccess(storedKey);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        async function sync() {
            if (!key || !passwordOpsFlag) {
                return;
            }

            const encryptedPasswordsPromises = Object.entries(decryptedPasswords).map(async ([passKey, passItem]) => {
                const password = await encrypt(key, passItem.value);

                return [
                    passKey,
                    {
                        ...passItem,
                        value: password,
                    },
                ];
            });

            const encryptedPasswordsArray = await Promise.all(encryptedPasswordsPromises);
            const encryptedPasswords = Object.fromEntries(encryptedPasswordsArray);
            storage.setItem(PASSWORDS_STORAGE_KEY, encryptedPasswords);
            setPasswordOpsFlag(false);
        }

        sync();
    }, [key, passwordOpsFlag]);

    function handleLogout() {
        storage.removeItem(CRYPTO_KEY_STORAGE_KEY);
        storage.flushCache();
        setKey(null);
    }

    function handlePasswordCreated(password: Password) {
        setDecryptedPasswords((passwords) => ({
            ...passwords,
            [password.id]: password,
        }));
    }

    async function handlePasswordEdited(password: Password) {
        const nextPasswords = {
            ...decryptedPasswords,
            [password.id]: {
                ...password,
                lastModifiedAt: Date.now(),
            },
        };

        const duplicateUrls = duplicateUrlsAmongPasswords(decryptedPasswords);

        if (duplicateUrls) {
            /*
             * if there are duplicate urls among the passwords alert a message such as
             * 'Duplicate url "https://foobar.com" found for passwords "foo", "bar", "baz"'
             */
        }

        setDecryptedPasswords(nextPasswords);
        setPasswordOpsFlag(true);
    }

    function handlePasswordDeleted(id: string) {
        setDecryptedPasswords((passwords) => {
            const { [id]: deleted, ...remaining } = passwords;

            return remaining;
        });
        setPasswordOpsFlag(true);
    }

    if (loading) {
        return <>Loading</>;
    }

    if (!key) {
        return <PasswordLockedContainer onSuccess={handleSuccess} />;
    }

    return (
        <PasswordMainContainer
            decryptedPasswords={decryptedPasswords}
            onLogout={handleLogout}
            onPasswordCreated={handlePasswordCreated}
            onPasswordEdited={handlePasswordEdited}
            onPasswordDeleted={handlePasswordDeleted}
        />
    );
}

export default App;
