import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import { createContext, useContext, useEffect, useState } from "react";
import LoginPage from "components/login";
import { Skeleton } from "@mui/material";

const AuthContext = createContext("");

function MyApp({ Component, pageProps }: AppProps) {
    const [auth, setAuth] = useState<string | null | undefined>(undefined);

    useEffect(() => {
        const local = sessionStorage.getItem("auth");
        if (local != null) {
            fetch("./api/login?auth=" + local)
                .then((response) => response.json())
                .then((json: { auth: string | null | undefined }) => json.auth)
                .then((auth) => {
                    setAuth(auth || null);
                });
        } else {
            setAuth(null);
        }
    }, []);

    if (auth === undefined) {
        return <Skeleton variant="rectangular" width={"100vw"} height="100vh" />;
    }

    if (auth == null) {
        return <LoginPage authAbsorber={setAuth} />;
    }

    sessionStorage.setItem("auth", auth);

    return (
        <AuthContext.Provider value={auth}>
            <Component {...pageProps} />
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}

export default MyApp;
