import Head from "next/head";
import { FC, FormEventHandler, useState } from "react";
import { UserData } from "types/api";
import scss from "styles/login.module.scss";
import { Button, CircularProgress, FormHelperText, Paper, TextField, Typography } from "@mui/material";
import { getFormElements } from "lib/formwrapper";
import { fetchAPI } from "lib/fetchwrapper";

export type LoginScreenParams = {
    onLogin: (result: { sid: string; user: UserData }) => void;
};

const LoginScreen: FC<LoginScreenParams> = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const { username, password } = getFormElements(event, ["username", "password"]);

        fetchAPI("POST", "api/auth/login", {
            username: (username as { value: string }).value,
            password: (password as { value: string }).value,
        })
            .then((response) => response.json())
            .then((data) => {
                setLoading(false);
                const { message, result } = data;
                if (result) return onLogin(result);
                setError(message);
            });
    };

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className={scss.root}>
                <Paper className={scss.paper} elevation={24}>
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h3">Sign in</Typography>
                        <div className={scss.credentials}>
                            <TextField id="username" label="username" variant="standard" required error={error != null} />
                            <TextField id="password" label="password" variant="standard" type="password" required error={error != null} />
                        </div>
                        {error && <FormHelperText className={scss.error}>{error}</FormHelperText>}
                        <div className={scss.submit}>
                            <Button variant="contained" disabled={loading} type="submit">
                                Sign in
                            </Button>
                            {loading && <CircularProgress size={24} className={scss.progress} />}
                        </div>
                    </form>
                </Paper>
            </div>
        </>
    );
};

export default LoginScreen;
