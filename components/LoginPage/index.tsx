import css from "./style.module.scss";
import { FC, FormEventHandler, useState } from "react";
import { UserData } from "types/api";
import { Button, FormHelperText, Paper, TextField, Typography } from "@mui/material";
import { FormTypes, getFormElement } from "src/app/form";
import { compileResponse, fetchApi, onCompiledDefault, onCompiledStatus } from "src/app/api";
import LoadingElement from "components/LoadingElement";
import { MakeFC } from "src/react/wrappers";

type Props = {
    callback: (sid: string, user: UserData) => void;
};

export default MakeFC<Props>(({ callback }) => {
    const [error, setError] = useState<string | undefined>(undefined);
    const [isProcessing, setIsProcessing] = useState(false);

    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        setIsProcessing(true);
        setError(undefined);
        event.preventDefault();

        const username = getFormElement<FormTypes["TextField"]>(event, "username")?.value;
        const password = getFormElement<FormTypes["TextField"]>(event, "password")?.value;

        fetchApi("api/auth/login", "POST", {
            username,
            password,
        })
            .then(compileResponse)
            .then(
                onCompiledStatus(200, (json) => {
                    const { sid, user } = json;
                    callback(sid as string, user as UserData);
                })
            )
            .then(
                onCompiledDefault((json) => {
                    setError(json.message);
                })
            )
            .finally(() => {
                setIsProcessing(false);
            });
    };

    return (
        <div className={css.root}>
            <Paper className={css.paper} elevation={24}>
                <Typography variant="h3">Login</Typography>
                <form onSubmit={onSubmit}>
                    <TextField name="username" className={css.input} id="username" label="username" required />
                    <TextField name="password" className={css.input} id="password" label="password" type="password" required />
                    {error && <FormHelperText className={css.error}>{error}</FormHelperText>}
                    <LoadingElement className={css.submit} active={isProcessing}>
                        <Button disabled={isProcessing} type="submit" variant="contained">
                            Sign In
                        </Button>
                    </LoadingElement>
                </form>
            </Paper>
        </div>
    );
});
