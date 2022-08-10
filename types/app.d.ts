import { NextPage } from "next";
import { UserData } from "./api";

export type AppPage<T = {}> = NextPage<
    {
        user: UserData;
    } & T
>;

export type MuiIcon = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
};
