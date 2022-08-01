import { FormEvent } from "react";

export function getElementFromForm<T extends Element | RadioNodeList | null>(event: FormEvent<HTMLFormElement>, id: string) {
    return event.currentTarget.elements.namedItem(id) as T;
}

export type FormMap = {
    [key: string]: Element | RadioNodeList
}

export function getFormElements(event: FormEvent<HTMLFormElement>, ids: string[]) {

    const map: FormMap = {}

    ids.forEach(id => {
        const element = event.currentTarget.elements.namedItem(id);
        if(element != null) {
            map[id] = element;
        }
    })

    return map;

}
