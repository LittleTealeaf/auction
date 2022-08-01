import { Button, Paper, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import css from "styles/forbidden.module.scss";
import { MouseEventHandler } from "react";
import { fetchAPI } from "lib/app/fetch";

export default function ForbiddenPage({}) {

    const actionLogout: MouseEventHandler<HTMLButtonElement> = (event) => {
        fetchAPI('DELETE','api/auth/login').then(response => response.json()).then(data => {
            const {oldSid, message, error} = data;
            if(oldSid) {
                document.location.href="/"
            }
        })
    };

    return (
        <div className={css.root}>
            <Paper className={css.paper}>
                <Typography variant="h4">Access Forbidden</Typography>
                <div className={css.actions}>
                    <Button variant="contained" startIcon={<HomeIcon />} href={"/"}>
                        Home
                    </Button>
                    <Button variant="contained" startIcon={<LogoutIcon />} onClick={actionLogout}>
                        Logout
                    </Button>
                </div>
            </Paper>
        </div>
    );
}
