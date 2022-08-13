import RestrictedPage from "components/RestrictedPage";
import { FC } from "react";
import { UserData } from "types/api";
import { AppPage } from "types/app";

export function MakeFC<T = {}>(component: FC<T>) {
    return component;
}

export function MakePage<T = {}>(content: AppPage<T>) {
    return content;
}

export function MakeRestrictedPage<T = {}>(check: (user: UserData) => boolean, Content: AppPage<T>) {
    const Page: AppPage<T> = (props) => {
        if(check(props.user)) {
            return <Content {...props} />
        }
        return <RestrictedPage />
    }
}
