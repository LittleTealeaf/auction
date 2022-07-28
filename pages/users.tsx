import { Skeleton, Table, TableBody, TableCell, TableHead } from "@mui/material";
import { Permissions, User } from "@prisma/client";
import ForbiddenPage from "components/forbidden";
import { fetchAuth, fetchEffect } from "lib/fetch";
import { useEffect, useState } from "react";
import { useAuthContext } from "./_app";

function UserTable({}: {}) {
    const [users, setUsers] = useState<User[] | undefined>(undefined);
    const [permissions, setPermissions] = useState<Permissions[] | undefined>(undefined);

    useEffect(() => fetchEffect(setUsers, "user", {}), []);

    return (
        <Table>
            <TableHead>
                <TableCell>Username</TableCell>
                <TableCell>Password</TableCell>
                <TableCell></TableCell>
            </TableHead>
            <TableBody>
                {users === undefined ? (
                    <>
                        <TableCell>
                            <Skeleton variant="text"></Skeleton>
                        </TableCell>
                    </>
                ) : (
                    users.map((user) => (
                        <>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.password}</TableCell>
                        </>
                    ))
                )}
            </TableBody>
        </Table>
    );
}

export default function Page({}) {
    const [permissions, setPermissions] = useState<{ manageUser: boolean } | null>(null);

    useEffect(() => fetchEffect(setPermissions, "permissions", {}), []);

    if (permissions == null) {
        return <>loading</>;
    }

    if (!permissions.manageUser) return <ForbiddenPage />;

    return <UserTable />;
}
