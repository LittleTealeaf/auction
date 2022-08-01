import { CircularProgress, Grid } from "@mui/material";
import Head from "next/head";
import { FC } from "react";

const LoadingPage: FC = () => {
    return (
        <>
            <Head>
                <title>Loading...</title>
            </Head>
            <Grid
                justifyContent="center"
                alignItems="center"
                style={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                }}
            >
                <CircularProgress size="20vw" />
            </Grid>
        </>
    );
};

export default LoadingPage;
