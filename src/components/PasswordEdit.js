import React, { useCallback, useState } from 'react';

import Icon from '../atoms/Icon';
import LabelledIconButton from './LabelledIconButton';
import classes from './PasswordEdit.module.css';
import Labelled from '../atoms/Labelled';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import List from '../atoms/List';
import ListItem from '../atoms/ListItem';
import clsx from 'clsx';
import TextArea from '../atoms/TextArea';

/*
 * Making up a unique key value for primitive arrays always challenging.
 * I came up with the idea that using domain names from the given urls as `key`.
 * I assume all the URL in the list are unique and not repetation of another, so they can be used
 * as `key` for the iteration.
 *
 */
const UrlList = React.memo(({ urls, onDelete, onChange }) => (
    <List className={classes.urlList}>
        {urls?.map((urlEntry, index) => (
            <ListItem key={urlEntry.split('.').at(-2)} className={classes.urlListItem} dense>
                <input autoFocus value={urlEntry} onChange={(e) => onChange(index, e)} />
                <Icon onClick={() => onDelete(index)} size="small" className="fas fa-times" />
            </ListItem>
        ))}
        {urls?.length === 0 && (
            <ListItem dense className={clsx(classes.urlListItem, classes.urlListItemEmpty)}>
                No urls added
            </ListItem>
        )}
    </List>
));

/*
 * Those fields have inputs below so they need initial values in order to be controlled inputs.
 *
 */
const blankFormValues = {
    name: '',
    description: '',
    value: '',
    url: [],
};

function PasswordEdit({ password, onSave, onDelete, onCancel }) {
    const [values, setValues] = useState({ ...blankFormValues, ...password });

    const [urlInput, setUrlInput] = useState('');

    function change(partial) {
        setValues((values) => ({
            ...values,
            ...partial,
        }));
    }

    function handleChange(e) {
        change({ [e.target.name]: e.target.value });
    }

    function handleSaveClick() {
        onSave({
            ...password,
            ...values,
        });
    }

    function handleDeleteClick() {
        onDelete();
    }

    function handleCancelClick() {
        onCancel();
    }

    function handleUrlAdd() {
        const urls = Array.from(values.url || []);

        urls.unshift(urlInput);

        change({ url: urls });

        setUrlInput('');
    }

    const handleUrlDelete = useCallback(
        (index) => {
            const urls = Array.from(values.url || []);

            urls.splice(index, 1);

            change({ url: urls });
        },
        [values.url]
    );

    const handleUrlChange = useCallback(
        (index, event) => {
            const urls = Array.from(values.url || []);

            urls[index] = event.target.value;

            change({ url: urls });
        },
        [values.url]
    );

    return (
        <div className={classes.container}>
            <h2 className={classes.title}>
                <input
                    autoFocus
                    className={classes.titleInput}
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                />
            </h2>
            <div className={classes.content}>
                <Labelled label="description">
                    <TextArea name="description" value={values.description} onChange={handleChange} />
                </Labelled>

                <Labelled label="value">
                    <Input name="value" value={values.value} onChange={handleChange} />
                </Labelled>

                <Labelled label="url">
                    <div>
                        <Input
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            style={{ marginRight: 4 }}
                        />

                        <Button onClick={handleUrlAdd}>Add</Button>
                    </div>

                    <UrlList urls={values.url} onChange={handleUrlChange} onDelete={handleUrlDelete} />
                </Labelled>
            </div>
            <div className={classes.controls}>
                <LabelledIconButton
                    label="Cancel"
                    className={classes.cancel}
                    onClick={handleCancelClick}
                    icon={<Icon size="small" className="fas fa-times" />}
                />

                <LabelledIconButton
                    label="Save"
                    onClick={handleSaveClick}
                    icon={<Icon size="small" className="fas fa-save" />}
                />

                <LabelledIconButton
                    label="Delete"
                    className={classes.delete}
                    onClick={handleDeleteClick}
                    icon={<Icon size="small" className="fas fa-trash" />}
                />
            </div>
        </div>
    );
}

export default PasswordEdit;
