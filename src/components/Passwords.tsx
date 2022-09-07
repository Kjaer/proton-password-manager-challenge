import React from 'react';
import clsx from 'clsx';

import { Password } from '../models';
import List from '../atoms/List';
import PasswordListItem from './PasswordListItem';
import classes from './Passwords.module.css';

interface Props {
    editing: boolean;
    passwords: { [key: string]: Password };
    onSelectPassword: (id: string) => void;
}

function Passwords({ editing, passwords, onSelectPassword }: Props) {
    function handleClick(password: Password) {
        onSelectPassword(password.id);
    }

    return (
        <List className={clsx(classes.passwords, { [classes.disabled]: editing })}>
            {Object.values(passwords).map((password) => (
                <PasswordListItem
                    key={password.id}
                    name={password.name}
                    disabled={editing}
                    onClick={() => handleClick(password)}
                    vulnerable={password.value.length < 2}
                />
            ))}
        </List>
    );
}

export default Passwords;
