import React from 'react';
import clsx from 'clsx';

import classes from './Icon.module.css';

export interface IconProps extends React.ComponentPropsWithoutRef<'i'> {
    size?: 'small' | 'medium' | 'large';
    color?: 'blue' | 'green' | 'purple';
}

function Icon({ className, size = 'medium', color, ...rest }: IconProps) {
    const rootClassName = clsx(classes.root, size && classes[size], color && classes[color], className);

    return <i className={rootClassName} {...rest} />;
}

export default Icon;
