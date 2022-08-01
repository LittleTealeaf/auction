import { Button, CircularProgress, FormControl, FormHelperText, Grid, Paper, TextField } from "@mui/material";
import { FC, FormEventHandler, useState } from "react";
import { UserData } from "types/api";
import classes from "styles/login.module.scss";
import { fetchAPI } from "lib/fetchwrapper";

const LoginPage: FC<{
    onLogin: (result: { sid: string; user: UserData }) => void;
}> = ({ onLogin }) => {
    const [error, setError] = useState<String | null>(null);

    const [processing, setProcessing] = useState(false);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        setProcessing(true);
        setError(null);
        event.preventDefault();

        const username = (event.currentTarget.elements.namedItem("username") as { value: string }).value;
        const password = (event.currentTarget.elements.namedItem("password") as { value: string }).value;

        fetchAPI("POST", "api/auth/login", {
            username,
            password,
        })
            .then((response) => response.json())
            .then((data) => {
                setProcessing(false);
                const { message, result } = data;
                if (result) {
                    onLogin(result);
                } else {
                    setError(message);
                }
            });
    };

    return (
        <Grid className={classes.root}>
            <Paper elevation={10} className={classes.container}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <FormControl>
                        <TextField name="username" label="username" id="username" variant="standard" placeholder="username" required error={error != null} />
                        <TextField name="password" label="password" id="password" type="password" variant="standard" placeholder="password" required error={error != null} />
                        {error != null ? (
                            <FormHelperText
                                id="error"
                                style={{
                                    color: "red",
                                }}
                            >
                                {error}
                            </FormHelperText>
                        ) : (
                            <></>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            style={{
                                marginTop: "20px",
                            }}
                        >
                            {"Login"}
                        </Button>
                        {processing ? (
                            <div
                                style={{
                                    margin: "auto",
                                    marginTop: "20px",
                                }}
                            >
                                <CircularProgress size={50} />
                            </div>
                        ) : (
                            <></>
                        )}
                    </FormControl>
                </form>
            </Paper>
        </Grid>
    );
};

export default LoginPage;
