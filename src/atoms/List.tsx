import React from 'react';
import clsx from 'clsx';

import classes from './List.module.css';

export type ListProps = React.ComponentPropsWithoutRef<'ul'>;

function List({ className, ...rest }: ListProps) {
    return <ul className={clsx(className, classes.root)} {...rest} />;
}

export default List;
