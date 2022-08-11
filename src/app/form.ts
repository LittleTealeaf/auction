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
    return event.currentTarget.elements.namedItem(name) as Element & T;
}
