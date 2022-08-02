import { AppPage } from "types/app";
import Head from "next/head";

const Home: AppPage = ({ user }) => {
    return (
        <>
            <Head>
                <title>Auction Home</title>
            </Head>
        </>
    );
};

export default Home;
