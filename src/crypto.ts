import { EncryptedPasswordFields } from './models';

// eslint-disable-next-line
const IV = 16;
const ALGORITHM = 'AES-GCM';

export function uint8ArrayToBase64String(array: Uint8Array) {
    // @ts-ignore
    return btoa(String.fromCharCode(...array));
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
    return uint8ArrayToBase64String(new Uint8Array(buffer));
}

export function base64StringToUint8Array(string: string) {
    return new Uint8Array(
        atob(string)
            .split('')
            .map((c) => {
                return c.charCodeAt(0);
            })
    );
}

const rawSalt = new Uint8Array([105, 51, 114, 88, 66, 177, 134, 177, 111, 198, 93, 241, 250, 203, 226, 191]);

export async function getDerivation(password: string, iterations = 339616) {
    const textEncoder = new TextEncoder();
    const passwordBuffer = textEncoder.encode(password);
    const importedKey = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveBits']);

    return crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            hash: 'SHA-256',
            salt: rawSalt,
            iterations,
        },
        importedKey,
        256
    );
}

export async function encrypt(key: CryptoKey, message: string) {
    const textEncoder = new TextEncoder();
    const encoded = textEncoder.encode(message);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const cipher = await window.crypto.subtle.encrypt(
        {
            name: ALGORITHM,
            iv,
        },
        key,
        encoded
    );

    return {
        iv: uint8ArrayToBase64String(iv),
        cipher: arrayBufferToBase64(cipher),
    };
}

export async function decrypt(key: CryptoKey, { iv, cipher }: EncryptedPasswordFields) {
    const textDecoder = new TextDecoder();
    const ivArr = base64StringToUint8Array(iv);
    const cipherArr = base64StringToUint8Array(cipher);

    const decryptedResult = await crypto.subtle.decrypt(
        {
            name: ALGORITHM,
            iv: ivArr,
        },
        key,
        cipherArr
    );

    return textDecoder.decode(decryptedResult);
}

export async function getKey(rawKey: ArrayBuffer) {
    return window.crypto.subtle.importKey('raw', rawKey, ALGORITHM, false, ['encrypt', 'decrypt']);
}
