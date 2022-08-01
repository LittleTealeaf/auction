import { FormEvent } from "react";

export function getFormElement<T extends Element | RadioNodeList | null>(event: FormEvent<HTMLFormElement>, id: string) {
    return event.currentTarget.elements.namedItem(id) as T;
}
