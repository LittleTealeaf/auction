export type UserData = {
    id: number;
    username: string;
    manageUsers: boolean;
    protected: boolean;
};

export type Method = "OPTIONS" | "GET" | "HEAD" | "PUT" | "POST" | "DELETE" | "PATCH";
