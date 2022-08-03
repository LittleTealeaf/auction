import { Dialog, Fab, IconButton, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from "@mui/material";
import { User } from "@prisma/client";
import ForbiddenPage from "components/screen/forbidden";
import { fetchAPI, getStatusJson } from "lib/app/fetch";
import { FC, useEffect, useState } from "react";
import { AppPage } from "types/app";
import css from "styles/users.module.scss";
import { Add as AddIcon, Edit as EditIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { GetStaticProps } from "next";
import { database } from "lib/api/prisma";

type UserPageProps = {
    userCount: number;
};

const Page: AppPage<UserPageProps> = ({ user, userCount }) => {
    if (!user.manageUsers) return <ForbiddenPage />;
    return <PageContent userCount={userCount} />;
};

const PageContent: FC<UserPageProps> = ({ userCount }) => {
    const [users, setUsers] = useState<User[] | undefined>(undefined);

    const [editIndex, setEditIndex] = useState(-1);

    function loadUsers() {
        setUsers(undefined);
        fetchAPI("GET", "api/user").then(getStatusJson(200)).then(setUsers);
    }

    useEffect(loadUsers, []);

    return (
        <>
            <Fab color="primary" className={css.fab}>
                <AddIcon />
            </Fab>
            <TableContainer className={css.container}>
                <Table aria-label="Users Table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Permissions</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={loadUsers}>
                                    <RefreshIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{users == undefined ? <SkeletonData userCount={userCount} /> : users.map(MakeUserRow(setEditIndex))}</TableBody>
                </Table>
            </TableContainer>
            <EditUser user={!users || editIndex === -1 || editIndex === users?.length ? undefined : users[editIndex]} open={editIndex !== -1} handleClose={() => setEditIndex(-1)} />
        </>
    );
};

const EditUser: FC<{ user?: User; open: boolean; handleClose: () => void }> = ({ user, open, handleClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return <Dialog  fullScreen={fullScreen} open={open} onClose={handleClose}>
        <div className={css.edit}>
            
        </div>
    </Dialog>;
};

const MakeUserRow = (editUser: (index: number) => void) =>
    function UserRow(user: User, index: number) {
        const perms: string[] = [];

        if (user.manageUsers) perms.push("Manage Users");

        return (
            <TableRow>
                <TableCell>{user.username}</TableCell>
                <TableCell>{perms.join(", ")}</TableCell>
                <TableCell align="right">
                    <IconButton onClick={() => editUser(index)}>
                        <EditIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    };

const SkeletonData: FC<UserPageProps> = ({ userCount }) => {
    return (
        <>
            {Array(userCount)
                .fill(undefined)
                .map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton variant="rectangular" />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="rectangular" />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="rectangular" />
                        </TableCell>
                    </TableRow>
                ))}
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const users = await database.user.findMany();

    return {
        props: {
            userCount: users.length,
        },
        revalidate: 60 * 60,
    };
};

export default Page;
