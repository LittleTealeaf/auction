import { Button, Dialog, Fab, IconButton, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { User } from "@prisma/client";
import ForbiddenPage from "components/screen/forbidden";
import { fetchAPI, getStatusJson } from "lib/app/fetch";
import { FC, FormEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { AppPage } from "types/app";
import css from "styles/users.module.scss";
import { Add as AddIcon, Edit as EditIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { GetStaticProps } from "next";
import { prisma } from "lib/api/database";
import LoadingElement from "components/loading";

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
    const [showEditor, setShowEditor] = useState(false);

    function loadUsers() {
        setUsers(undefined);
        fetchAPI("GET", "api/user").then(getStatusJson(200)).then(setUsers);
    }

    function editUser(index: number) {
        setEditIndex(index);
        setShowEditor(true);
    }

    function closeEditor() {
        setShowEditor(false);
    }

    useEffect(loadUsers, []);

    return (
        <>
            <Fab color="primary" className={css.fab} onClick={() => editUser(-1)}>
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
                    <TableBody>{users == undefined ? <SkeletonData userCount={userCount} /> : users.map(MakeUserRow(editUser))}</TableBody>
                </Table>
            </TableContainer>
            <Editor user={users ? users[editIndex] || undefined : undefined} open={showEditor} handleClose={closeEditor} />
        </>
    );
};

const Editor: FC<{ user?: User; open: boolean; handleClose: () => void }> = ({ user, open, handleClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [error, setError] = useState<string | undefined>(undefined);

    const title = user ? `Editing ${user.username}` : "Creating User";

    const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {};

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
            <div className={css.edit}>
                <Typography variant="h3">{title}</Typography>
                <form {...{ onSubmit }}>
                    <div className="userpass">
                        <TextField id="username" label="username" variant="standard" required error={error != null} value={user?.username} />
                    </div>
                </form>
            </div>
        </Dialog>
    );
};

const EditorSetPassword: FC<{ user?: User; open: boolean; fullScreen: boolean; handleClose: () => void }> = ({ user, open, handleClose, fullScreen }) => {
    return <Dialog {...{ fullScreen, open }} onClose={handleClose}>

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
    const skeletons = Array(userCount)
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
        ));

    return <>{skeletons}</>;
};

export const getStaticProps: GetStaticProps = async (context) => {
    const users = await prisma.user.findMany();

    return {
        props: {
            userCount: users.length,
        },
        revalidate: 60 * 60,
    };
};

export default Page;
