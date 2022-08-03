import { User } from "@prisma/client";

export type ApiMessage = {
    message: string;
}

export type UserData = {
    id: number;
    username: string;
    manageUsers: boolean;
    protected: boolean;
};

export type ApiMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT" | "OPTIONS" | "HEAD";
