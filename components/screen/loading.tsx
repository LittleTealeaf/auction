import { CircularProgress, Typography } from "@mui/material";
import Head from "next/head";
import { FC } from "react";
import css from 'styles/loading.module.scss'

const LoadingPage: FC = () => {
    return (
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
};

export default LoadingPage;
