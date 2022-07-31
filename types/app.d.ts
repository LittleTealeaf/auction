import { User } from "@prisma/client"
import { NextPage } from "next";
import { UserData } from "./api";


export type AppPage = NextPage<{
    user: UserData
}>;
