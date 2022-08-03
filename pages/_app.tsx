import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { UserData } from "types/api";
import LoadingPage from "components/screen/loading";
import LoginPage from "components/screen/login";
import { fetchAPI } from "lib/app/fetch";
import Navigation, { drawerWidth } from "components/navigation";
import { Box } from "@mui/system";

function AppRoot({ Component, pageProps }: AppProps) {

    const [user, setUser] = useState<UserData | null | undefined>(undefined);

    useEffect(() => {
        const userCache = localStorage.getItem('user');

        if(userCache) {
            setUser(JSON.parse(userCache) as UserData);
        }

        fetchAPI("GET", "api/auth/login")
            .then((response) => response.json())
            .then((data) => data.user || null)
            .then((user) => {
                setUser(user);
                localStorage.setItem("user",JSON.stringify(user));
            });
    }, []);



    if (user === undefined) {
        return <>
        <LoadingPage />
        </>;
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

    return (
        <>
            <Navigation user={user} />
            <Box sx={{
                ml: { md: `${drawerWidth}px` },
                width: {md: `calc(100% - ${drawerWidth}px)`}
            }}>
                <Component {...pageProps} user={user} />
            </Box>
        </>
    );
}


export default AppRoot;
