import { FC } from "react";
import { UserData } from "types/api";
import { AppPage } from "types/app";

export default function RestrictedPage<T = {}>(permission: (user: UserData) => boolean, Content: FC<T & { user: UserData }>): AppPage<T> {
    const Page: AppPage<T> = (props) => {
        if (permission(props.user)) {
            return <Content {...props} />;
        }
        return (
            <>
                <div>Invalid Permissions</div>
            </>
        );
    };
    return Page;
}
