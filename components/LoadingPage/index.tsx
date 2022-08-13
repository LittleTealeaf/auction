import css from "./style.module.scss";
import Head from "next/head";
import { FC, lazy, Suspense } from "react";
import { MakeFC } from "src/react/wrappers";

const CircularProgress = lazy(() => import("@mui/material/CircularProgress"));
const Typography = lazy(() => import("@mui/material/Typography"));

export default MakeFC(() => (
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
));
