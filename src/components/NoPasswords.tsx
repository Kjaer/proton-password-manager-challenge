import React from 'react';

import classes from './NoPasswords.module.css';
import Icon from '../atoms/Icon';

function NoPasswords() {
    return (
        <div className={classes.container}>
            <Icon className="fas fa-list" />
            <p>Add your first password by clicking on "New Password"</p>
        </div>
    );
}

export default NoPasswords;
