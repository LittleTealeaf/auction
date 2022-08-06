import "styles/globals.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppProps } from "next/app";
import { UserData } from "types/api";
import { useEffect, useState } from "react";
import { fetchApi, jsonResponse, requireStatus } from "lib/app/api";
import LoadingPage from "components/pages/loading";
import LoginPage from "components/pages/login";
import { setSessionId } from "lib/app/session";

export default function App({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<UserData | null | undefined>(undefined);

    useEffect(() => {
        fetchApi("/api/auth/login", "GET")
            .then(requireStatus(200))
            .then(jsonResponse)
            .then((json) => {
                setUser(json.user);
            })
            .catch((reason) => {
                setUser(null);
            });
    }, []);

    if (user === undefined) {
        return <LoadingPage />;
    }

    if (!user) {
        return (
            <LoginPage
                callback={(sid, user) => {
                    setSessionId(sid);
                    setUser(user);
                }}
            />
        );
    }

    return <Component {...pageProps} user={user} />;
}

/*
<Button // MUI Button
  href="/employees"
  component="a"
  LinkComponent={Link} // NextJS Link
>
  Manage Employees
</Button>
*/
