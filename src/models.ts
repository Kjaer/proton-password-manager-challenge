export interface Password {
    id: string;
    name: string;
    description?: string;
    value: string;
    url: string[];
    createdAt: number;
    lastModifiedAt?: number;
}

// I decided to extract `iv` and `cipher` out to an interface, because I am using it multiple times/place.
export interface EncryptedPasswordFields {
    iv: string;
    cipher: string;
}

/*
 * I created this interface for the passwords that persisted in the localStorage.
 * Their password value is encrypted.
 * So it's not the same `Password` interface above.
 * In order to keep typing clear for the password those kept in the React Component state
 * and those kept in the localStorage.
 */
export interface EncryptedPassword extends Omit<Password, 'value'> {
    value: EncryptedPasswordFields;
}
