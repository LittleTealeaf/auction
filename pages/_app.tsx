import "styles/globals.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppProps } from "next/app";
import { UserData } from "types/api";
import { lazy, SetStateAction, Suspense } from "react";
import { fetchApi, jsonResponse, onCatch, requireStatus } from "src/app/api";
import LoadingPage from "components/LoadingPage";
import { setSessionId } from "src/app/session";
import PageWrapper from "components/Navigation";
import useSWR from "swr";

const LoginPage = lazy(() => import("components/LoginPage"));

export default function App({ Component, pageProps }: AppProps) {
    const { data: user, mutate } = useSWR<UserData | null>(
        "user",
        () =>
            fetchApi("/api/auth/login", "GET")
                .then(requireStatus(200))
                .then(jsonResponse)
                .then((json) => json.user)
                .catch(onCatch(null)),
        {
            revalidateOnFocus: true,
            refreshInterval: 1000 * 60,
            revalidateOnReconnect: true,
        }
    );

    if (user === undefined) {
        return <LoadingPage />;
    }

    if (!user) {
        return (
            <Suspense fallback={<LoadingPage />}>
                <LoginPage
                    callback={(sid: string, user: SetStateAction<UserData | null | undefined>) => {
                        setSessionId(sid);
                        // setUser(user);
                        mutate(user);
                    }}
                />
            </Suspense>
        );
    }

    return (
        <>
            <PageWrapper user={user}>
                <Component {...pageProps} user={user} />
            </PageWrapper>
        </>
    );
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
