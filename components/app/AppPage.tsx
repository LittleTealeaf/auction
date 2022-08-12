import css from 'styles/components/restrictedpage.module.scss'
import { FC } from "react";
import { UserData } from "types/api";
import { AppPage } from "types/app";

export function Page<T = {}>(page: AppPage<T>) {
    return page;
}

export function RestrictedPage<T = {}>(permission: (user: UserData) => boolean, Content: FC<T & { user: UserData }>): AppPage<T> {
    const Page: AppPage<T> = (props) => {
        if (permission(props.user)) {
            return <Content {...props} />;
        }
        return (
            <div className={css.root}>
                <div>
                    <h3>Forbidden Access</h3>
                    <p>You do not have permissions to view this page</p>
                </div>
            </div>
        );
    };
    return Page;
}
