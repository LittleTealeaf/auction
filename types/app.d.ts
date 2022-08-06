import { NextPage } from "next";
import { UserData } from "./api";

export type AppPage<T = {}> = NextPage<{
    user: UserData;
} & T>;
