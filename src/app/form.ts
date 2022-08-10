import { FormEvent } from "react";

export type ElementTypes = {
    TextField: {
        value: string;
    }
}

export function getFormElement<T = {}>(event: FormEvent<HTMLFormElement>, name: string) {
    return event.currentTarget.elements.namedItem(name) as Element & T
}
