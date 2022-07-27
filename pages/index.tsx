import LoginPage from "components/login";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { URLSearchParams } from "url";
import { useAuthContext } from "./_app";

const Home: NextPage = () => {

    const auth = useAuthContext();

    return <>{auth}</>
};

export default Home;
