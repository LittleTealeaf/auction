import { Alert, Button, FormControl, Grid, Paper, TextField } from "@mui/material";
import { NextPage } from "next";
import { ChangeEventHandler, CSSProperties, FormEventHandler, useState } from "react";

export type params = {
    authAbsorber: (key: string) => void;
};

export default function LoginPage({ authAbsorber }: params) {
    const [formValues, setFormValues] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState<string | null>(null);

    const handleInputChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        const response = await fetch("./api/login?" + new URLSearchParams(formValues));
        if (response.status == 200) {
            const json: {
                auth?: string | null;
                message?: string;
            } = await response.json();

            if (json.auth !== null && json.auth !== undefined) {
                authAbsorber(json.auth);
            } else {
                setError(json.message || null);
            }
        }
    };

    const ErrorField = () =>
        error == null ? (
            <></>
        ) : (
            <Alert
                severity="error"
                style={{
                    margin: "20px",
                }}
                onClose={() => setError(null)}
            >
                {error}
            </Alert>
        );

    return (
        <>
            <Grid>
                <div
                    style={{
                        margin: "auto",
                        marginTop: "20px",
                        width: "fit-content",
                    }}
                >
                    <Paper
                        elevation={10}
                        style={{
                            padding: "40px",
                            width: "fit-content",
                            margin: "auto",
                        }}
                    >
                        <Grid alignContent={"center"}></Grid>
                        <form onSubmit={handleSubmit}>
                            <FormControl>
                                <TextField name="username" id="username" label="username" variant="standard" placeholder="Enter username" fullWidth required onChange={handleInputChange} />
                                <TextField
                                    name="password"
                                    id="password"
                                    label="password"
                                    variant="standard"
                                    placeholder="Enter username"
                                    type="password"
                                    fullWidth
                                    required
                                    onChange={handleInputChange}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{
                                        marginTop: "20px",
                                    }}
                                >
                                    Login
                                </Button>
                            </FormControl>
                        </form>
                    </Paper>
                    <ErrorField />
                </div>
            </Grid>
        </>
    );
}
