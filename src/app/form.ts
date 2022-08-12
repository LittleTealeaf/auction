import { FormEvent } from "react";

export type FormTypes = {
    TextField: {
        value: string;
    };
    Checkbox: {
        checked: boolean;
    }
};

export function getFormElement<T = {}>(event: FormEvent<HTMLFormElement>, name: string) {
    const element = event.currentTarget.elements.namedItem(name);
    return !element ? undefined : element as Element & T;
    // return event.currentTarget.elements.namedItem(name) as Element & T;
}
