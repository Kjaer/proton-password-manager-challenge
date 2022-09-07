import React from 'react';

import classes from './Label.module.css';

interface LabelledProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
}

function Labelled({ label, children, ...rest }: LabelledProps) {
    return (
        <div {...rest}>
            <span className={classes.label}>{label}</span>
            {children}
        </div>
    );
}

export default Labelled;
