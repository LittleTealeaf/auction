import css from "styles/components/pages/login.module.scss";
import { FC, FormEventHandler, useState } from "react";
import { UserData } from "types/api";
import { Button, FormHelperText, Paper, TextField, Typography } from "@mui/material";
import { ElementTypes, getFormElement } from "src/app/form";
import { fetchApi, jsonResponse, requireStatus } from "src/app/api";
import LoadingElement from "components/LoadingElement";

type Parameters = {
    callback: (sid: string, user: UserData) => void;
};

const LoginPage: FC<Parameters> = ({ callback }) => {
    const [error, setError] = useState<string | undefined>(undefined);

    const [isProcessing, setIsProcessing] = useState(false);

    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        setIsProcessing(true);
        setError(undefined);
        event.preventDefault();

        const username = getFormElement<ElementTypes["TextField"]>(event, "username").value;
        const password = getFormElement<ElementTypes["TextField"]>(event, "password").value;

        fetchApi("api/auth/login", "POST", {
            username,
            password,
        })
            .then(requireStatus(200))
            .then(jsonResponse)
            .then((json) => {
                const { sid, user } = json;
                callback(sid as string, user as UserData);
                setIsProcessing(false);
            })
            .catch((error) => {
                setError("Invalid Login");
                setIsProcessing(false);
            });
    };

    return (
        <div className={css.root}>
            <Paper className={css.paper} elevation={24}>
                <Typography variant="h3">Login</Typography>
                <form onSubmit={onSubmit}>
                    <TextField error={error != null} name="username" className={css.input} id="username" label="username" required />
                    <TextField error={error != null} name="password" className={css.input} id="password" label="password" type="password" required />
                    {error && <FormHelperText className={css.error}>{error}</FormHelperText>}
                    <LoadingElement
                        className={css.submit}
                        active={isProcessing}
                        component={
                            <Button disabled={isProcessing} type="submit" variant="contained">
                                Sign In
                            </Button>
                        }
                    />
                </form>
            </Paper>
        </div>
    );
};

export default LoginPage;
