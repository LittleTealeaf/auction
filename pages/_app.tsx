import "styles/globals.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppProps } from "next/app";
import { UserData } from "types/api";
import { lazy, SetStateAction, Suspense, useEffect, useState } from "react";
import { fetchApi, jsonResponse, requireStatus } from "src/app/api";
import LoadingPage from "components/pages/loading";
import { setSessionId } from "src/app/session";

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
        const LoginPage = lazy(() => import("components/pages/login"));

        return (
            <Suspense fallback={<LoadingPage />}>
                <LoginPage
                    callback={(sid: string, user: SetStateAction<UserData | null | undefined>) => {
                        setSessionId(sid);
                        setUser(user);
                    }}
                />
            </Suspense>
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
