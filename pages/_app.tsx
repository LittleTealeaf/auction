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
import { fetchAPI } from "lib/fetchwrapper";

function MyApp({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<UserData | null | undefined>(undefined);

    useEffect(() => {
        fetchAPI('GET','api/auth/login')
            .then((response) => response.json())
            .then(data => data.user || null)
            .then(setUser);
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
