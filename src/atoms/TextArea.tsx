import clsx from 'clsx';
import React from 'react';

import classes from './Input.module.css';

interface Props extends React.ComponentProps<'textarea'> {}

function TextArea({ className, ...rest }: Props) {
    return <textarea className={clsx(className, classes.root)} {...rest} />;
}

export default TextArea;
