import { useState } from 'react';

export default function useFieldValue(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setValue(e.target.value);
    }

    return [value, handleChange, setValue];
}
