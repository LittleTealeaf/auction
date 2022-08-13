import css from "styles/pages/users.module.scss";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Refresh as RefreshIcon, Save as SaveIcon } from "@mui/icons-material";
import {
    Alert,
    AlertTitle,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Fab,
    FormControlLabel,
    IconButton,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { FC, FormEventHandler, useState } from "react";
import { compileResponse, fetchApi, jsonResponse, onCatch, onCompiledDefault, onCompiledStatus, requireStatus } from "src/app/api";
import useSWR from "swr";
import { UserData } from "types/api";
import useWindowSize from "src/hooks/useWindowSize";
import LoadingElement from "components/LoadingElement";
import { FormTypes, getFormElement } from "src/app/form";
import { GetStaticProps } from "next";
import { database } from "src/database";
import { MakeRestrictedPage } from "src/react/wrappers";

type Props = {
    userCount: number;
};

export default MakeRestrictedPage<Props>(
    (user) => user.manageUsers,
    ({ user, userCount }) => {
        const {
            data: users,
            mutate,
            isValidating,
        } = useSWR<UserData[]>(
            "api/users",
            () =>
                fetchApi("api/users", "GET")
                    .then(requireStatus(200))
                    .then(jsonResponse)
                    .then((json) => json.users)
                    .catch(onCatch([])),
            {
                revalidateOnFocus: true,
                refreshInterval: 1000 * 60,
                revalidateOnReconnect: true,
            }
        );

        const [editIndex, setEditIndex] = useState(-1);
        const [isEditing, setIsEditing] = useState(false);

        const editingUser = !users || editIndex == -1 ? null : users[editIndex];

        function editUser(index: number) {
            setEditIndex(index);
            setIsEditing(true);
        }

        return (
            <>
                <TableContainer component={Paper}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Permissions</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => isValidating || mutate(undefined)}>
                                        <RefreshIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users ? users.map((item, index) => <UserRow index={index} user={item} key={item.id} onEditRequest={editUser} />) : <PlaceHolder userCount={userCount} />}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Fab disabled={!users} className={css.fab} color="primary" aria-label="add" onClick={() => editUser(-1)}>
                    <AddIcon />
                </Fab>
                <EditUser
                    open={isEditing}
                    user={editingUser}
                    onClose={() => {
                        setIsEditing(false);
                        mutate();
                    }}
                />
            </>
        );
    }
);

const PlaceHolder: FC<{ userCount: number }> = ({ userCount }) => {
    return (
        <>
            {Array(userCount).fill(
                <TableRow>
                    <TableCell>
                        <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" />
                    </TableCell>
                    <TableCell align="right">
                        <Skeleton variant="text" />
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

const UserRow: FC<{ user: UserData; index: number; onEditRequest: (index: number) => void }> = ({ user, index, onEditRequest: onClick }) => {
    const permissions: string[] = [];

    if (user.manageUsers) permissions.push("Manage Users");

    return (
        <TableRow>
            <TableCell>{user.username}</TableCell>
            <TableCell>{permissions.join(", ")}</TableCell>
            <TableCell align="right">
                <IconButton onClick={() => onClick(index)}>
                    <EditIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

const EditUser: FC<{ open: boolean; user: UserData | null; onClose: () => void }> = ({ open, user, onClose }) => {
    const { width } = useWindowSize();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const username = getFormElement<FormTypes["TextField"]>(event, "username")?.value;
        const password = getFormElement<FormTypes["TextField"]>(event, "password")?.value;
        const manageUsers = getFormElement<FormTypes["Checkbox"]>(event, "manageUsers")?.checked;

        setError(null);

        const endpoint = user ? `api/users/${user.id}` : "api/users";
        const method = user ? "PUT" : "POST";

        fetchApi(endpoint, method, {
            username,
            password,
            manageUsers,
        })
            .then(compileResponse)
            .then(onCompiledStatus(200, (_) => onClose()))
            .then(onCompiledStatus(201, (_) => onClose()))
            .then(
                onCompiledDefault((json) => {
                    setError(json.message);
                })
            )
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    if (!open && isSubmitting) {
        setIsSubmitting(false);
    }

    if (!open && error) {
        setError(null);
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={(width && width <= 600) || false}
            scroll="paper"
            sx={{
                minWidth: "400px",
            }}
        >
            <form onSubmit={onSubmit}>
                <DialogTitle>{(user && `Editing ${user.username}`) || "Create User"}</DialogTitle>
                <DialogContent>
                    <Divider>
                        <Typography>User Info</Typography>
                    </Divider>
                    <div className={css.editor_content}>
                        <TextField id="username" variant="standard" label="username" defaultValue={(user && user.username) || ""} required />
                        <TextField id="password" variant="standard" type="password" label="password" />
                    </div>
                </DialogContent>
                <DialogContent>
                    <Divider>
                        <Typography>Permissions</Typography>
                    </Divider>
                    <div className={css.editor_permissions}>
                        <FormControlLabel control={<Checkbox id="manageUsers" defaultChecked={(user && user.manageUsers) || false} />} label="Manage Users" />
                    </div>
                </DialogContent>
                {error && (
                    <DialogContent>
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {error}
                        </Alert>
                    </DialogContent>
                )}
                <DialogActions className={css.editor_actions}>
                    {user && (
                        <IconButton color="error" onClick={() => setIsDeleting(true)}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                    <div className={css.spacer} />
                    <Button disabled={isSubmitting} onClick={onClose}>
                        Cancel
                    </Button>
                    <LoadingElement active={isSubmitting}>
                        <Button disabled={isSubmitting} type="submit" variant="contained" startIcon={<SaveIcon />}>
                            Save
                        </Button>
                    </LoadingElement>
                </DialogActions>
            </form>
            {user && (
                <DeleteUserDialog
                    user={user}
                    open={isDeleting}
                    onDeleteUser={() => {
                        setIsDeleting(false);
                        onClose();
                    }}
                    onCancel={() => setIsDeleting(false)}
                    onError={setError}
                />
            )}
        </Dialog>
    );
};

const DeleteUserDialog: FC<{
    user: UserData;
    open: boolean;
    onDeleteUser: () => void;
    onCancel: () => void;
    onError: (error: string) => void;
}> = ({ user, open, onDeleteUser, onCancel, onError }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    function handleDelete() {
        setIsProcessing(true);
        fetchApi(`api/users/${user.id}`, "DELETE")
            .then(compileResponse)
            .then(onCompiledStatus(200, onDeleteUser))
            .then(
                onCompiledDefault((json) => {
                    onError(json.message);
                    onCancel();
                })
            )
            .finally(() => setIsProcessing(false));
    }

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{"Delete User"}</DialogTitle>
            <DialogContentText style={{ padding: "10px" }}>{`Are you sure you want to delete ${user.username}?`}</DialogContentText>
            <DialogActions>
                <Button variant="contained" onClick={onCancel}>
                    Cancel
                </Button>
                <div
                    style={{
                        marginLeft: "10px",
                    }}
                >
                    <LoadingElement active={isProcessing}>
                        <Button disabled={isProcessing} variant="contained" onClick={handleDelete} startIcon={<DeleteIcon />} color="error">
                            Delete
                        </Button>
                    </LoadingElement>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const users = await database.user.findMany();

    return {
        props: {
            userCount: users.length,
        },
        revalidate: 60 * 5,
    };
};
