import css from "styles/components/pages/loading.module.scss";
import Head from "next/head";
import { FC } from "react";
import { CircularProgress, Typography } from "@mui/material";

const LoadingPage: FC = ({}) => (
    <>
        <Head>
            <title>Loading...</title>
        </Head>
        <div className={css.root}>
            <div>
                <Typography variant="h4">Loading</Typography>
                <CircularProgress size="100px" />
            </div>
        </div>
    </>
);

export default LoadingPage;
