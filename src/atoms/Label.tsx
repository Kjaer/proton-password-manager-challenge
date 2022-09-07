import clsx from 'clsx';
import React from 'react';

import classes from './Label.module.css';

interface LabelledProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
}

function Labelled({ label, className, children, ...rest }: LabelledProps) {
    return (
        <div className={clsx(className, classes.root)} {...rest}>
            <span className={classes.label}>{label}</span>
            {children}
        </div>
    );
}

export default Labelled;
