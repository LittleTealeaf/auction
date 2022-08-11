export type UserData = {
    id: number;
    username: string;
    manageUsers: boolean;
    protected: boolean;
    requirePasswordReset: boolean;
};

export type Method = "OPTIONS" | "GET" | "HEAD" | "PUT" | "POST" | "DELETE" | "PATCH";
