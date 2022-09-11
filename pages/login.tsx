import { Button, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { FormTypes, getFormElement } from "src/pages/forms";
import { WebPage } from "src/pages/next_wrapper";
import css from "styles/login.module.scss";

// function linkOnChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, listener: (value: string) => void) {
//   return (event) => {

//   }
// }



export default WebPage(({}) => {

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const username = getFormElement<FormTypes["TextField"]>(event,"username")?.value;
    const password = getFormElement<FormTypes["TextField"]>(event,"password")?.value;

  }

  return (
    <>
      <div id={css.page}>
        <div className={css.card}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h3">Log-in</Typography>
            <hr />
            <TextField id="username" label="username" variant="standard" required  />
            <TextField id="password" label="password" type="password" autoComplete="current-password" variant="standard" required  />
            <Button type="submit">Sign in</Button>
          </form>
        </div>
      </div>
    </>
  );
});
