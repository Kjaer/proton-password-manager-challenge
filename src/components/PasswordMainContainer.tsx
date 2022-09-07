import React, { useState } from 'react';
import uniqid from 'uniqid';

import AppHeader from './AppHeader';
import Passwords from './Passwords';
import NoPasswordSelected from './NoPasswordSelected';
import NoPasswords from './NoPasswords';
import PasswordView from './PasswordView';
import PasswordEdit from './PasswordEdit';

import { Password } from '../models';
import classes from './PasswordMainContainer.module.css';

function createNewPassword() {
    const id = uniqid();

    // I added `createdAt` field here. It was in the interface but not added anywhere during the application.
    // This is the creation of the password, so it makes sense to set this field here.
    return {
        id,
        value: '',
        createdAt: Date.now(),
    } as Password;
}

interface Props {
    decryptedPasswords: { [key: string]: Password };
    onLogout: () => void;
    onPasswordCreated: (password: Password) => void;
    onPasswordEdited: (password: Password) => void;
    onPasswordDeleted: (id: string) => void;
}

const PasswordMain = ({
    decryptedPasswords,
    onLogout,
    onPasswordCreated,
    onPasswordEdited,
    onPasswordDeleted,
}: Props) => {
    const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(null);

    const [editing, setEditing] = useState(false);

    function handleCreatePassword() {
        const newPassword = createNewPassword();
        onPasswordCreated(newPassword);
        setSelectedPasswordId(newPassword.id);
        setEditing(true);
    }

    async function handleSelectPassword(id: string) {
        setSelectedPasswordId(id);
    }

    function handleDelete(id: string) {
        onPasswordDeleted(id);
        setEditing(false);
        setSelectedPasswordId(null);
    }

    function handleCancel() {
        setEditing(false);
    }

    function handlePasswordEditIntent() {
        setEditing(true);
    }

    function handleSave(password: Password) {
        onPasswordEdited(password);
        setEditing(false);
    }

    const amountOfVulnerablePasswords = Object.keys(decryptedPasswords).reduce<number>(
        (acc, key) => acc + +(decryptedPasswords[key].value.length < 3),
        0
    );

    return (
        <div className={classes.container}>
            <div className={classes.headerArea}>
                <AppHeader
                    editing={editing}
                    amountOfVulnerablePasswords={amountOfVulnerablePasswords}
                    onNewPassword={handleCreatePassword}
                    onLogout={onLogout}
                />
            </div>

            <div className={classes.passwordsArea}>
                {Object.values(decryptedPasswords).length > 0 ? (
                    <Passwords
                        passwords={decryptedPasswords}
                        editing={editing}
                        onSelectPassword={handleSelectPassword}
                    />
                ) : (
                    <NoPasswords />
                )}
            </div>

            <div className={classes.passwordArea}>
                {selectedPasswordId !== null ? (
                    editing ? (
                        <PasswordEdit
                            key={selectedPasswordId}
                            password={decryptedPasswords[selectedPasswordId]}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onDelete={() => handleDelete(selectedPasswordId)}
                        />
                    ) : (
                        <PasswordView
                            key={selectedPasswordId}
                            password={decryptedPasswords[selectedPasswordId]}
                            onEdit={handlePasswordEditIntent}
                        />
                    )
                ) : (
                    <NoPasswordSelected />
                )}
            </div>
        </div>
    );
};

export default PasswordMain;
