import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import { FC, MouseEventHandler, useEffect, useState } from "react";
import { UserData } from "types/api";
import LoadingPage from "components/screen/loading";
import LoginPage from "components/screen/login";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { fetchAPI } from "lib/app/fetch";
import { AppBar, Box, Button, Container, Drawer, IconButton, List, Menu, MenuItem, Toolbar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import css from "styles/app.module.scss";
import MenuIcon from "@mui/icons-material/Menu";
import { Logout } from "@mui/icons-material";

function AppRoot({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<UserData | null | undefined>(undefined);

    useEffect(() => {
        fetchAPI("GET", "api/auth/login")
            .then((response) => response.json())
            .then((data) => data.user || null)
            .then(setUser);
    }, []);

    if (user === undefined) {
        return <LoadingPage />;
    }

    if (user == null) {
        return (
            <LoginPage
                onLogin={({ sid, user }) => {
                    localStorage.setItem("auth", sid);
                    setUser(user);
                }}
            />
        );
    }

    return <AppPage {...{ Component, ...pageProps, user }} />;
}

function AppPage({ Component, pageProps, user }: AppProps & { user: UserData }) {
    const [showDrawer, setShowDrawer] = useState(false);

    const handleOpenNavMenu: MouseEventHandler<HTMLButtonElement> = (event) => {
        setShowDrawer(!showDrawer);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar className={css.toolbar}>
                    <div>serof</div>
                    <Spacer />
                    <UserProfile user={user} />
                </Toolbar>
            </AppBar>
            <Drawer open={showDrawer} onClose={() => setShowDrawer(false)}>
                <List></List>
            </Drawer>
            <Component {...{ ...pageProps, user }} />
        </>
    );
}

export const UserProfile: FC<{ user: UserData }> = ({ user }) => {


    const [anchorEl, setAnchorE1] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAnchorE1(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorE1(null);
    };

    const actionLogout = () => {
        fetchAPI('DELETE','api/auth/login').then(response => response.json()).then(data => {
            const {oldSid, message, error} = data;
            if(oldSid) {
                document.location.href="/"
            }
        })
    }

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<AccountCircleIcon />}
                id="userMenu"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                color="inherit"
            >
                {user.username}
            </Button>
            <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem onClick={actionLogout}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText>
                        {"Logout"}
                    </ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export const Spacer: FC = ({}) => <div className={css.spacer} />;

export default AppRoot;
