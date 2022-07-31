import { CircularProgress, Grid } from "@mui/material";
import { FC } from "react";



const LoadingPage: FC = () => {
    return (
        <Grid
            justifyContent="center"
            alignItems="center"
            style={{
                width: "100%",
                height: "100vh",
                display: 'flex'
            }}
        >
            <CircularProgress
                size='30vw'
            />
        </Grid>
    );
};

export default LoadingPage;
