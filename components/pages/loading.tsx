import css from "styles/components/pages/loading.module.scss";
import Head from "next/head";
import { FC, lazy, Suspense } from "react";
import { Typography } from "@mui/material";

const LoadingPage: FC = ({}) => {
    const CircularProgress = lazy(() => import("@mui/material/CircularProgress"));

    return (
        <>
            <Head>
                <title>Loading...</title>
            </Head>
            <div className={css.root}>
                <div>
                    <Typography variant="h4">Loading</Typography>
                    <Suspense fallback={<></>}>
                        <CircularProgress size="100px" />
                    </Suspense>
                </div>
            </div>
        </>
    );
};

export default LoadingPage;
