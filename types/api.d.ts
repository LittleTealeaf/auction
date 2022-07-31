import { User } from "@prisma/client";

export type ApiMessage = {
    message: string;
}

export type UserData = {
    username: string;
    manageUsers: boolean;
};
