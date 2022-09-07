import React from 'react';

import Button from '../atoms/Button';
import Header from '../atoms/Header';
import Icon from '../atoms/Icon';
import classes from './AppHeader.module.css';
interface Props {
    editing: boolean;
    amountOfVulnerablePasswords: number;
    onLogout: () => void;
    onNewPassword: () => void;
}

function AppHeader(props: Props) {
    const { editing, amountOfVulnerablePasswords, onLogout, onNewPassword } = props;

    return (
        <Header className={classes.header}>
            <Button disabled={editing} onClick={onNewPassword}>
                New Password
            </Button>

            {amountOfVulnerablePasswords > 0 && (
                <span>
                    You have {amountOfVulnerablePasswords} vulnerable passwords
                    <Icon size="small" style={{ marginLeft: 8 }} className="fas fa-exclamation-triangle" />
                </span>
            )}

            <Button onClick={onLogout}>Logout</Button>
        </Header>
    );
}

export default AppHeader;
