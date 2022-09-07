import React from 'react';
import clsx from 'clsx';

import classes from './Button.module.css';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    color?: 'blue' | 'green' | 'light';
    appearance?: 'default' | 'solid';
}

function Button({ className, color, appearance = 'solid', ...rest }: ButtonProps) {
    const rootClassName = clsx(className, classes.root, color && classes[color], appearance && classes[appearance], {
        [classes.disabled]: rest.disabled,
    });

    return <button className={rootClassName} {...rest} />;
}

export default Button;
