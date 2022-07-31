import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { ApiMessage, UserData } from "types/api";
import LoadingPage from "components/loading";
import LoginPage from "components/login";
import { NextPage } from "next";

function MyApp({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<UserData | null | undefined>(undefined);

    useEffect(() => {
        fetch("api/auth/login", {
            method: "GET",
            headers: {
                authorization: localStorage.getItem('auth') || ""
            }
        })
            .then((response) => response.json())
            .then((data) => setUser(data.user || null));
    }, []);

    if (user === undefined) {
        return <LoadingPage />;
    }

    if (user == null) {
        return <LoginPage onLogin={({sid,user}) => {
            localStorage.setItem('auth',sid);
            setUser(user);
        }} />;
    }

    return (
        <>
            <Component {...pageProps} user = {user}/>
        </>
    );
}

export default MyApp;
