import { NextPage } from "next";
import { UserData } from "types/api";

export type PageProps = {
    user: UserData;
};

export function PageRoot<T = {}>(page: NextPage<T & PageProps>): NextPage<T & PageProps> {
    return page;
}
