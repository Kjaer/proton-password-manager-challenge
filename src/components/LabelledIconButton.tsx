import React from 'react';

import classes from './LabelledIconButton.module.css';
import Button, { ButtonProps } from '../atoms/Button';
import clsx from 'clsx';

interface LabelledIconButtonProps extends ButtonProps {
    label: string;
    icon: React.ReactNode;
    className?: string;
}

function LabelledIconButton({ label, icon, className, ...rest }: LabelledIconButtonProps) {
    return (
        <Button className={clsx(classes.container, className)} {...rest}>
            <span className={classes.icon}>{icon}</span>
            {label}
        </Button>
    );
}

export default LabelledIconButton;
