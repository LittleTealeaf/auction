import css from "./style.module.scss";
import Head from "next/head";
import { FC, lazy, Suspense } from "react";

const CircularProgress = lazy(() => import("@mui/material/CircularProgress"));
const Typography = lazy(() => import("@mui/material/Typography"));

const LoadingPage: FC = ({}) => {
    return (
        <>
            <Head>
                <title>Loading...</title>
            </Head>
            <div className={css.root}>
                <div>
                    <Suspense fallback={<h4>{"Loading..."}</h4>}>
                        <Typography variant="h4">Loading</Typography>
                        <CircularProgress size="100px" />
                    </Suspense>
                </div>
            </div>
        </>
    );
};

export default LoadingPage;
