import type { NextPage } from "next";
import { useAuthContext } from "./_app";

const Home: NextPage = () => {

    const auth = useAuthContext();

    return <>{auth}</>
};

export default Home;
