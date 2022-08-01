import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import { MouseEventHandler, useEffect, useState } from "react";
import { UserData } from "types/api";
import LoadingPage from "components/screen/loading";
import LoginPage from "components/screen/login";
import { fetchAPI } from "lib/app/fetch";
import { AppBar, Box, Container, Drawer, IconButton, List, Menu, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

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
            {/* <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: {
                                    xs: "flex",
                                    md: "none",
                                },
                            }}
                        >
                            <IconButton size="large" aria-label="open menu" color="inherit" aria-haspopup="true" aria-controls="menu-appbar" onClick={handleOpenNavMenu}>
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Drawer open={showDrawer} onClose={() => setShowDrawer(false)}>
                <List></List>
            </Drawer> */}
            <Component {...{ ...pageProps, user }} />
        </>
    );
}

export default AppRoot;
