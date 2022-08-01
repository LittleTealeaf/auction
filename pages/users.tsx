import {
    Button,
    Checkbox,
    Fab,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    IconButton,
    Modal,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import { User } from "@prisma/client";
import ForbiddenPage from "components/screen/forbidden";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { fetchAPI, getStatusJson } from "lib/fetchwrapper";
import { FC, FormEvent, FormEventHandler, useEffect, useState } from "react";
import { AppPage } from "types/app";
import classes from "styles/users.module.scss";
import { getFormElement } from "lib/formwrapper";

const Content: FC = () => {
    const [users, setUsers] = useState<User[] | undefined>(undefined);

    const [editing, setEditing] = useState(-1);

    const loadUsers = () => {
        fetchAPI("GET", "api/user").then(getStatusJson(200)).then(setUsers);
    }

    useEffect(loadUsers, []);
    return (
        <>
            <TableContainer
                component={Paper}
                style={{
                    margin: "auto",
                }}
            >
                <Table>
                    <TableHead>
                        <TableCell>Username</TableCell>
                        <TableCell>Password</TableCell>
                        <TableCell>Permissions</TableCell>
                        <TableCell></TableCell>
                    </TableHead>
                    <TableBody>
                        {users === undefined ? (
                            <>
                                <TableRow>
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
                            </>
                        ) : (
                            users.map((user, index) => <UserRow key={user.id} user={user} index={index} editUser={setEditing} />)
                        )}
                    </TableBody>
                    <Fab color="primary" aria-label="add" className={classes.fab}>
                        <AddIcon />
                    </Fab>
                </Table>
            </TableContainer>
            <EditUser user={!users || editing == -1 ? null : users[editing]} close={(refresh) => {
                setEditing(-1);
                if(refresh) {
                    loadUsers();
                }
            }} />
        </>
    );
};

type UserRowParams = { user: User; index: number; editUser: (index: number) => void };

const UserRow: FC<UserRowParams> = ({ user, index, editUser }) => {
    const [showPassword, setShowPassword] = useState(false);

    const permissions = [];

    if (user.manageUsers) permissions.push("Manage Users");

    return (
        <TableRow className={classes.table}>
            <TableCell>{user.username}</TableCell>
            <TableCell className={classes.password}>
                <IconButton aria-label="show password" onClick={(_) => setShowPassword(!showPassword)}>
                    <VisibilityIcon />
                </IconButton>
                {showPassword ? (
                    <span
                        style={{
                            flexGrow: "1",
                        }}
                    >
                        {user.password}
                    </span>
                ) : (
                    <Skeleton
                        variant="text"
                        style={{
                            flexGrow: "1",
                        }}
                    />
                )}
            </TableCell>
            <TableCell>{permissions.join(", ")}</TableCell>
            <TableCell>
                <IconButton aria-label="edit" onClick={(_) => editUser(index)}>
                    <EditIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

const EditUser: FC<{ user: User | null; close: (refresh: boolean) => void }> = ({ user, close }) => {


    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const data = {
            id: user?.id,
            username: getFormElement<Element & {value: string}>(event,'username').value,
            password: getFormElement<Element & {value: string}>(event, "password").value,
            manageUsers: getFormElement<Element & {checked: boolean}>(event,"manageUsers").checked
        }
        //TODO: PREVENT REMOVING YOUR OWN ACCESS


        fetchAPI('PUT','api/user',data).then(getStatusJson(200)).then((_) => close(true))
    }

    return (
        <Modal open={user != null} onClose={close} className={classes.edit}>
            <Paper elevation={10} className={classes.container}>
                <h1>Edit User</h1>
                <form onSubmit={onSubmit}>
                    <div className={classes.userpass}>
                        <TextField label="username" id="username" defaultValue={user?.username || ""} required />
                        <TextField label="password" id="password" defaultValue={user?.password || ""} />
                    </div>

                    <FormControl className={classes.permissions} sx={{ m: 3 }} component="fieldset" variant="standard">
                        <FormLabel component="legend">Permissions</FormLabel>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox id="manageUsers" defaultChecked={user?.manageUsers || false} />} label="Manage Users" />
                        </FormGroup>
                    </FormControl>
                    <FormControl className={classes.actions}>
                    <Button className={classes.submit} type="submit">Save</Button>
                    </FormControl>
                </form>
            </Paper>
        </Modal>
    );
};

const Page: AppPage = ({ user }) => {
    if (!user.manageUsers) return <ForbiddenPage />;
    return <Content />;
};

export default Page;
