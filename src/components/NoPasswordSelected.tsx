import React from 'react';

import classes from './NoPasswordSelected.module.css';
import Icon from '../atoms/Icon';

function NoPasswordSelected() {
    return (
        <div className={classes.container}>
            <Icon className="fas fa-file" />
            <p>Select a password to view</p>
        </div>
    );
}

export default NoPasswordSelected;
